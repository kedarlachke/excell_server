
// //cookie code requirements
// const Authentication = require('./controllers/authentication');
// const passportService = require('./controllers/authentication');


// //token code requirements
// const AuthenticationJWT = require('./controllers/authenticationJWT');
// const passportServiceJWT = require('./controllers/authenticationJWT');



// const passport = require('passport');





module.exports = function(app) {

   
    app.get('/',  function(req, res) {
   
        
        res.sendFile('dist/index.html', {root: __dirname })
    });
 //   app.post('/signin', Authentication.signin);
      
}