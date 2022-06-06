const jsonwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jsonwebtoken.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};
