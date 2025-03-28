const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Foundation = require('../models/Foundation')

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request!",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.secretOrPrivateKey);

    const foundation = await Foundation.findById(uid);

    if (!foundation) {
      return res.status(401).json({
        msg: "User does not exist",
      });
    }

    req.foundation = foundation;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token is not valid!",
    });
  }
};

module.exports = {
    validateJWT,
};
