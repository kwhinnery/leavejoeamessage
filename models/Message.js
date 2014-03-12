var mongoose = require('mongoose');

// Create a schema to store message data
var messageSchema = new mongoose.Schema({
    sid:String, // ID of the call or text in Twilio
    number:String, // Number of the person who called/texted in, never displayed
    type:String, // one of "call" or "text"
    recordingUrl:String, // URL of the recording (also in Twilio)
    recordingDuration:Number, // duration of recording, in seconds
    textMessage:String, // The text of the message received, if applicable
    fromCity:String,
    fromState:String,
    fromCountry:String,
    approved:{type: Boolean, default:false }, // New messages need to be moderated
    favorite:{type: Boolean, default:false }, // Favorites
    date:{ type: Date, default: Date.now }
});

// Find a filtered list of messages with the given offset
messageSchema.statics.listPublicMessages = function(favs, callback) {
    var queryOpts = { approved:true };

    if (favs) {
        queryOpts.favorite = true;
    }

    var query = this.find(queryOpts)
        .limit(50)
        .sort('-date')
        .select('-number -sid')
        .exec(callback);
};

// List all messages
messageSchema.statics.listMessages = function(options, callback) {
    var queryOpts = {};

    if (options.favorites) {
        queryOpts.favorite = true;
    }

    if (options.unapproved) {
        queryOpts.approved = false;
    }

    var query = this.find(queryOpts)
        .limit(200)
        .sort('-date')
        .exec(callback);
};

// Public module interface is a Message model object
module.exports = mongoose.model('Message', messageSchema);