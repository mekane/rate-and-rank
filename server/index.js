const port = 8666;
const session = require('express-session')
const SessionFileStore = require('session-file-store')(session);
const Server = require('./Server');
const JsonFileStore = require('./lib/serverDependencies').FileStore;

const sessionOptions = {
    secret: '6fe978e29217c19e939da7e95453',
    resave: false,
    saveUninitialized: true,
    store: new SessionFileStore({ttl: 86400})
};
const sessionMiddleware = session(sessionOptions);

/* Placeholder user store for development */
const userStore = require('./hardcoded-user-store');

fileStore = JsonFileStore('data');

Server.initialize(port, sessionMiddleware, userStore, fileStore);