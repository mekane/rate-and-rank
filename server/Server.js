const express = require('express');
const bodyParser = require('body-parser');

const DataGrid = require('./lib/serverDependencies').DataGrid;

//for accepts-content matching
const html = 'text/html';
const json = 'application/json';

let userRepository;
let dataStore;

let baseUrl = '';
let initialized = false;

const inMemoryGridsPerUser = {};

function accessLogger(req, res, next) {
    const date = new Date().toDateString();
    const path = req.path;
    console.log(`*** Request: ${date} ${req.ip} ${req.method} ${path}`);
    next();
}

function initialize(port, injectedHostname, injectedSessionHandler, injectedUserRepo, injectedDataStore) {
    if (initialized)
        throw new Error('Error server is already running!');

    userRepository = injectedUserRepo;
    dataStore = injectedDataStore;

    const app = express();
    app.engine('mustache', require('mustache-express')());
    app.set('view engine', 'mustache');

    app.use(accessLogger);
    app.use(express.static('public'));
    app.use(injectedSessionHandler);
    app.use(bodyParser.json({limit: '1mb'}));
    app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));

    setupRouting(app);
    app.use(send404); //

    baseUrl = `http://${injectedHostname}:${port}`;

    app.listen(port, () => console.log(`Rate and Rank app listening at ${baseUrl}`));
    initialized = true;
}

const loginPath = '/login';
const newGridPath = '/grid/new';
const routes = [
    {
        path: loginPath,
        method: 'get',
        description: 'Show login page',
        handler: getLogin
    },
    {
        path: loginPath,
        method: 'post',
        description: 'Send a login request',
        handler: postLogin
    },
    {
        path: '/logout',
        method: 'get',
        description: 'Remove session information',
        handler: getLogout
    },
    {
        path: '/home',
        method: 'get',
        description: 'Show home page / lists all available routes',
        handler: getHome
    },
    {
        path: '/grid',
        method: 'get',
        description: 'Lists grids for the current user',
        handler: getListOfGridsForUser
    },
    {
        path: '/grid/new',
        method: 'get',
        description: 'Show a form for creating a new grid',
        handler: getNewGridForm
    },
    {
        path: newGridPath,
        method: 'post',
        description: 'Post config and initial row data to create a new grid',
        handler: postNewGrid
    },
    {
        path: '/grid/:id',
        method: 'get',
        description: 'Show a grid app or get grid state',
        handler: getGrid
    },
    {
        path: '/grid/:id/action',
        method: 'put',
        description: 'Send an action to a grid',
        handler: putGridAction
    }
];

function setupRouting(app) {
    routes.forEach(route => app[route.method](route.path, route.handler));
}

function isLoggedIn(request) {
    return (request.session ? !!request.session.loggedin : false);
}

function enforceLoggedIn(req, res) {
    res.format({
        html: _ => {
            logRequest(req, html, 'not logged in - render login page');
            res.render('login', {
                title: 'Login',
                status: {message: 'Please log in to see the requested content'},
                redirect: req.path  //TODO: use redirect after login
            });
        },
        json: _ => {
            logRequest(req, json, `not logged in - show login message`);
            res.json({
                loggedin: false,
                error: true,
                loginpath: loginPath,
                message: `login required to access ${req.path}`
            });
        },
        default: _ => {
            logRequest(req, 'DEFAULT', 'no acceptable content found');
            res.status(406).send('Not Acceptable');
        }
    });
}

function getLogin(req, res) {
    const loggedin = isLoggedIn(req);

    return res.format({
        html: _ => {
            if (loggedin) {
                logRequest(req, html, 'logged in - redirect to home');
                res.redirect('/home');
            }
            else {
                logRequest(req, html, `not logged in - show login page`);
                res.render('login', {title: 'Login'});
            }
        },
        json: _ => {
            logRequest(req, json, 'return login data');
            res.json({
                loggedin,
                loginpath: loginPath,
                method: "post",
                required: ["username", "password"]
            });
        }
    });
}

function getLogout(req, res) {
    logRequest(req, html, 'Log Out');
    if (req.session) {
        req.session.destroy(function(e) { //TODO: test with two sessions? Do I need to specify my session id?
            console.log('Session Destroyed');
        });
    }
    res.clearCookie('sid');
    return res.format({
        html: _ => res.render('login', {title: 'Login', status: {message: 'logout'}}),
        json: _ => res.json({loggedin: false})
    });
}

function postLogin(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const path = req.body.path;
    const user = userRepository.getUser(username, password);

    console.log(`Login posted for user ${username}`);

    if (user == null) {
        console.log('  user not found - back to login page');
        return res.format({
            html: _ => {
                logRequest(req, html, 'bad login - show error page');
                res.render('login', {
                    title: 'Login Error',
                    status: {message: 'Wrong username or password', error: 'error'}
                });
            },
            json: _ => {
                logRequest(req, json, 'bad login - return error data');
                res.json({loggedin: false, error: true, message: "wrong username or password"});
            }
        });
    }
    else {
        req.session.loggedin = true;
        req.session.userId = username;
        req.session.username = username;

        const redirectPath = (typeof path === 'string' && path.length > 0) ? path : '/home';
        console.log(`  successful login - redirect to ${redirectPath}`);

        req.session.save(function(err) {
            console.log('  done saving login to session ', err);
            return res.format({
                html: _ => {
                    logRequest(req, html, `successful login - redirect to ${path}`);
                    res.redirect(redirectPath);
                },
                json: _ => {
                    logRequest(req, json, 'successful login - send success data');
                    res.json({loggedin: true});
                }
            });
        });
    }
}

function getHome(req, res) {
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    return res.format({
        html: _ => {
            logRequest(req, html, 'show homepage');
            res.render('home', {title: 'Rate and Rank Home'});
        },
        json: _ => {
            logRequest(req, json, 'send all routes data');
            const routeInfo = routes.filter(r => r.description).map(route => ({
                method: route.method,
                path: route.path,
                description: route.description
            }));
            res.json(routeInfo)
        }
    });
}

function getListOfGridsForUser(req, res) {
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    const grids = getGridNamesForUser(req);

    return res.format({
        html: _ => {
            logRequest(req, html, `show grid list page`);
            res.render('list', {title: 'All Data Grids', grids});
        },
        json: _ => {
            logRequest(req, json, `return list of grids`);
            res.json(grids);
        }
    });
}

function getGrid(req, res) {
    const gridId = req.params['id'];
    console.log(`  getGrid ${gridId}`);

    if (!isLoggedIn(req)) {
        console.log('  not logged in - enforce login');
        return enforceLoggedIn(req, res);
    }

    const grid = retrieveGrid(req, gridId);

    if (!grid) {
        console.log('  grid is falsy, show 404');
        return send404(req, res);
    }

    const gridName = grid.getState().config.name;
    const numberOfUndos = grid.getUndoCount();
    const numberOfRedos = grid.getRedoCount();

    const actionUrl = baseUrl + `/grid/${gridId}/action`;
    const getStateUrl = baseUrl + `/grid/${gridId}`;

    console.log(`  got grid ${gridName}, rendering`);
    return res.format({
        html: _ => {
            logRequest(req, html, `show grid application page for grid ${gridId}`);
            res.render('grid', {title: gridName, gridName, actionUrl, getStateUrl, numberOfUndos, numberOfRedos});
        },
        json: _ => {
            logRequest(req, json, `return grid state for grid ${gridId}`);
            res.json(grid.getState());
        }
    });
}

function getNewGridForm(req, res) {
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    return res.format({
        html: _ => {
            logRequest(req, html, 'Show new grid form');
            return res.render('newGridForm', {title: 'New Grid Form'});
        },
        json: _ => {
            logRequest(req, html, 'Show path info for posting new form');
            return res.json({
                message: `To create a new form post to ${newGridPath}`,
                path: newGridPath,
                parameters: [
                    {name: "config"},
                    {name: "rows"}
                ]
            });
        }
    });
}

function postNewGrid(req, res) {
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    const config = JSON.parse(req.body.config);
    const rows = JSON.parse(req.body.rows || '[]');
    const grid = DataGrid(config, rows);
    const newId = saveGrid(req, grid);

    return res.format({
        html: _ => {
            logRequest(req, html, 'Got new form post data');
            return res.render('newGridSuccess', {title: 'New Grid Created', newId});
        },
        json: _ => {
            logRequest(req, json, 'Got new form post data');
            return res.send({
                success: true,
                id: newId
            });
        }
    });
}

function putGridAction(req, res) {
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    const gridId = req.params['id'];
    const grid = retrieveGrid(req, gridId);
    const action = req.body.action;

    if (typeof action === 'object') {
        grid.send(action);
        saveGrid(req, grid, gridId);

        return res.format({
            html: _ => {
                return res.send('ok');
            },
            json: _ => {
                logRequest(req, json, `sent action to ${gridId}: ${JSON.stringify(action)}`);
                return res.json(grid.getState());
            }
        });
    }

    return res.format({
        html: _ => {
            return res.send('400 Error, invalid action "' + action + '"');
        },
        json: _ => {
            logRequest(req, json, `sent action to ${gridId}: ${action}`);
            return res.status(400).json({error: true, message: `invalid action "${action}"`});
        }
    });

}

function send404(req, res, next) {
    console.log(`Hit 404 for ${req.path}`);
    return res.status(404).render('pageNotFound', {title: "Page Not Found", path: req.path});
}

/** -------- Utils -------- **/
function logRequest(req, contentType, message) {
    console.log(`${req.method} ${req.path} ${contentType} - ${message}`);
}

/** -------- Grid Persistence -------- **/
function retrieveGrid(req, gridId) {
    const session = req.session;
    const userId = session.userId;

    if (!userId)
        return null;

    let grid = getLiveGridFromCache(userId, gridId);

    if (!grid) {
        const gridJson = dataStore.getDataFor(userId, gridId);
        grid = DataGrid(gridJson);
    }

    return grid;
}

function saveGrid(req, gridObj, gridId) {
    let name = '';
    try {
        name = gridObj.getState().config.name;
    } catch (err) {
        console.warn('[saveGrid] grid obj appears bogus', err);
        return gridId;
    }

    let id = gridId;

    if (typeof gridId === 'undefined') {
        id = `grid_${name}_${Date.now()}`;
    }

    const session = req.session;
    const userId = session.userId;
    if (!userId)
        console.warn('WARNING userId is falsy');

    saveGridToCache(session, userId, id, gridObj);
    dataStore.putDataFor(userId, id, gridObj.toJson());

    return id;
}

function getGridNamesForUser(req) {
    const userId = req.session.userId;
    if (!userId)
        return [];

    const entries = dataStore.listDataFor(userId);

    const list = [];

    entries.forEach(gridId => {
        const gridJson = dataStore.getDataFor(userId, gridId);
        const grid = DataGrid(gridJson);
        if (grid)
            list.push({
                id: gridId,
                name: grid.getState().config.name
            });
    });

    return list;
}

function getLiveGridFromCache(userId, gridId) {
    if (inMemoryGridsPerUser[userId]) {
        return inMemoryGridsPerUser[userId][gridId];
    }
}

function saveGridToCache(session, userId, gridId, gridObj) {
    if (typeof inMemoryGridsPerUser[userId] !== 'object') {
        inMemoryGridsPerUser[userId] = {};
    }

    inMemoryGridsPerUser[userId][gridId] = gridObj;
}

module.exports = {
    initialize
};
