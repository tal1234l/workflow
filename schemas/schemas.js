/**
 * Created by talwa_000 on 10/06/14.
 */
var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

//All DIDNumbers
var DIDNumber = new Schema({
    DID:       String
    ,country:   String
    ,in_use:    Boolean
});

//All Users
var Users = new Schema({
    name:       String
    ,password:  String
});

Users.pre('save',function(next){
    var user = this;
    if(!user.isModified('password'))
        return next();

    bcrypt.genSalt(10,function(err,salt){
        if(err)
          return  next(err);
        //add hash to the password to encrypt it
        bcrypt.hash(user.password, salt, null, function(err,hash){
              if(err)
               return next(err);
              user.password = hash;
              next();
        });
    });
});
Users.methods.toJSON = function(){
    var user = this.toObject();
    delete user.password;
    return user;
};

module.exports.DIDNumber = mongoose.model('DIDNumber',DIDNumber);
module.exports.Users = mongoose.model('Users',Users);
