// Client-side app dependencies
var angular = require('angular'),
    moment = require('moment');

// Create app module
var app = angular.module('messageApp', []);

// Create global app object to store controllers
window.app = {
    controllers: {
        MessageList: require('./ng-controllers/MessageList'),
        Message: require('./ng-controllers/Message')
    }
};

// Create a filter for views that will display the time a date is from now
// in plain english
app.filter('fromNow', function() {
    return function(date) {
        return moment(date).fromNow();
    };
});