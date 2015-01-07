/**
 * Created by talwa_000 on 10/06/14.
 */
var mongoose  = require('mongoose');
var Schema = mongoose.Schema;


//All registered doctors
var DIDNumber = new Schema({
     DID:     String
    ,country:  String
    ,in_use:   Boolean


});

module.exports.DIDNumber = mongoose.model('DIDNumber',DIDNumber);
