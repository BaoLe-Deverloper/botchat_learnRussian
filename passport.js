

const passport_fb = require('passport-facebook').Strategy

var dateFormat = require('dateformat');
const User = require("./user")

var bcrypt = require('bcrypt-nodejs');
const generateSafeId = require('generate-safe-id');

module.exports = function (passport) {



  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  /*==============facebook authentication =======================*/

  passport.use(new passport_fb({
    clientID: "671404459897555",
    clientSecret: "192f81f015c9d89fcdee88d5acafede8",
    callbackURL: "https://c2807ead.ngrok.io/auth/facebook/callbackfacebook",
    profileFields: ['email', 'name', 'gender', 'birthday', 'locale']
  },
    (accessToken, refreshToken, profile, done) => {

      User.findOne({ _id: profile._json.id }, (err, user) => {

        if (err) return done(err);
        if (user) {

          return done(null, user);
        }
        // var salt = bcrypt.genSaltSync(saltRounds);
        var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
        const newUser = new User({
          _id: profile._json.id,
          mail: profile._json.email,
          name: profile._json.name || profile._json.last_name + ' ' + profile._json.first_name,
          created_date: day,
        })
        newUser.save((err) => {

          return done(null, newUser);
        })
      })
    }
  ));
};

