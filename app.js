

module.exports = function(flights) {
    var express = require('express');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var errorhandler = require('errorhandler');
    var routes = require('./routes')(flights);
    var path = require('path');
    var nodemailer = require("nodemailer");
    var app = express();

    var passport = require('passport');
    var flash 	 = require('connect-flash');
    var logger        = require('morgan');
    var session      = require('express-session');


    require('./config/passport')(passport); // pass passport for configuration

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    // required for passport
    app.use(logger('combined'));
    app.use(cookieParser());
    app.use(session({
        secret: 'secretIdentity13112014',
        resave: true,
        cookie: { secure: true },
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

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
    app.use(express.static(path.join(__dirname, 'builds')));

    // development only
    if (process.env.NODE_ENV === 'development') {

        // only use in development
        app.use(errorhandler())
    }
    require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

    //app.get('/', routes.herokuapp_production);
    //app.get('/', routes.herokuapp_testing);
    //app.get('/', routes.herokuapp_localhost);
    app.get('/', routes.herokuapp_nitrous);


    /*app.get('/isRegistered/:PID/:DID',routes.isRegistered);
    app.get('/qetDoctorQueue/:DID',routes.qetDoctorQueue); 
    app.get('/doctor/doctor.html', isLoggedIn);
    app.get('/getDoctorInformation', isLoggedIn ,routes.getDoctorInformation );
    app.get('/getPatientDiagnostics/:PID/:DID', isLoggedIn ,routes.getPatientDiagnostics);
    app.get('/downloadForm/:result', isLoggedIn, routes.downloadForm);
    app.get('/getDoctorsPatients/:doctor_userId' , isLoggedIn ,routes.getAllDoctorsPatients);*/


    return app;
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.status(200).json({status: 'not authorized'});
}


