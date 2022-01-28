require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//const MONGO_URI = 'mongodb://rvp0001:rvp0001@ds217452.mlab.com:17452/auth'
console.log(process.env.MONGO_URI);
const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI);

const User = require('../models/user');




/*


passport.serializeUser((user, done) => {
  console.log('-----------------');
  console.log('serializeUser');
  console.log('-----------------');
  var sessionUser = { username: user.username, applicationid: user.applicationid, client: user.client, lang: user.lang }
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


passport.use(new LocalStrategy({ usernameField: 'username', passReqToCallback: true }, (req, username, password, done) => {
  console.log('-----------------');
  console.log('use');
  console.log('-----------------');

  User.findOne({ username: username, applicationid: req.body.applicationid, client: req.body.client, lang: req.body.lang }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, 'Invalid Credentials'); }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, 'Invalid credentials.');
    });
  });
}));

*/

exports.currentUserUsername = function (args, context) {
  console.log('-----------------');
  console.log('currentUserUsername');
  console.log('-----------------');

  return new Promise((resolve, reject) => {
    
    (context.request, (err, user) => {

      console.log('------context.request.user-----------');
      console.log(context.request.user);
      console.log('--------context.request.user---------');


     
      if (!context.request.user) { reject('User not signedin') }
      else {
     
        context.request.user;
       
        resolve(context.request.user)
        

      }

    
    })({ body: context.request.user })

 
  }
  );


}


exports.sigOutUsername = function (user, context) {


  context.request.logout();

}



exports.signInUsername = function (user, context, info) {


  console.log('-----------------');
  console.log('signInUsername');
  console.log('-----------------');
  console.log('test user' + JSON.stringify(user));


  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {


      if (!user) { reject('Invalid credentials.') }

      console.log('***received COOKIE req added user***');
      console.log(user);
      context.request.login(user, () => resolve(user));
  

    })({ body: user });
  }
  );

}







exports.signUpUsername =
  function (
    { email, password, applicationid, client, lang, mobile, username }, //Input is user object and request
    context
  ) {

    console.log('-----------------');
    console.log('signUpUsername');
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
            console.log('***received COOKIE req added user***');
            console.log(user);
            context.request.login(user, (err) => {
              if (err) { reject(err); }
              resolve(user);
            });
          });
        });

  }










exports.createUsername =
  function (
    { email, password, applicationid, client, lang, mobile, username }
  ) {

    console.log('-----------------');
    console.log('createUsername');
    console.log('-----------------');

    const user = new User({ applicationid, client, lang, username, password, email }); //Initialise new user

    if (!username || !password) { throw new Error('You must provide an username and password.'); }
    return User.findOne({ applicationid, client, lang, username })
      .then(
        existingUser => {
          console.log('in user existingUser');

          if (existingUser) { throw new Error('Username in use'); }

          console.log('prior to save');
          return user.save();
        }
      )


  }



exports.updateUsername =
  function ({ email, password, applicationid, client, lang, mobile, username }) {

    console.log('-----------------');
    console.log('updateUsername');
    console.log('-----------------');

    if (!username || !password) { throw new Error('You must provide an username and password.'); }

    return User.findOne({ applicationid, client, lang, username }).then(

      existingUser => {


        if (!existingUser) { throw new Error('Unable to Update as username not in DB as user not in db'); }
        else {
          existingUser.email = email;
          existingUser.password = password;
          existingUser.mobile = mobile;
     //     console.log(existingUser.save());
          return existingUser.save()
        }
      }

    )

  }

  exports.saveUsername =
  function (
    { email, password, applicationid, client, lang, mobile, username,firstname,lastname,userauthorisations,status }
  ) {

    console.log('-----------------');
    console.log('saveUsername');
    console.log('-----------------');

    const user = new User({ applicationid, client, lang, username, password, email,firstname,
      lastname,userauthorisations,status }); //Initialise new user

    if (!username || !password) { throw new Error('You must provide an username and password.'); }
    return User.findOne({ applicationid, client, lang, username })
      .then(
        existingUser => {
          console.log('in user existingUser');

          if (existingUser) { 
         
            existingUser.email = email;
            existingUser.password = password;
            existingUser.mobile = mobile;
            existingUser.firstname=firstname;
            existingUser.lastname=lastname;
            existingUser.userauthorisations=userauthorisations;
            existingUser.status=status;

            console.log('Existing User Save');

            return existingUser.save();

          }
          else
          {
            console.log('New User Save');
            return user.save();

          }
            
    }
      )


  }



  exports.users =  (args, context, info) =>
  {
    const {applicationid, client, lang }= args
    return User.find({ applicationid, client, lang }).then(
      (userdocs) => {
         return userdocs
        }
      

    ).catch(err=>{
      return err
    })
  
  }









  exports.deleteUsername =
  function (
    { applicationid, client, lang,username, _id }
  ) {

    // console.log('-----------------');

    // console.log('deleteUsername');
    // console.log('applicationid-'+applicationid);
    // console.log('client-'+client);
    // console.log('lang-'+lang);
    // console.log('username-'+username);
    // console.log('_id-'+_id);
    // console.log('-----------------');
 
   // User.remove({_id}).then(result=> console.log(result) ).catch(err=>console.log(err))
 


  }