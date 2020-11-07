const jwt = require('jsonwebtoken');

// JWT configuration
JWT_SECRET = "HELLO"
JWT_EXPIRES_IN= "1h" //Expires in 1 hour

exports.roles = {
    ADMIN : "admin",
    CLIENT : "client"
}

// Generate JWT token
exports.generateJWTToken = (userData) => {
    return jwt.sign(userData.toJSON(), JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}
 
// Verify token and get payload
exports.verifyToken = (jwtToken) => {
    try{
       return jwt.verify(jwtToken, JWT_SECRET);
    } catch(err) {
       console.log('err',err);
       return null;
    }
}
