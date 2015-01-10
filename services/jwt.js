/**
 * Created by talwa_000 on 10/01/15.
 */
var crypto = require('crypto');
exports.encode = function(payload, secret){
   //HS256 algorithm for encoding and decoding
    algorithm = 'HS256';
    var header = {
        type: 'JWT',
        alg: algorithm
    };
    var jwt = bas64Encode(JSON.stringify(header)) + '.'+ bas64Encode(JSON.stringify(payload));
    return jwt + '.' + sign(jwt, secret);

};
function sign(str,key){
    return crypto.createHmac('sha256',key).update(str).digest('base64');
};
function bas64Encode(str){
    return new Buffer(str).toString('base64');
};
