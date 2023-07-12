const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("authHeader : ", authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }
  if (token != null) {
    if (isTokenExpired(token)) {
      console.log("Token is expired.");
      return res.sendStatus(401);
    }
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    return decoded.exp < currentTimestamp;
  } catch (error) {
    return false;
  }
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
