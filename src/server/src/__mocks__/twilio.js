const twilioInstanceMock = jest.genMockFromModule('twilio');
const twilioModuleMock = jest.fn(() => twilioInstanceMock);

twilioInstanceMock.messages = jest.fn()
twilioInstanceMock.messages.create = jest.fn();

module.exports = twilioModuleMock;
