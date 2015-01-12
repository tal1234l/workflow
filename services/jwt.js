/**
 * Created by talwa_000 on 10/01/15.
 */
var crypto = require('crypto');
exports.encode = function(payload, secret){
   //HS256 algorithm for encoding and decoding
    var algorithm = 'HS256';
    var header = {
        type: 'JWT',
        alg: algorithm
    };
    var jwt = bas64Encode(JSON.stringify(header)) + '.'+ bas64Encode(JSON.stringify(payload));
    return jwt + '.' + sign(jwt, secret);

};

exports.decode = function(token, secret){
    var segments = token.split('.');

    if(segments.length !== 3)
        throw new Error('Token structure incorrect');

    var header = JSON.parse(bas64Decode(segments[0]));
    var payload = JSON.parse(bas64Decode(segments[1]));
    var signature = segments[0] + '.' + segments[1];
    if(!verify(signature,secret,segments[2]))
        throw new Error('Verification failed')
    return payload;
};

function sign(str,key){
    return crypto.createHmac('sha256',key).update(str).digest('base64');
};
function bas64Encode(str){
    return new Buffer(str).toString('base64');
};
function bas64Decode(str){
    return new Buffer(str, 'base64').toString();
};
function verify(raw, secret, signature)
{
    return signature === sign(raw, secret);
};
