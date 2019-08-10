require('jest');

const pathMock = jest.genMockFromModule('path');

path.join = jest.fn();

module.exports = pathMock;
