
module.exports = function() {
    var express         = require('express');
    var cookieParser    = require('cookie-parser');
    var bodyParser      = require('body-parser');
    var methodOverride  = require('method-override');
    var errorhandler    = require('errorhandler');
    var routes          = require('./routes')();
    var path            = require('path');
    var nodemailer      = require("nodemailer");
    var app = express();

    var passport     = require('passport');
    var flash 	     = require('connect-flash');
    var logger       = require('morgan');
    var session      = require('express-session');

    var myEnv       = evironment();

    require('./app_authentication_config/passport')(passport); // pass passport for configuration

    // all environments
    app.set('port', process.env.PORT || 3000);
/*    app.set('views', __dirname +'/views' );
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);*/

    // required for passport
    app.use(logger('combined'));
    app.use(cookieParser());
    app.use(session({secret: 'secretIdentity13112014', resave: true, cookie: { secure: true }, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash());            // use connect-flash for flash messages stored in session

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());

    // override with the X-HTTP-Method-Override header in the request
    app.use(methodOverride('X-HTTP-Method-Override'));

    app.use(function (req, res, next) {
        res.set('X-Powered-By', 'new identity');
        next();
    });

    app.use(express.static(path.join(__dirname, 'builds/'+process.env.NODE_ENV)));
    require('./app_authentication/routes.js')(app, passport);

    if (myEnv.local === 'development') {app.use(errorhandler()) }

    //main routing
    app.get('/', routes.herokuProd);

    /*if(myEnv.remote === 'local' && myEnv.local === 'development'){app.get('/', routes.localDev);}
    if(myEnv.remote === 'heroku_development'){app.get('/', routes.herokuDev);}
    if(myEnv.remote === 'heroku_production'){app.get('/', routes.herokuProd);}*/

    //API's
    app.post('/newDID', routes.createNewDIDNumber);
    app.get('/getDIDNumber/:country', routes.getDIDNumber);
    app.post('/freeDIDNumber',routes.freeDIDNumber);

    return app;
}

// Route middleware to make sure user is authenticated
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.status(200).json({status: 'not authorized'});
}
function evironment(){
    var myEnv={};
        if (process.env.NODE_ENV === 'development'){myEnv.local = 'development'; myEnv.remote = "local";}
        if (process.env.NODE_ENV === 'production'){myEnv.local = 'production'; myEnv.remote = "local";}
        if (process.env.NODE_ENV === 'heroku_development'){myEnv.local = 'development'; myEnv.remote = "heroku_development";}
        if (process.env.NODE_ENV === 'heroku_production'){myEnv.local = 'production'; myEnv.remote = "heroku_production";}
    return myEnv
}


