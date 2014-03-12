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
        title: 'Leave Joe A Message',
        staticfile: 'admin'
    });
};

