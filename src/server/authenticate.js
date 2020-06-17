var jwt = require('jsonwebtoken');
var fs = require('fs');
var database = require('./database');

var secret = process.env.HASH_SECRET || "shhhhh";

module.exports = (function(){
    
    function sign(user, callback){
        jwt.sign(user, secret, {}, function(err, token) {
            if(err){
                callback({ success: false });
            } else {
                callback({ success: true, token: token });
            }
        });
    }

    function verify(req, callback){
        var token = req.headers['x-access-token'];
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                callback({ success: false });
            } else {
                database.registerUserIp(decoded, req.ip, function(data){
                    if(!data.succes) console.log("register went wrong");
                });
                callback({ success: true, decoded: decoded });
            }
        });
    }

    return {
        sign: sign,
        verify: verify
    };
})();
