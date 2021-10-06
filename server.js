const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
//Déclarations de constantes Générales
const publisher = express();
const Main = require("./dataBase");
// const Routes = require('./routes/routes')
const User = require("./controllers/User");
const Post = require("./controllers/post");
const contact = require("./controllers/mail");
const Suscriber = require("./controllers/suscriber");
const Auth = require("./auth/auth");
//Utilisation des intergicielles Généraux
publisher.use(cors());
publisher.use(bodyParser.json({ limit: "50mb" }));
publisher.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

//Défintion de paramètes généraux
Main(() => {
  //initialisation de session et du passport
  publisher.use(
    session({
      resave: true,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      cookie: { secure: false },
    })
  );
  publisher.use(passport.initialize());
  publisher.use(passport.session());
  //utilisation de la fonction des routes
  //ustilisation de la fonction d'authentification
  Auth();
  publisher.route("/").get((req, res, next) => {
    res.json({
      message: "welcome to QOS publisher server",
    });
  });
  publisher.route("/register").post(
    passport.authenticate("register", {
      failWithError: true,
      message: "bad password or email please correct and retry",
      failureMessage: "bad password or email please correct and retry",
    }),
    (req, res) => {
      res.status(200).json({
        message: "Enregistrement Réussie",
        user: req.user,
      });
    }
  );
  publisher.route("/contact").post(contact);
  publisher.route("/login").post(
    passport.authenticate("login", {
      message: "bad password or email please correct and retry",
      failureMessage: "bad password or email please correct and retry",
      failWithError: true,
    }),
    (req, res) => {
      res.status(200).json({
        message: "Connexion Réussie",
        user: req.user,
      });
    }
  );
  publisher.route("/account").put(User.update);

  publisher.route("/logout").get((req, res) => {
    req.logout();
    res.status(200).redirect("/");
  });
  publisher.route("/posts").get(Post.read).post(Post.create);
  publisher
    .route("/post")
    .get(Post.readOne)
    .delete(Post.delete)
    .put(Post.update);
  publisher.route("/suscribe").delete(Suscriber.delete).post(Suscriber.create);
  publisher.route("/unsubscribe").all(Suscriber.delete);
  publisher.use((error, req, res, next) => {
    return res.status(500).json({ reason: error.message, type: error.name });
  });
}).catch((e) => {
  publisher.route("*").all((error, req, res, next) => {
    if (res.headersSent) {
      next(err);
    }
  });
});

publisher.listen(process.env.PORT);
