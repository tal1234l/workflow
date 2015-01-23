
var AllSchemas = require('../schemas/schemas');
var validation = require('../validations/validations');
var jwt        = require('jwt-simple');
var mandrill = require('mandrill-api/mandrill');

module.exports = function (flights) {

    var functions = {};

    //API's
    functions.createNewUsers = function(req,res){
       createAndSendToken(req.user,res);
    };
    functions.loginUser = function(req, res){
        createAndSendToken(req.user,res);
    };
    functions.email = function(req, res){
                //number is not in DB
                var record = new AllSchemas.Email({ data : req.body });
                record.save(function(err,record){
                    if(err){
                        console.log(err);
                        res.status(500).json({status: 'failure'});
                    } else {
                        res.status(200).json({req: req});
                    }
                });

        //-----------------------------//
        // mandrill will send the replies in the request body as mandrill_events
        /*var replies = JSON.parse(req.body.mandrill_events);

        // here we are using async to process the replies, note that mandrill could
        // send us a batch of replies, so we need to be able to process multiple replies
        async.each(
            replies,
            function(reply, callback) {
                // according to mandrill's docs, incoming emails will have the event of 'inbound'
                if (reply.event === 'inbound') {
                    processReply(reply, callback);  // we'll explain what to do here below
                } else {
                    callback();
                }
            },
            function(err) {
                // once we are done processing the replies, we should send mandrill
                // the 200 status code, which means OK
                res.send(200);
            }
        );*/

        //----------------------------//
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


function processReply(reply, processCallback) {
    async.parallel({
            user: function(callback) {
                User.findOne({ email: reply.msg.from_email }, callback);
            },
            someObject: function(callback) {
                // here we parse the id out of the email, which was in the reply-to field when we
                // sent the original message
                var objectId = parseObjectId(reply.msg.email);
                SomeObject.findById(objectId, callback);
            }
        },
        function(err, results) {
            if (err) {
                handleErrors(err, processCallback);
            } else {

                Message.create({
                    content: removeQuotedText(reply.msg.text),  // we'll explain this function below
                    createdById: results.user._id,
                    timestamp: new Date(reply.ts*1000),  // mandrill returns a UTC unix timestamp,
                    // we just need to multiply it by 1000 to
                    // make it a regular date time
                    objectId: results.someObject._id
                }, processCallback);
            }
        });
}
function removeQuotedText(text) {
    var delimeter = 'notification@sampleapp.com';

    // escaping the dot in .com, so it doesn't affect our regex pattern below
    delimeter.replace('.','\\.');

    // this matches from the beginning of the email, multiple lines, until the line
    // the has the delimeter, lines under the delimeter (including the delimeter line) won't match
    var pattern = '.*(?=^.*' + delimeter + '.*$)';

    // we are using XRegExp
    var regex = xregexp(pattern, 'ims');

    var delimeterFound = xregexp.test(text, regex);

    if (delimeterFound) {
        var match = xregexp.exec(text, regex);
        return trimNewLines(match[0]);
    } else {
        return trimNewLines(text);
    }
}

// email clients usually add extra white lines after the reply, this function removes empty
// new lines before and after the passed in text
function trimNewLines(text) {
    return text.replace(/^\s+|\s+$/g, '');
}