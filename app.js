// Initialize Mongoose and MongoDB connection (this only needs to be done 
// once in the app)
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL);

// Create a pre-configured Express web app using gopher, then define our app's
// routes and middleware. Gopher automatically creates and starts an HTTP server
// for Express
var app = require('gopher');
require('./controllers')(app);

// create custom filter for EJS
require('./shared/filter');