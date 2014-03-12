var controllers = {
    twilio: require('./twilio'),
    home: require('./home'),
    admin: require('./admin')
};

module.exports = function(app) {
    // Routes used as webhooks by Twilio should all be secured by checking the
    // Twilio request signature - we can do this by using Express middleware
    // Provided by the Twilio module
    var webhook = controllers.twilio.webhook;

    // Twilio webhooks
    app.post('/voice', webhook, controllers.twilio.voice);
    app.post('/recording', webhook, controllers.twilio.recording);
    app.post('/sms', webhook, controllers.twilio.sms);

    // Home page and associated ajax endpoints
    // Render a public home page which displays the latest messages
    app.get('/', controllers.home.index);
    app.get('/messages', controllers.home.list);

    // Create middleware that will redirect secure requests to HTTPS in prod on
    // Heroku
    var ensureHttps = controllers.admin.secure;

    // Create HTTP Basic authentication middleware, to be used after we've
    // ensured an SSL connection. Uses username/password configured in 
    // system environment. 
    var auth = controllers.admin.auth;

    // Create secured admin routes
    app.get('/admin', ensureHttps, auth, controllers.admin.index);
    app.get('/admin/messages', ensureHttps, auth, controllers.admin.messages);
    app.post('/admin/message/:id', ensureHttps, auth, controllers.admin.update);
};