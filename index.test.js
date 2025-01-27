const assert = require('assert');
const sinon = require('sinon');
const { fetchLastTenLinesOffSet, initialFileLoad, readNewLines } = require('./index.js');

describe('Log File Reading', function () {

    let socketMock;
    let ioMock;

    beforeEach(() => {
        socketMock = { emit: sinon.spy() };
        ioMock = { emit: sinon.spy() };
    });

    describe('fetchLastTenLinesOffSet', function () {
        it('should return 0 when there are less than 10 lines', async function () {
            const filePath = './testFile1.txt';
            const offset = await fetchLastTenLinesOffSet(filePath);
            assert.strictEqual(offset, 0, 'Offset should be 0 for less than 10 lines');
        });

        it('should return the correct offset when there are more than 10 lines', async function () {
            const filePath = './testFile2.txt';
            const offset = await fetchLastTenLinesOffSet(filePath);
            assert.strictEqual(offset, 5, 'Offset should be 5 for 15 lines');
        });
    });
});


