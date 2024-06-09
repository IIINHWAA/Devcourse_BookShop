const jwt = require('jsonwebtoken'); 
var dotenv = require('dotenv');
dotenv.config();

const ensureAuthorizaion = (req,res)=>{
    try {
        let receivedJwt = req.headers["authorization"];
        if (receivedJwt){
            let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            return decodedJwt;
        }
        else{
            return new ReferenceError("jwt must be provided")
        }
        
    } catch (error) {
        return error;
    }
}

module.exports = ensureAuthorizaion;