function DataGrid(initialConfig) {

    function getInitialConfig() {
        return JSON.parse(JSON.stringify(initialConfig));
    }

    return {
        getInitialConfig
    };
}


module.exports = DataGrid;