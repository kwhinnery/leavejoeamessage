var twilio = require('twilio'),
    Message = require('../models/Message');

// Webhook middleware, check request signature
exports.webhook = twilio.webhook({
    // Only validate requests in production
    validate: process.env.NODE_ENV === 'production',

    // Manually configure the host and protocol used for webhook config - this
    // is the URL our Twilio number will hit in production
    host:'rev-answering-machine.herokuapp.com',
    protocol:'https'
});

// Handle incoming voice calls
exports.voice = function(request, response) {
    var twiml = new twilio.TwimlResponse();

    twiml.say('Hi there! Thanks for calling to wish Joe good luck this season. Please leave your message after the beep.')
        .record({
            maxLength:20,
            action:'/recording'
        });

    response.send(twiml);
};

// Handle recordings
exports.recording = function(request, response) {
    // Create a new saved message object from the Twilio data
    var msg = new Message({
        sid: request.param('CallSid'),
        type:'call',
        recordingUrl: request.param('RecordingUrl'),
        recordingDuration: Number(request.param('RecordingDuration')),
        fromCity:request.param('FromCity'),
        fromState:request.param('FromState'),
        fromCountry:request.param('FromCountry')
    });

    // Save it to our MongoDB 
    msg.save(function(err, model) {
        var twiml = new twilio.TwimlResponse()
            .say('Thanks for leaving Joe a message - your message will appear on the web site once we confirm it doesn\'t contain naughty language.  Goodbye!', {
                voice:'alice'
            })
            .hangup();
        response.send(twiml);
    });
};

// Handle inbound SMS
exports.sms = function(request, response) {
    // Create a new saved message object from the Twilio data
    var msg = new Message({
        sid: request.param('MessageSid'),
        type:'text',
        textMessage:request.param('Body'),
        fromCity:request.param('FromCity'),
        fromState:request.param('FromState'),
        fromCountry:request.param('FromCountry')
    });

    // Save it to our MongoDB
    msg.save(function(err, model) {
        var twiml = new twilio.TwimlResponse()
            .message('Thanks for sending Joe a text!  Your message will appear on the web site once we confirm it doesn\'t contain naughty language :)');
        response.send(twiml);
    });
};