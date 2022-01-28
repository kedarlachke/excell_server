const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define mode
const userSchema = new Schema({

        email: String,
        password: String,
        firstname: String,
        lastname: String,
        username: { type: String,  lowercase: true },
        birthday: String,
        gender: String,
        mobile: String, 
        location: String,
        businessname: String,
        client:String,
        applicationid:String,
        lang:String,
        status:String,
        userauthorisations:String

   }

);

//On Save Hook, encrypt password
//before saving a model,run this function
userSchema.pre('save', function(next) {

    const user = this;

    //generate a salt then run call back
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        //hash (encrypt) our password using salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            //overwrite plain text password with encrypted password
            user.password = hash;
            next();
        });
    });
});


userSchema.methods.comparePassword = function(caandidatePassword, callback) {
        bcrypt.compare(caandidatePassword, this.password, function(err, isMatch) {
            if (err) { return callback(err); }

            callback(null, isMatch);
        });

    }
    // Create model model class
const ModelClass = mongoose.model('user', userSchema);


//Export  the Model
module.exports = ModelClass;