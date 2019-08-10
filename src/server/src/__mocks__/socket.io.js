require('jest');

const socketIOInstanceMock = jest.genMockFromModule('socket.io');
const socketIOModuleMock = jest.fn(() => socketIOInstanceMock);

socketIOInstanceMock.set = jest.fn();
socketIOInstanceMock.on = jest.fn();

module.exports = socketIOModuleMock;
