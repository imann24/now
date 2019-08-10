const bodyParserMock = jest.genMockFromModule('body-parser');

bodyParserMock.json = jest.fn();
bodyParserMock.urlencoded = jest.fn();

module.exports = bodyParserMock;
