const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(id) {
  return jwt.sign({ id: id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
