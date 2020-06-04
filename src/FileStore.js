/**
 * A general-purpose file store that creates a directory per user and stores data
 * as flat files within it using JSON.toString(data).
 */
const fs = require('fs');
const path = require('path');

const memCheat = {};

function FileStore(dataPath) {
    ensureDirectory(dataPath);

    function getDataFor(dirKey, entryKey) {
        const userDir = path.resolve(dataPath, dirKey);
        const fileName = path.resolve(userDir, dataFileName(entryKey))
        let fileContents;
        try {
            fileContents = fs.readFileSync(fileName, 'utf8');
        } catch (e) {
            console.log(e);
            return;
        }
        //console.log(`Read ${fileName}`);
        //console.log(fileContents);
        return fileContents;
    }

    function listDataFor(dirKey) {
        const userDir = path.resolve(dataPath, dirKey);
        try {
            listOfFiles = fs.readdirSync(userDir, 'utf8');
        } catch (e) {
            console.log(e);
            return []
        }
        return listOfFiles.map(stripJson);

        function stripJson(fileName) {
            if (fileName.endsWith('.json'))
                return fileName.substring(0, fileName.length - 5);
            return fileName;
        }
    }

    function putDataFor(dirKey, entryKey, data) {
        const userDir = path.resolve(dataPath, dirKey);
        const fileName = path.resolve(userDir, dataFileName(entryKey))

        if ( typeof data !== 'string')
            console.warn('[FileStore] trying to persist non-string data', data);

        ensureDirectory(userDir);
        const file = fs.openSync(fileName, 'w');
        fs.writeSync(file, data);
        fs.closeSync(file);
    }

    return {
        getDataFor,
        listDataFor,
        putDataFor
    };
}

function ensureDirectory(path) {
    //console.log(`[FileStore] ensure directory (${path}) exists`);
    fs.mkdirSync(path, {recursive: true});
}

function dataFileName(name) {
    const noSpaces = name.replace(/\s|-/g, '_');
    const noSpecialChars = noSpaces.replace(/[\W]/g, '');
    return noSpecialChars + '.json';
}

module.exports = FileStore;