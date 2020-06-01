const express = require('express');
const bodyParser = require('body-parser');

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
    app.use(express.static('public'));
    app.use(injectedSessionHandler);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.engine('mustache', require('mustache-express')());
    app.set('view engine', 'mustache');

    setupRouting(app);

    app.listen(port, () => console.log(`Rate and Rank app listening on port ${port}!`));
    initialized = true;
}

const loginpath = '/login';
const routes = [
    {
        method: 'get',
        path: loginpath,
        description: 'Show login page',
        handler: getLogin
    },
    {
        method: 'post',
        path: loginpath,
        description: 'Send a login request',
        handler: postLogin
    },
    {
        method: 'get',
        path: '/logout',
        description: 'Remove session information',
        handler: getLogout
    },
    {
        method: 'get',
        path: '/',
        description: 'Show home page / lists all available routes',
        handler: getHome
    },
    {
        method: 'get',
        path: '/grid',
        description: 'Lists grids for the current user',
        handler: getListOfGridsForUser
    },
    {
        method: 'get',
        path: '/grid/:id',
        description: 'Show a grid app or get grid state',
        handler: getGrid
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

    res.format({
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
    res.format({
        html: _ => res.render('login', {title: 'Login', status: {message: 'logout'}}),
        json: _ => res.json({loggedin: false})
    });
}

function postLogin(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const user = userRepository.getUser(username, password);

    if (user == null) {
        res.format({
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
        res.format({
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

    const grids = getGridsFromSession(req.session);

    res.format({
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
    const grid = activeGrids[gridId];
    const gridName = grid.getState().config.name;

    res.format({
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

function logRequest(req, contentType, message) {
    console.log(`${req.method} ${req.path} ${contentType} - ${message}`);
}

function getGridsFromSession(session) {
    return [];
}

module.exports = {
    initialize
};