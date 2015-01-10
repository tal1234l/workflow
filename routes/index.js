
var AllSchemas = require('../schemas/schemas');
var nodemailer = require("nodemailer");
var formidable = require('formidable');
var jwt        = require('../services/jwt');
var buffer;


module.exports = function (flights) {

    var functions = {};

    //API's
    functions.createNewUsers = function(req,res){
        var user =  new AllSchemas.Users(req.body);
        var newUser = new AllSchemas.Users({
            name: user.name,
            password: user.password
        });
        var payload = {
          iss:req.hostname,
          sub: user.id
        };
        var token = jwt.encode(payload, "shh...");

        newUser.save(function(err){
            //Remove the password before sending to client
            res.status(200).send({
                user: newUser.toJSON(),
                token: token
            });
        });
    };
    functions.createNewDIDNumber = function(req, res){
        var DID = req.param('DID');
        //check that number is not in the DB
        AllSchemas.DIDNumber.findOne({ DID: DID},function(err,obj){
            if (err){
                console.log(err);
                res.status(500).json({status: 'Bad request'});
            }
            if(obj!=null && obj.length!=0)
            {
                res.status(400).json({"status":"number exists"});
            }
            else
            {
                //number is not in DB
                var record = new AllSchemas.DIDNumber(req.body);
                record.save(function(err,record){
                    if(err){
                        console.log(err);
                        res.status(500).json({status: 'failure'});
                    } else {
                        res.status(201).json({status: 'success'});
                    }
                });
            }
        });
    };
    functions.getDIDNumber = function(req, res){
        var country = req.param('country');
        AllSchemas.DIDNumber.findOne({$and: [{in_use: false, country: country}]},function(err,obj){
            if (err){
                console.log(err);
                res.status(500).json({status: 'Bad request'});
            }
            if(obj!=null && obj.length!=0)
            {
                //set the DID to in_uses
                debugger;
                AllSchemas.DIDNumber.update({$and: [{ in_use: false , country: country, DID: obj.DID }]},{in_use: true},{upsert: true},function (err, numberAffected, raw) {
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                        //send client the DID number
                        res.status(200).json(obj.DID);
                    }

                });
            }
            else
            {
                res.status(400).json({"status":"no available number"});
            }
        });
    };
    functions.freeDIDNumber = function(req, res){
        var DID = req.param('DID');
        AllSchemas.DIDNumber.findOne({DID: DID},function(err,obj){
            if (err){
                console.log(err);
                res.status(500).json({status: 'Bad request'});
            }
            if(obj!=null && obj.length!=0)
            {
                //set the DID to in_uses
                AllSchemas.DIDNumber.update({$and: [{ in_use: true , DID: obj.DID }]},{in_use: false},{upsert: true},function (err, numberAffected, raw) {
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                        //send client the DID number
                        res.status(200).json(obj.DID);
                    }

                });
            }
            else
            {
                res.status(400).json({"status":"DID number is not in the system"});
            }
        });

    };


    return functions;

};

