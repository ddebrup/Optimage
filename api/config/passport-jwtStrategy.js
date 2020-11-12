const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/users");

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  // right now hard coding the value when deploying please remove this shit .
  secretOrKey: process.env.JWT_SECRET,
  issuer: "accounts.gupta.com",
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log('in jwt');
    User.findOne({ email: jwt_payload.email }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      console.log(user);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
