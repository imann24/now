const Twilio = require('twilio');

class SMSClient {
    constructor() {
        this.twilio = Twilio(process.env.TWILIO_SID,
                             process.env.TWILIO_AUTH_TOKEN)
    }

    sendMessage(to, body) {
        this.twilio.messages.create({
            to: to,
            from: process.env.TWILIO_SENDER,
            body: body
        });
    }
}

module.exports = SMSClient;
