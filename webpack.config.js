const path = require('path');

const viewBundles = {
    entry: {
        'demo/browserDemo': './view/index.browserDemo.js',
        jsonApiClient: './view/index.jsonApiClient.js',
    },
    mode: 'production',
    target: 'web',
    output: {
        filename: '[name].bundle.js',
        library: 'DataGrid',
        path: path.resolve(__dirname, 'server', 'public')
    }
}

const serverBundle = {
    entry: './src/serverLib.js',
    mode: 'production',
    target: 'node',
    output: {
        filename: 'serverDependencies.js',
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'server', 'lib')
    }
}

module.exports = [viewBundles, serverBundle];
