const passport = require("passport");
const restaurantsServices = require("../controllers/restaurants");
const restaurantServices = require("../controllers/restaurant");
const menusServices = require("../controllers/menus");
module.exports = (publisher) => {
  publisher
    .route("/publisher/register")
    .post(
      passport.authenticate("register", { failWithError: true }),
      (req, res) => {
        res.status(200).json({
          message: "Enregistrement Réussie",
          user: req.user,
        });
      }
    );
  publisher.route("/publisher/login").post(
    passport.authenticate("login", {
      failureMessage: "Erreur d'authentification",
    }),
    (req, res) => {
      res.status(200).json({
        message: "Authentification Réussie",
        user: req.user,
      });
    }
  );

  publisher
    .route("/publisher/restaurants/")
    .post(restaurantsServices.create)
    .get(restaurantsServices.read);

  publisher
    .route("/publisher/restaurants/:idRestaurant")
    .get(restaurantServices.read)
    .put(restaurantServices.update)
    .delete(restaurantServices.remove);

  publisher
    .route("/publisher/restaurants/:idRestaurant/menus")
    .post(menusServices.create)
    .get(menusServices.read);

  publisher
    .route("/publisher/restaurants/:idRestaurant/menus/:idMenu")
    .get()
    .put()
    .delete();

  publisher
    .route("/publisher/restaurants/:idRestaurant/commandes")
    .post()
    .get();

  publisher
    .route("/publisher/restaurants/:idRestaurant/commandes/:idCommande")
    .get()
    .put()
    .delete();

  publisher.route("/publisher/logout").get((req, res) => {
    req.logOut();
    res.status(200).json({
      message: "Déconnexion réussie",
    });
  });

  publisher.use((req, res) => {
    res.status(404).send("page not found");
  });

  publisher.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).send(err.message);
  });
};
