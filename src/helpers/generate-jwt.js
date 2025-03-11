const jwt = require("jsonwebtoken");

const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.secretOrPrivateKey,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Cannot generate token!");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
    generateJWT,
};
