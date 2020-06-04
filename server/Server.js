const express = require('express');
const bodyParser = require('body-parser');

const DataGrid = require('../src/DataGrid');

//for accepts-content matching
const html = 'text/html';
const json = 'application/json';

let userRepository;
let dataStore;

let initialized = false;

function initialize(port, injectedSessionHandler, injectedUserRepo, injectedDataStore) {
    if (initialized)
        throw new Error('Error server is already running!');

    userRepository = injectedUserRepo;
    dataStore = injectedDataStore;

    const app = express();
    app.engine('mustache', require('mustache-express')());
    app.set('view engine', 'mustache');

    app.use(express.static('public'));
    app.use(injectedSessionHandler);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    setupRouting(app);
    app.use(send404); //

    app.listen(port, () => console.log(`Rate and Rank app listening on port ${port}!`));
    initialized = true;
}

const loginpath = '/login';
const newGridPath = '/grid/new';
const routes = [
    {
        path: loginpath,
        method: 'get',
        description: 'Show login page',
        handler: getLogin
    },
    {
        path: loginpath,
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
        path: '/',
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
        html: _ => res.render('login', {
            title: 'Login',
            status: {message: 'Please log in to see the requested content'},
            redirect: req.path  //TODO: use redirect after login
        }),
        json: _ => res.json({loggedin: false, error: true, message: `login required to access ${path}`})
    });
    res.end();
}

function getLogin(req, res) {
    const loggedin = isLoggedIn(req);

    return res.format({
        html: _ => {
            if (loggedin) {
                logRequest(req, html, 'logged in - redirect to home');
                res.redirect('/');
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
                loginpath,
                method: "post",
                required: ["username", "password"]
            });
        }
    });
}

function getLogout(req, res) {
    logRequest(req, html, 'Log Out');
    if (req.session) {
        req.session.destroy(function (e) { //TODO: test with two sessions? Do I need to specify my session id?
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

    const user = userRepository.getUser(username, password);

    if (user == null) {
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

        return res.format({
            html: _ => {
                logRequest(req, html, 'successful login - redirect to homepage');
                res.redirect('/');
            },
            json: _ => {
                logRequest(req, json, 'successful login - send success data');
                res.json({loggedin: true});
            }
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
            const routeInfo = routes.map(route => ({
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
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    const gridId = req.params['id'];
    const grid = retrieveGrid(req, gridId);
    console.log('[show grid] retrieved ', grid.getState());
    const tempData = JSON.stringify(grid.getState());

    if (!grid) {
        return res.status(404).format({
            html: _ => {
                logRequest(req, html, `get grid ${gridId} 404`);
                res.render('grid', {title: gridName, gridName});
            },
            json: _ => {
                logRequest(req, json, `grid state ${gridId} 404`);
                res.json({error: true, errorCode: 404, message: `grid id ${gridId} not found`});
            }
        });
    }

    const gridName = grid.getState().config.name;

    return res.format({
        html: _ => {
            logRequest(req, html, `show grid application page for grid ${gridId}`);
            res.render('grid', {title: gridName, gridName, tempData});
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
    const grid = restoreGridFromSession(req.session, gridId);
    const action = JSON.parse(req.body.action);
    grid.send(action);

    saveGrid(req, grid, gridId);

    return res.format({
        html: _ => {
            //TODO: something for html?
        },
        json: _ => {
            logRequest(req, json, `sent action to ${gridId}: ${action}`);
            res.json(grid.getState());
        }
    });
}

function send404(req, res, next) {
    return res.status(404).render('pageNotFound', {title: "Page Not Found", path: req.path});
}

/** -------- Utils -------- **/
function logRequest(req, contentType, message) {
    console.log(`${req.method} ${req.path} ${contentType} - ${message}`);
}

/** -------- Grid Persistence -------- **/
function retrieveGrid(req, gridId) {
    //try session "cache first"
    const session = req.session;
    let grid = restoreGridFromSession(session, gridId);

    //fall back to permanent storage
    if (!grid) {
        const userId = session.userId;

        if (!userId)
            return null;

        const gridData = dataStore.getDataFor(userId, gridId);
        console.log('[retrieve grid] got grid data', data);
        grid = DataGrid(gridData.config, gridData.rows);
    }

    return grid;
}

function saveGrid(req, gridObj, gridId) {
    let id = gridId;
    if (typeof gridId === 'undefined') {
        id = 'grid_' + Date.now();
    }

    const session = req.session;
    const userId = req.session.userId;
    if (!userId)
        console.warn('WARNING userId is falsy');

    //always save data to session and to permanent storage
    saveGridToSession(session, gridObj, id);
    dataStore.putDataFor(userId, id, gridObj.getState());

    return id;
}

function getGridNamesForUser(req) {
    const userId = req.session.userId;
    if (!userId)
        return [];

    const entries = dataStore.listDataFor(userId);

    const list = [];

    entries.forEach(gridId => {
        const grid = dataStore.getDataFor(userId, gridId);
        console.log(grid);
        if (grid.config && grid.config.name)
            list.push({
                id: gridId,
                name: grid.config.name
            });
    });

    return list;
}

function restoreGridFromSession(session, gridId) {
    if (session.grids) {
        const gridData = session.grids[gridId];
        return DataGrid(gridData.config, gridData.rows);
    }
}

function saveGridToSession(session, gridObj, gridId) {
    if (typeof session.grids !== 'object') {
        session.grids = {};
    }

    console.log('[save to session]', gridObj.getState())
    session.grids[gridId] = gridObj.getState();
}

module.exports = {
    initialize
};