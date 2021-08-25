const mongo = require("mongodb");
const User = require("../models/User");
const bCrypt = require("bcrypt");
const HttpError = require("../error/httpError");

module.exports = {
  update: async function (req, res, next) {
    let { userId, Credential } = req.query;
    Credential = Credential === "true";
    let {
        firstname,
        lastname,
        poste,
        profil,
        password,
        Npassword,
        passwordC,
        email,
      } = req.body,
      newUser,
      pwd;
    try {
      let exist = await User.findById({ _id: new mongo.ObjectID(userId) });

      if (bCrypt.compareSync(password, exist.password)) {
        if (Boolean(Credential)) {
          if (Npassword === passwordC) {
            pwd = bCrypt.hashSync(Npassword, 12);
            newUser = await User.findByIdAndUpdate(
              { _id: new mongo.ObjectID(userId) },
              { password: pwd },
              { new: true }
            );
          } else {
            throw new HttpError(
              "password",
              500,
              "Password_comfirmation don't match password"
            );
          }
        } else {
          newUser = await User.findByIdAndUpdate(
            { _id: new mongo.ObjectID(userId) },
            { firstname, lastname, poste, profil, email },
            { new: true }
          );
        }
        return res.status(200).json({
          message: `Account ${Credential ? "credentials" : ""} Updated`,
          user: newUser,
        });
      } else {
        throw new HttpError("password", 401, "bad password");
      }
    } catch (error) {
      next(error);
    }
  },
};
