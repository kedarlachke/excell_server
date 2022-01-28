const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('user');







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
