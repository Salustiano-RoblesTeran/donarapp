const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Fundation = require('../models/Fundation')

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request!",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.secretOrPrivateKey);

    const fundation = await Fundation.findById(uid);

    if (!fundation) {
      return res.status(401).json({
        msg: "User does not exist",
      });
    }

    req.fundation = fundation;

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
