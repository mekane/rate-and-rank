const exec = require('child_process').exec;
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const FileStore = require('../src/FileStore');
const testDataPath = path.resolve(__dirname, 'fileStoreTestData');
const removeTestDataCommand = `rm -rf ${testDataPath}`;
console.log('===' + removeTestDataCommand);
exec(removeTestDataCommand);

describe('Filesystem side effects when using FileStore', () => {
    it('is initialized with a directory name, which is ensures exists', () => {
        const fileStore = FileStore(testDataPath);
        expect(fs.existsSync(testDataPath)).to.equal(true);
    });

    it(`doesn't care if the directory already exists`, () => {
        const fileStore = FileStore(testDataPath);
        expect(fs.existsSync(testDataPath)).to.equal(true);

        const fileStore2 = FileStore(testDataPath);
        expect(fs.existsSync(testDataPath)).to.equal(true);
    });

    it('creates a directory for the given key when setting data', () => {
        const fileStore = FileStore(testDataPath);
        fileStore.putDataFor('testId', 'testKey', {});
        const testDirPath = path.resolve(testDataPath, 'testId');

        expect(fs.existsSync(testDirPath)).to.equal(true);
    });

    it('creates a file for the given data key when setting data', () => {
        const fileStore = FileStore(testDataPath);
        fileStore.putDataFor('testId', 'testKey', {});
        const testFilePath = path.resolve(testDataPath, 'testId', 'testKey.json');

        expect(fs.existsSync(testFilePath), `${testFilePath} exists`).to.equal(true);
    });

    it(`converts spaces to _ and removes special characters from filenames`, () => {
        const fileStore = FileStore(testDataPath);
        fileStore.putDataFor('testId', '?@/#$| [(key)]!', {});
        const testFilePath = path.resolve(testDataPath, 'testId', '_key.json');

        expect(fs.existsSync(testFilePath), `${testFilePath} exists`).to.equal(true);
    });
});

describe('Setting and getting data', () => {
    it(`handles getting data for a key that doesn't exist`, () => {
        const fileStore = FileStore(testDataPath);
        expect(fileStore.getDataFor('testId', 'Nope')).to.be.an('undefined');
    });

    it('retrieves data at the same key that was used to set it', () => {
        const fileStore = FileStore(testDataPath);
        fileStore.putDataFor('testId', '1', 1);
        fileStore.putDataFor('testId', '2', 'Test String');
        fileStore.putDataFor('testId', '3', {foo: 'bar'});

        expect(fileStore.getDataFor('testId', '1')).to.equal('1');
        expect(fileStore.getDataFor('testId', '2')).to.equal('Test String');
        expect(fileStore.getDataFor('testId', '3')).to.eql("[object Object]");
    });

    it('persists across memory resets and object instances', () => {
        const fileStore1 = FileStore(testDataPath);
        fileStore1.putDataFor('testId', '1', '1');
        fileStore1.putDataFor('testId', '2', 'Test String');
        fileStore1.putDataFor('testId', '3', "{foo: 'bar'}");

        delete require.cache[require.resolve('../src/FileStore')];
        const ResetFileStore = require('../src/FileStore');

        const fileStore2 = ResetFileStore(testDataPath);
        expect(fileStore2.getDataFor('testId', '1')).to.equal('1')
        expect(fileStore2.getDataFor('testId', '2')).to.equal('Test String');
        expect(fileStore2.getDataFor('testId', '3')).to.eql("{foo: 'bar'}");
    });
});

describe('Listing data', () => {
    it('can list all the entries stored for a given directory', () => {
        const fileStore = FileStore(testDataPath);
        fileStore.putDataFor('newTestId', '1', '1');
        fileStore.putDataFor('newTestId', '2', 'Test String');
        fileStore.putDataFor('newTestId', '3', '{foo: "bar"}');

        expect(fileStore.listDataFor('newTestId')).to.deep.equal(['1', '2', '3']);
    });
});
