
var AllSchemas = require('../schemas/schemas');
var nodemailer = require("nodemailer");
var validation = require('../validations/validations');
var jwt        = require('jwt-simple');
var sql        = require('mssql');

var config = {
    user: 'tal1234l',
    password: 'Abcd1234',
    server: 'v66zmizxig.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'mydb',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

module.exports = function (flights) {

    var functions = {};

    //API's
    functions.createNewUsers = function(req,res){
       createAndSendToken(req.user,res);
    };
    functions.loginUser = function(req, res){
        createAndSendToken(req.user,res);
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

    functions.gettemp = function(req, res){

        sql.connect(config, function(err) {
            // ... error checks
            var request = new sql.Request();
            request.query('select top 100 avg_temperature  from mytable', function(err, recordset) {
                var i=0;
                var data ={
                    temparr: [],
                    lable: []
                };
                for( i=0;i<recordset.length; i++ )
                {
                    data.temparr.push(recordset[i].avg_temperature);
                    data.lable.push('');
                }
                res.status(200).json(data);
                /*console.dir(recordset);*/
            });
        });

    };
    functions.getcurrenttemp = function(req, res){

        sql.connect(config, function(err) {
            // ... error checks
            debugger;
            var request = new sql.Request();
            request.query('select top 1 avg_temperature  from mytable', function(err, recordset) {
                res.status(200).json(recordset[0].avg_temperature);
                /*console.dir(recordset);*/
            });
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
    functions.getIdentities = function(req,res){
        var identities = [
            'tal','gil','ron','jon1'
        ];
        validateJWT(req,res);
        res.json(identities);
    };

    return functions;

};
//Helper functions
function createAndSendToken(user, res){
    var payload = {
        sub: user.id
    };
    var token = jwt.encode(payload, "shh...");
    res.status(200).send({
        //Remove the password before sending to client -> user.toJSON()
        user: user.toJSON(),
        token: token
    });
};
function validateJWT(req,res){
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token,"shh...");
    if(!payload.sub)
        return res.status(401).send({message: 'Authorization failed'});

    if(!req.headers.authorization)
        return res.status(401).json({status: 'you are not authorized'});;

};


