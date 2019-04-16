const jwt = require('jsonwebtoken');

let auth = function(req , res , next){
    let token = req.headers['x-token'];
    if(token){
        jwt.verify(token,'superSecret',(err , decoded) => {
            if(err){
                res.status(403).json(err);
            } else {
                next();
            }
        })
    } else {
        return res.status(403).json({
            message : 'no token provided',
            status : 'please provide a valid token'
        })
    }
}
module.exports = auth;