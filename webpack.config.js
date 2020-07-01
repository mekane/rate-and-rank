const path = require('path');

const viewBundles = {
    entry: {
        'demo/browserDemo': './src/BrowserOnlyGridViewModule/index.js',
        serverBackedGridView: './src/ServerBackedGridViewModule/index.js',
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
    entry: './src/Server/index.js',
    mode: 'production',
    target: 'node',
    output: {
        filename: 'serverDependencies.js',
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'server', 'lib')
    }
}

const newGridFormBundle = {
    entry: './src/NewGridForm/index.js',
    //mode: 'production',
    mode: 'development',
    target: 'web',
    output: {
        filename: 'newGridForm.bundle.js',
        library: 'NewGridForm',
        path: path.resolve(__dirname, 'server', 'public')
    }
}

module.exports = [viewBundles, serverBundle, newGridFormBundle];
