const port = 8666;
const fileStore = require('session-file-store');
const Server = require('Server');

/* Placeholder user store for development */
const userStore = require('./hardcoded-user-store');

Server.initialize(port,)