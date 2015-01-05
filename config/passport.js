// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var nodemailer = require("nodemailer");

// load up the user model
var User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        username : 'user_name',
        user_uuid : 'user_uuid',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password,user_name, done) {
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser            = new User();
                var uniqueId = UUID();
                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                newUser.local.user_name = user_name;
                newUser.local.user_uuid = uniqueId;
                newUser.local.connectionKey = "";


				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });

                send_email_message(email,user_name,uniqueId);
            }

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, user_name, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            return done(null, user);
        });

    }));

};
var UUID = function(){
    var temp ='xxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    return temp;
};

var send_email_message = function(email, name ,uniqueId) {

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "sta.medical.communications@gmail.com",
            pass: "alaskahumi"
        }
    });
    var ResigtrationMessage = "<u>Welcome to STA - Medical Communications </u><br><br> your personal information:<br>" +
        "Name: "+name+"<br> Email:"+email+"<br> Unique id: "+uniqueId+"<br><br>Use your uniqueId to connect with your patients";
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "sta.medical.communications@gmail.com", // sender address
        to: email,  // list of receivers
        subject: "Registration to STA", // Subject line
        text: "Registration ", // plaintext body
        html: '<b>' +ResigtrationMessage+'</b>' // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    });
};