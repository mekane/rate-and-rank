const path = require('path');

module.exports = {
    entry: './view/src/rateAndRank.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'demo')
    }
};