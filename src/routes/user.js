import express from "express";
import * as Auth from "../controllers/authentication";
import AuthCheck from "../middleware/auth-check";

const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).send("Welcome to API Home page");
});

router.post("/login", Auth.login);

router.post("/signup", Auth.signup);

router.get("/logout", Auth.logout);

router.post("/user", AuthCheck, (req, res) => {
  res.status(200).send(req.userData);
});

export default router;
