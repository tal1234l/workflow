var mongoose = require('mongoose');

    if (process.env.NODE_ENV === 'development') {
        console.log('development db is used ');
        mongoose.connect('mongodb://vttechnology:Abcd1234@ds051740.mongolab.com:51740/newidentity');
    }
    else{
        console.log('production db is used ');
        mongoose.connect('mongodb://vttechnology:Abcd1234@ds031741.mongolab.com:31741/newidentity_prod');
    }


module.exports = mongoose.connection;

