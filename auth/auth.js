const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bCrypt = require("bcrypt");
const User = require("../models/User");
const HttpError = require("../error/httpError");

module.exports = () => {
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });
  passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => {
      if (err) throw new Error("Session non initialisée");
      next(null, user);
    });
  });

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, next) => {
        User.findOne({ email }, (err, user) => {
          if (err) return next(err);
          if (user == null)
            return next(new HttpError("email", "401", "Invalid email"), false); 
          if (bCrypt.compareSync(password, user.password))
            return next(null, user);
          return next(new HttpError("password", "401", "bad password"), false);
        });
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, next) => {
        let { firstname, lastname, poste, profil } = req.body;
        User.findOne({ email }, async (err, exist) => {
          if (err) return next(err);
          if (exist) {
            return next(
              new HttpError("email", "401", "email already exist"),
              false
            );
          }
          let pwd = bCrypt.hashSync(password, 12);
          let newUser = new User({
            firstname,
            lastname,
            email,
            password: pwd,
            poste,
            profil,
          });
          let user = await newUser.save().catch(next);
          return next(null, user);
        });
      }
    )
  );
};
