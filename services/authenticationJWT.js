require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');



const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwt = require('jwt-simple');


//const MONGO_URI = 'mongodb://rvp0001:rvp0001@ds217452.mlab.com:17452/auth'

const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI);

//const User = mongoose.model('user');
const User = require('../models/user');
const secretKey = 'aaabbbccc';




 function generateTokenUser(user) {

  console.log('-----------------');
  console.log('generateTokenUser');
  console.log('-----------------');

  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user, iat: timestamp }, secretKey);
}






exports.generateTokenUser = function(user) {

  console.log('-----------------');
  console.log('generateTokenUser');
  console.log('-----------------');

  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user, iat: timestamp }, secretKey);
}




exports.currentUserUsernameJWT = function (args, context) {

  
  console.log('-----------------');
  console.log('currentUserUsernameJWT');
  console.log('-----------------');

  var req = context.request;
  return new Promise((resolve, reject) => {
    (req, () => {
 

  

      

       if (req.headers && req.headers.authorization  ) {
        
  


        if(req.headers.authorization=='null' || req.headers.authorization.length==4 )
        {
    
                reject('User not signedin');
                return;
        }


        var authorization = req.headers.authorization

        var decoded = '';
        try {
          decoded = jwt.decode(authorization, secretKey);
        } catch (e) { console.log(e); reject('Invalid token'); }
   
        var decoded_user = decoded.sub;

        User.findOne({ username: decoded_user.username, 
          applicationid: decoded_user.applicationid, 
          client: decoded_user.client, 
          lang: decoded_user.lang },
          (err, user) => {
            if (err) {  reject('Error in finding user'); }
            if (!user) {  reject('Invalid user') }
            else {       
              
              /*
              req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           })
              */
              
              
              resolve(user);
            
            
            }
          });
      }
      else {
        reject('User not signedin');
      }
    
    

    })({ body: 'okok' })

  }
  );

}







exports.signUpUsernameJWT =
  function (
    { email, password, applicationid, client, lang, mobile, username }, //Input is user object and request
    context
  ) {

    console.log('-----------------');
    console.log('signUpUsernameJWT');
    console.log('-----------------');
  
    const user = new User({ applicationid, client, lang, username, password, email }); //Initialise new user


    if (!username || !password) { throw new Error('You must provide an username and password.'); }
    return User.findOne({ applicationid, client, lang, username })
      .then(
        existingUser => {
          if (existingUser) { throw new Error('Username in use'); }
          return user.save();
        }
      )
      .then(
        user => {
          return new Promise((resolve, reject) => {
            context.request.login(user, (err) => {
              console.log('User--- ' + JSON.stringify(user))

              if (err) {
                console.log('Error ' + JSON.stringify(err))
                
                reject(err); }
                console.log('@@@@@@@ ' + JSON.stringify(user))
                console.log(' ')
              const token = generateTokenUser(user);
              console.log('$$$$$$$$ ' + JSON.stringify(user))
              console.log(' ')
              console.log('token ' + token)
              console.log(' ')
             user.token = token;
              console.log('token assigned' + token)
              console.log(' ')
              resolve(user)
              console.log('resolved user assigned' + JSON.stringify(user))

            });
          });
        });

  }



exports.signInUsernameJWT = function (user, context) {

 
  // console.log('-----------------');
  // console.log('signInUsernameJWT');
  // console.log('-----------------');
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user) => {

      console.log('err---' + err)
      console.log('user----' + user)
     


       if (err!='' && err!=null ) {


        console.log('iiii' + err)
        
        reject(err) 
        // if( user == undefined)
        // {console.log('----h123123----');   console.log('err---' + JSON.stringify(err))
        // console.log('user----' + JSON.stringify(user)); reject('User does not exist') }
        // else { console.log('----h4444444----'); 
        // console.log('err---' + JSON.stringify(err))
        // console.log('user----' + JSON.stringify(user)); reject('Invalid credentials') }
       }
       else {

        
        console.log('iiii' + err)
            const token = generateTokenUser(user);
              console.log('token ---' + token );
              user.token = token;
      resolve(user)
    }



    })({ body: user });
  }
  );

}



