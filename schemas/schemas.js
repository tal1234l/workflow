/**
 * Created by talwa_000 on 10/06/14.
 */
var mongoose  = require('mongoose');
var Schema = mongoose.Schema;


//All registered doctors
var Doctors = new Schema({
    DID:             String
    ,ConnectionKey:  String
    ,doctor_fname:   String
    ,doctor_lname:   String
    ,doctor_email:   String
    ,doctor_user_id: String
});

module.exports.Doctors = mongoose.model('Doctors',Doctors);
