var fs = require('fs'),
    path = require('path'),
    Message = require('../models/Message');

// Display home page
exports.index = function(request, response) {
    response.render('home', {
        title:'Leave Joe A Message',
        staticfile:'home'
    });
};

// Retrieve list of messages for display on the home page
exports.list = function(request, response) {
    // Get query params
    var favorites = request.param('favorites') ? true : false;

    // Query for public accessible messages
    Message.listPublicMessages(favorites, function(err, models) {
        if (err) {
            response.send(500, err);
        } else {
            response.send(models);
        }
    });
};