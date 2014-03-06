// Use Mongoose ODM to help with persistence
var mongoose = require('mongoose');

// Set up Mongoose connection (this only needs to be done once in the app)
mongoose.connect(process.env.MONGOHQ_URL);

// Create a schema to store message data
var messageSchema = new mongoose.Schema({
    callSid:String,
    recordingUrl:String,
    transcription:String,
    betterTranscription:String
});

// Public module interface is a Message model object
module.exports = mongoose.model('Message', messageSchema);