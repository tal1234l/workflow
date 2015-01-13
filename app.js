
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

    require('./app_authentication_config/passport')(passport); // pass passport for configuration

    app.set('port', process.env.PORT || 3000);

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
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers','Content-Type, Authorization');
        next();
    });

    app.use(express.static(path.join(__dirname, 'builds/'+process.env.NODE_ENV)));
    require('./app_authentication/routes.js')(app, passport);

    if (process.env.NODE_ENV === 'development') {app.use(errorhandler()) }

    //API'S
    app.post('/registerUser',routes.createNewUsers);
    app.post('/loginUser',routes.loginUser);
    app.post('/newDID', routes.createNewDIDNumber);
    app.get('/getDIDNumber/:country', routes.getDIDNumber);
    app.post('/freeDIDNumber',routes.freeDIDNumber);
    app.get('/getIdentities',routes.getIdentities);

    app.get('/*',function(req, res, next){
        res.redirect('http://' + req.headers.host + '/');
        next();
    });

    return app;
}


