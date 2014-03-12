var twilio = require('twilio'),
    controllers = {
        twilio: require('./twilio'),
        home: require('./home'),
        admin: require('./admin')
    };

module.exports = function(app) {
    // Routes used as webhooks by Twilio should all be secured by checking the
    // Twilio request signature - we can do this by using Express middleware
    // Provided by the Twilio module
    var webhook = twilio.webhook({
        // Only validate requests in production
        validate: process.env.NODE_ENV === 'production',

        // Manually configure the host and protocol used for webhook config
        host:'leavejoeamessage.herokuapp.com',
        protocol:'https'
    });

    // Twilio webhooks
    app.post('/voice', webhook, controllers.twilio.voice);
    app.post('/recording', webhook, controllers.twilio.recording);
    app.post('/sms', webhook, controllers.twilio.sms);

    // Home page and associated ajax endpoints
    // Render a public home page which displays the latest messages
    app.get('/', controllers.home.index);
    app.get('/messages', controllers.home.list);

};