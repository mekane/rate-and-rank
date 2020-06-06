const path = require('path');

module.exports = {
    entry: {
        'demo/browserDemo': './view/index.browserDemo.js',
        jsonApiClient: './view/index.jsonApiClient.js',
    },
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        library: 'DataGrid',
        path: path.resolve(__dirname, 'server', 'public')
    }
};