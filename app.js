// Dependencies
var twilio = require('twilio'),
    request = require('request'),
    Message = require('./Message');

// Use the rev.com REST API to order a transcription of a recording
function orderTranscription(callSid, recordingUrl) {

}

// Create a pre-configured Express web app using gopher
var app = require('gopher');

// Create Twilio webhooks to handle inbound calls, as well as recordings and 
// transcriptions
var webhook = twilio.webhook({
    // Only validate requests in production
    validate: process.env.NODE_ENV === 'production',
    
    // Manually configure the host and protocol used for webhook config
    host:'rev-answering-machine.herokuapp.com',
    protocol:'https'
});

// Handle incoming voice call
app.post('/voice', webhook, function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.say('Please leave a message after the beep. Press star to end the recording.', {
        voice:'alice'
    }).record({
        finishOnKey:'*',
        action:'/recording',
        transcribeCallback:'/transcription/twilio'
    });

    response.send(twiml);
});

// Handle a new recording being completed
app.post('/recording', webhook, function(request, response) {
    // Create a new saved message object from the Twilio data
    var msg = new Message({
        callSid:request.param('CallSid'),
        recordingUrl:request.param('RecordingUrl')
    });

    // Save it to our MongoDB 
    msg.save(function(err, model) {
        var twiml = new twilio.TwimlResponse();
        if (err) {
            // Inform the user there was an error
            twiml.say('There was an error leaving your message. Please try again', {
                voice:'alice'
            }).redirect('/voice');
        } else {
            // Once we have the recording, Twilio is already working on the auto
            // transcription, but we'll also order a better transcription using
            // rev.com
            orderTranscription(model.callSid, model.recordingUrl);

            // Let the user know the message has been recorded
            twiml.say('Thanks for leaving a message.  Goodbye.', {
                voice:'alice'
            });
        }
        response.send(twiml);
    });
});

// Handle the computer-generated transcription of the recording 
app.post('/transcription/twilio', webhook, function(request, response) {
    // Find a message with the given call SID
    Message.findOne({
        callSid:request.param('CallSid')
    }, function(err, message) {
        // update the relevant message
        if (message) {
            message.transcription = request.param('TranscriptionText');
            response.send('ok');
        }
    });
});

// Handle webhook request from Rev indicating that the transcription job has
// been completed
app.post('/transcription/rev', function(request, response) {
    response.send('ok');
});