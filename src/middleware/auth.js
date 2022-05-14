const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
   // How this works: the request includes a header with an authentication token,
   // Header in Postman: Key 'Authorization' Value 'Bearer <token>' 
   // which is validated by this function.
   // For the validation, we need the JSON web token library (see above), and 
   // to apply this to a user, the user model.
   try {
       const token = req.header('Authorization').replace('Bearer ', '')
       // Take the Authorization header and replace the string 'Bearer '
       // with nothing because it is not part of what we want to validate.

       // Check if token is valid:
       const decoded = jwt.verify(token, 'thisismynewcourse')
       // The 2nd argument is the exact string we used to sign the token.
       // Find the user with that token:
       const user = await User.findOne( { _id: decoded._id, 'tokens.token': token })
       // Find a user with an id of decoded._id. The _id is part of the token, 
       // so decoded._id will have it. The second key/value pair checks if the 
       // token is still in the array of tokens. Background: When a user logs out,
       // the token is deleted. 
       // Why is the key a string? Because there's a special character inside of the key (
       // (the dot, which has a different meaning here).
       
       if (!user) {
           throw new Error()
       }

    
       // If things went well ...
       // The user has already been fetched by the findOne call, so there's no 
       // need to fetch it again. We just store the value by adding a 
       // property to the req object and assign the value of the 
       // user const variable, like:
       req.token = token
       req.user = user
       // We also add the token that was used to the req.object. When we 
       // log out user, we need authentication and want to use this exact token.
       // (A user might be logged in from several different devices, and we 
       // don't want to log out of all of them.)
       next()


   } catch (e) {
       res.status(401).send({ error: 'Please authenticate!' })
   }
}
module.exports = auth