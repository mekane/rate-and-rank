const express = require('express');
const bodyParser = require('body-parser');

const DataGrid = require('../src/DataGrid');

//for accepts-content matching
const html = 'text/html';
const json = 'application/json';

let userRepository;

let initialized = false;

function initialize(port, injectedSessionHandler, injectedUserRepo) {
    if (initialized)
        throw new Error('Error server is already running!');

    userRepository = injectedUserRepo;

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
        path: '/grid/new',
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
            res.render('home', {title: Date.now()});
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

    const grids = getGridNamesFromSession(req.session);

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
    const grid = restoreGridFromSession(req.session, gridId);
    const gridName = grid.getState().config.name;

    return res.format({
        html: _ => {
            logRequest(req, html, `show grid application page for grid ${gridId}`);
            res.render('grid', {title: gridName, gridName});
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

    logRequest(req, html, 'Show new grid form');
    return res.render('newGridForm', {title: 'New Grid Form'});
    //TODO: do something sane for JSON?
}

function postNewGrid(req, res) {
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    const config = JSON.parse(req.body.config);
    const rows = JSON.parse(req.body.rows || '[]');

    logRequest(req, html, 'Got new form post data');
    console.log(config);
    console.log(rows);

    const grid = DataGrid(config, rows);
    console.log(grid.getState());

    const newId = saveGridToSession(req.session, grid);

    return res.send('Saved grid under id ' + newId); //TODO: better response here
    //TODO: JSON response
}

function putGridAction(req, res) {
    if (!isLoggedIn(req)) {
        return enforceLoggedIn(req, res)
    }

    const gridId = req.params['id'];
    const grid = restoreGridFromSession(req.session, gridId);
    const action = JSON.parse(req.body.action);
    grid.send(action);
    saveGridToSession(req.session, grid, gridId);

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

/** -------- Grid Persistance -------- **/
function getGridNamesFromSession(session, gridName) {
    const grids = session.grids || {};
    return Object.keys(grids).map(id => ({
        id,
        name: grids[id].config.name
    }));
}

function restoreGridFromSession(session, gridId) {
    if (session.grids) {
        const gridData = session.grids[gridId];
        return DataGrid(gridData.config, gridData.rows);
    }
}

function saveGridToSession(session, gridObj, gridId) {
    let id = gridId;
    if (typeof gridId === 'undefined') {
        id = 'g' + Date.now();
    }

    if (typeof session.grids !== 'object') {
        session.grids = {};
    }

    session.grids[id] = gridObj.getState();

    return id;
}

module.exports = {
    initialize
};