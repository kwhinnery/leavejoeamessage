var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    express = require('express'),
    browserify = require('browserify'),
    less = require('less-middleware');

// Initialize Mongoose and MongoDB connection (this only needs to be done 
// once in the app)
mongoose.connect(process.env.MONGOHQ_URL);

// Create global app object
var app = express();

// Create an HTTP server for use with our app
var server = http.createServer(app);

// Standard app middleware and config
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(less(process.cwd()+'/public'));
app.use(express.static(path.join(process.cwd(), 'public')));
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Set up middleware to auto-browserify anything in the /browser directory
var browserified = {};
app.get('/browser/:filename.js', function(request, response, next) {
    var filename = request.param('filename');

    // Send the in-memory JS code back to the client
    function send(f) {
        response.type('application/javascript');
        response.send(browserified[f]);
    }

    // If we've already browserified this file, just cache it
    if (browserified[filename]) {
        send(filename);
    } else {
        var src = path.join(process.cwd(), 'browser', filename+'.js');

        // Grab the requested source file if it exists
        if (fs.existsSync(src)) {
            // Browserify the requested file and serve it up
            var b = browserify();
            b.add(src);

            // browserification options
            var opts = {
                debug: process.env.NODE_ENV !== 'production'
            };

            // Uglify for non-dev builds
            if (!opts.debug) {
                b.transform({
                    global: true
                }, 'uglifyify');
            }

            // create bundle and store in memory
            b.bundle(opts, function(err, src) {
                if (!err) {
                    browserified[filename] = src;
                    send(filename);
                } else {
                    response.send(500, err);
                }
            });
        } else {
            next();
        }
    }
});

// Set up app controllers
require('./controllers')(app);

// Start server
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});