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
    var localStrategy = require('passport-local').Strategy;

    var AllSchemas   = require('./schemas/schemas');
    var flash 	     = require('connect-flash');
    var logger       = require('morgan');
    var session      = require('express-session');


    app.set('port', process.env.PORT || 3000);

    // required for passport
    app.use(logger('combined'));
    app.use(cookieParser());
    /*app.use(session({secret: 'secretIdentity13112014', resave: true, cookie: { secure: true }, saveUninitialized: true }));*/
    app.use(passport.initialize());
    passport.serializeUser(function(user, done){
       done(null, user.id);
    });
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

    if (process.env.NODE_ENV === 'development') {app.use(errorhandler()) }

    //passport strategies
    var loginStrategy = new localStrategy({usernameField: 'name'}, function(name, password, done){
            AllSchemas.Users.findOne({name: name},function(err, user){
                if(err) return  done('user not found');
                if(!user) return done('wrong user name / password');

                user.comparePasswords(password, function(err, isMatch){
                    if(err) return  done(null, false, {message:'wrong input'});
                    if(!isMatch) return  done(null, false, {message:'wrong user name / password'});
                    return done(null,user);

                });
            });
        });
    var registerStrategy = new localStrategy({usernameField: 'name'},function(name, password, done){
        AllSchemas.Users.findOne({name: name},function(err, user){
            if(err) return  done('user not found');
            if(user) return done('email already exists');

            var newUser = new AllSchemas.Users({
                name: name,
                password: password
            });
            newUser.save(function(err){
                if (err) throw err;
                done(null,newUser);
            });
        });

    });

    passport.use('local-register', registerStrategy);
    passport.use('local-login', loginStrategy);

    //API'S
    app.post('/registerUser',passport.authenticate('local-register'), routes.createNewUsers);
    app.post('/loginUser', passport.authenticate('local-login'), routes.loginUser);

    app.post('/email', routes.email);
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



