const SMSClient = require('../sms')

it('creates a new Twilio client', () => {
    const sms = new SMSClient();

    expect(sms.twilio).toBeTruthy();
});

it('sends messages through Twilio client', () => {
    const sms = new SMSClient();
    const to = 'my friend';
    const sender = 'me';
    const message = 'hello world';
    process.env.TWILIO_SENDER = sender;

    sms.sendMessage(to, message);

    expect(sms.twilio.messages.create.mock.calls.length).toBe(1);
    expect(sms.twilio.messages.create.mock.calls[0][0].to).toBe(to);
    expect(sms.twilio.messages.create.mock.calls[0][0].from).toBe(sender);
    expect(sms.twilio.messages.create.mock.calls[0][0].body).toBe(message);

    delete process.env.TWILIO_SENDER;
});
