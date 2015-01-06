var mongoose = require('mongoose');

    if (process.env.NODE_ENV === 'development') {

       //used for testings
       mongoose.connect('mongodb://vttechnology:Abcd1234@ds051740.mongolab.com:51740/newidentity');
    }
    else{
       //used for production
       //mongoose.connect('<data base connection string>');
    }


module.exports = mongoose.connection;

