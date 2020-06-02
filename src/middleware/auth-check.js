import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;

    next();
  } catch (e) {
    // Auth Failed
    res.status(401).send("Auth Failed");
  }
};
