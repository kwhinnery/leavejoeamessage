var express = require('express'),
    Message = require('../models/Message');

// Create basic auth middleware used to authenticate all admin requests
exports.auth = express.basicAuth(process.env.BASIC_UN, process.env.BASIC_PW);

// Middleware to redirect all non-secure traffic to an SSL endpoint - use
// Heroku's header to determine if the original request was over SSL or not
exports.secure = function(request, response, next) {
    // Check current environment and Heroku protocol header
    var prod = process.env.NODE_ENV === 'production',
        notSecure = request.header('x-forwarded-proto') !== 'https';

    // Redirect to SSL if necessary
    if (prod && notSecure) {
        var host = request.header('host'), url = request.url;
        response.redirect('https://'+ host + url);
    }

    // Otherwise continue to process the request
    next();
};

// Render admin home page
exports.index = function(request, response) {
    response.render('admin', {
        title: 'Moderate Messages',
        staticfile: 'admin'
    });
};

// Get a list of messages
exports.messages = function(request, response) {
    // Get query params
    var favorites = request.param('favorites') ? true : false,
        unapproved = request.param('unapproved') ? true : false;

    // Query for public accessible messages
    Message.listMessages({ 
        unapproved: unapproved, 
        favorites: favorites 
    }, function(err, models) {
        if (err) {
            response.send(500, err);
        } else {
            response.send(models);
        }
    });
};

// Update a given message
exports.update = function(request, response) {
    console.log(request.param('props'));
    // Args for find and update
    var id = request.param('id'),
        props = JSON.parse(request.param('props'));

    // Update message based on input from client
    Message.findByIdAndUpdate(id, props, function(err, doc) {
        if (err) {
            response.send(500, err);
        } else {
            response.send(doc);
        }
    });
};

// Delete a given message
exports.delete = function(request, response) {
    // Args for find and remove
    var id = request.param('id');

    // Update message based on input from client
    Message.findByIdAndRemove(id, function(err, doc) {
        if (err) {
            response.send(500, err);
        } else {
            response.send(doc);
        }
    });
};

