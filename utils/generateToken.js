const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  //set jwt as HTTP only cookie

  res.cookie("jwt", token, {
    httpOnly: true,
    // secure:process.env.NODE_ENV!=='development',
    // sameSite:'strict',
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports = { generateToken };
