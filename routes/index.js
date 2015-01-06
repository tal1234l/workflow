
var AllSchemas = require('../schemas/schemas');
var nodemailer = require("nodemailer");
var formidable = require('formidable');

var buffer;


module.exports = function (flights) {


    var functions = {};

    //production app
   /* functions.herokuapp_production = function(req, res){
        res.redirect('https://parkinson.herokuapp.com//login/light-index.html');
    }*/

    //testing app
    /*functions.herokuapp_testing = function(req, res){
        res.redirect('https://homeconnect.herokuapp.com/login/light-index.html');
    }*/

    //local testing1
    functions.herokuapp_localhost = function(req, res){
        res.redirect('http://localhost:3000/development/index.html');
    }

    //local testing2
    /*functions.herokuapp_nitrous = function(req, res){
        res.redirect('http://homeconnect-123609.euw1-2.nitrousbox.com/login/light-index.html');
    }*/


    functions.downloadForm = function(req, res){
        var result = req._parsedUrl.path.substring(14);
        var decode = decodeURIComponent(result).split('&');
        res.writeHead(200, {'Content-Type': 'application/msword'});
        res.write('Test results for: '+ decode[1]+' \n '+decode[0]+'\n '+decode[2]+'\n\n\n');
        for(var i=3;i<decode.length;i++)
        {
            res.write(decode[i]+'\n');
        }
        res.end();
    }


    functions.addDoctor = function (req, res) {
        debugger;
        var doctorId = req.param('DID');

        //Check that this doctor is not listed already
        AllSchemas.Doctors.find({ DID: doctorId},function(err,obj){
            if (err){
                console.log('addDoctor did not succeed at the find command');
            }
            if(obj!== null && obj.length === 0)
            {
                debugger;
                var record = new AllSchemas.Doctors(req.body);
                record.save(function(err,record){
                    if(err){
                        console.log(err);
                        res.status(500).json({status: 'failure to create new doctor record'});
                    } else {
                        res.json({satus: 'success, new doctor record was created'});
                        console.log(record);
                    }
                });
            }
            else if (obj!=null && obj.length === 1)
            {
                res.status(506).json({status: 'doctor already registered'});
            }
        });
    };

    functions.send_email_message = function (req, res) {
        // create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = nodemailer.createTransport("SMTP",{
            service: "Gmail",
            auth: {
                user: "sta.medical.communications@gmail.com",
                pass: "alaskahumi"
            }
        });
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: req.body.Email, // sender address
            to: "sta.medical.communications@gmail.com",  // list of receivers
            subject: "Message from viewer of the site", // Subject line
            text: "Thank you for your message ", // plaintext body
            html: '<b>'+req.body.Message+'<br>'+'Sent from: '+req.body.Name+'<br>'+'Email: '+req.body.Email+'<br></b>' // html body
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

    functions.sendFormToDB = function (req, res) {
        var patientId = req.param('PID');
        var date = req.param('Date');
        var doctor_user_id= req.param('DID');
        var patientResultVector = req.param('ResultVector');
        var Status = req.param('Status');

             AllSchemas.PatientResults.find({$and: [{PID: patientId, Date:"1/2/2012" , DID: doctor_user_id}]},function(err,obj){
                if (err){
                    console.log('PatientResults did not succeed at the find command');
                }
                if(obj !== null && obj.length > 0)
                {
                  console.log('found a record to update');
                  AllSchemas.PatientResults.update({$and: [{ PID: patientId, Date: "1/2/2012" , DID: doctor_user_id }]},{ResultVector:patientResultVector},{upsert: true},function (err, numberAffected, raw) {
                        if (err) {
                            console.log('update of online patient did not succeed and the update command');
                        }
                        res.status(200).json({"status":"done"});
                        console.log('The number of updated documents was ' + numberAffected);
                        console.log('The raw response from Mongo was ' + raw);
                    });
                }
                else
                {
                    var record = new AllSchemas.PatientResults(req.body);
                    record.save(function(err,record){
                        if(err){
                            console.log(err);
                            res.status(500).json({status: 'failure'});
                        } else {
                            res.status(200).json({status: 'success'});
                            console.log(record);
                        }
                    });
                }
            });
    };

    return functions;

};

