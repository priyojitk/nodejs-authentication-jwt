/* eslint-disable no-console */
import jwt from "jsonwebtoken";
import User from "../models/user";
import bcrypt from "bcrypt";

export const login = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.email) {
    return res.status(400).send({
      message: "Email can not be empty",
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      message: "Password can not be empty",
    });
  }

  // Find email in the database
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length > 0) {
        // console.log(user[0].password);
        bcrypt.compare(req.body.password, user[0].password).then((result) => {
          if (result) {
            console.log(process.env.JWT_EXPIRE_TIME);
            jwt.sign(
              { email: user[0].email, _id: user[0]._id },
              process.env.JWT_KEY,
              { expiresIn: process.env.JWT_EXPIRE_TIME },
              (err, token) => {
                res.json({
                  token,
                });
              }
            );
          } else {
            res.send({
              message: "Wrong Password!",
            });
          }
        });
      } else {
        res.send({
          message: "User does not Exists!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while checking your credentials",
      });
    });
};

export const logout = (req, res) => {
  // req.session.destroy();
  // This does not do anything
  return res.send({
    message: "Logout Success",
  });
};

// Create and Save a new Note
export const signup = (req, res) => {
  // console.log(req.body);

  //   // Validate request
  if (!req.body.email) {
    return res.status(400).send({
      message: "Email can not be empty",
    });
  }

  User.find({
    email: req.body.email,
  })
    .then((data) => {
      // Check if email is registered or not
      if (data.length > 0) {
        return res.status(500).send({
          message: "Email Already registered!",
        });
      }
      // Email is not registered
      if (!req.body.password1 && !req.body.password2) {
        return res.status(400).send({
          message: "Password can not be empty",
        });
      }

      const pwd1 = req.body.password1;
      const pwd2 = req.body.password2;
      if (pwd1 !== pwd2) {
        return res.status(400).send({
          message: "Passwords are not matched",
        });
      }

      const myPlaintextPassword = pwd1;
      const saltRounds = 10;
      bcrypt.hash(myPlaintextPassword, saltRounds).then((hash) => {
        // Store hash in your password DB.

        // Create a User
        const user = new User({
          email: req.body.email,
          user: req.body.user,
          password: hash,
        });

        // Save User in the database
        user
          .save()
          .then((data) => {
            res.send({
              message: "Signup Succes",
              data,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the account.",
            });
          });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the account.",
      });
    });
};
