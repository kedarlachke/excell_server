require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


passport.serializeUser((user, done) => {
    console.log('-----------------');
    console.log('serializeUser');
    console.log('-----------------');
    var sessionUser = { username: user.username, 
        applicationid: user.applicationid, 
        client: user.client, 
        lang: user.lang }
    done(null, sessionUser)
  })
  
  passport.deserializeUser((sessionUser, done) => {
    // The sessionUser object is different from the user mongoose collection
    // it's actually req.session.passport.user and comes from the session collection
    console.log('-----------------');
    console.log('deserializeUser');
    console.log('-----------------');
  
    User.findOne({ username: sessionUser.username, applicationid: sessionUser.applicationid, client: sessionUser.client, lang: sessionUser.lang }, (err, user) => {
  
      done(err, user);
    });
  
  })


const jwt = require('jwt-simple');
//const User = mongoose.model('user');
const secretKey = 'aaabbbccc';


//const MONGO_URI = 'mongodb://rvp0001:rvp0001@ds217452.mlab.com:17452/auth'
const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI);

//const User = mongoose.model('user');
const User = require('../models/user');




const jwtFromRequest = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secretKey
};



const checkJwtLogin = new JwtStrategy(jwtFromRequest, function (payload, done) {
    //see if user id in payload exists in our database
    // if it does call done with that other
    // otherwise call done without a user
    console.log('-----------------');
    console.log('checkJwtLogin');
    console.log('-----------------');


    User.findById(payload.sub, function (err, user) {
        if (err) {
            
            console.log('r1 ****** ' + JSON.stringify(err))
            
            return done(err, false); }
        if (user) {

            console.log('r2 ****** ' + JSON.stringify(user))

            done(null, user);
        } else {

            console.log('r3 ****** ' + 'null false')

            done(null, false);
        }
    });

});



const checkUserLogin = new LocalStrategy({
    usernameField: 'username',
    passReqToCallback: true
},
    (req, username, password, done) => {


        // console.log('-----------------');
        // console.log('checkUserLogin');
        // console.log('-----------------');

        User.findOne(
            { username: username, applicationid: req.body.applicationid, client: req.body.client, lang: req.body.lang },
            (err, user) => {
                // console.log('err@@@@@' + JSON.stringify(err))
                // console.log('user@@@@@' + user)
                if (err ) 
                {
                    console.log('r11 ****** ' + JSON.stringify(err))
                    return  done('Misc Error.', null);
                }
                else
                {
                    if(user==null || user==undefined)
                    {
                        console.log('r22 ****** ' + JSON.stringify(err))
                        return done('User does not exist',null); 
                    }
                    else{
                    user.comparePassword(password, (err, isMatch) => 
                    {
                        if (err) 
                        { 
                            console.log('r33 ****** ' + JSON.stringify(err))
                            return done('Invalid credentials',user); }
                        if (isMatch) 
                        {
                            console.log('r44 ****** ' + JSON.stringify(user))
                            return done('', user);
                        }
                        else
                        {
                            console.log('r55     ****** ' + JSON.stringify(err))
                            console.log(user)
                            console.log('r66     ****** ' + JSON.stringify(user))
                            return done('Invalid credentials',user); 
                        }

                    }   );
                }
                 }
        }
            
    )
    });


passport.use(checkUserLogin);
passport.use(checkJwtLogin);


exports.me = function(req,res,next){

    
 
    if (req.headers && req.headers.authorization) {

        
    
        if(req.headers.authorization=='null' || req.headers.authorization.length==4 )
        {
        // console.log('calling next');
            next();
            return;
        }


      
      
        var authorization = req.headers.authorization;
     
        var decoded = '';
        try {
         
            decoded = jwt.decode(authorization, secretKey);
        } catch (e) {
    
            console.log(e);
            next();
        }
        var decoded_user = decoded.sub;
    
        // Fetch the user by id 
        User.findOne({ username: decoded_user.username, applicationid: decoded_user.applicationid, client: decoded_user.client, lang: decoded_user.lang },
            (err, user) => {
              if (err) {  console.log(err); next(); }
              if (!user) {    next(); }
              else {    
               
                console.log('***received JWT req added user***');
              req.login(user, {session: false}, (err) => {
                if (err) {
                    next();
                }});

                next();
         //     req.jwtUser=user
               }
            });
    }

 else
 {
     next();
 }


}

/*

      if (req.headers && req.headers.authorization  ) {
     
        console.log('In authorization code not expected ---'+ req.headers.authorization.length )
        var authorization = req.headers.authorization

        var decoded = '';
        try {
          decoded = jwt.decode(authorization, secretKey);
        } catch (e) { console.log(e); reject('Invalid token'); }
   
        var decoded_user = decoded.sub;

        User.findOne({ username: decoded_user.username, applicationid: decoded_user.applicationid, client: decoded_user.client, lang: decoded_user.lang },
          (err, user) => {
            if (err) {  reject('Error in finding user'); }
            if (!user) {  reject('Invalid user') }
            else {  resolve(user); }
          });
      }
      else {
        reject('User not signedin');
      }
    }

*/