require('jest');

const appMock = jest.genMockFromModule('express');
const expressModuleMock = jest.fn(() => appMock);
const serverMock = jest.mock();

appMock.listen = jest.fn(() => serverMock);
appMock.use = jest.fn();
appMock.get = jest.fn();
appMock.post = jest.fn();

serverMock.close = jest.fn();

module.exports = expressModuleMock;
