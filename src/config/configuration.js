require("dotenv").config();

module.exports = {
  email: process.env.EMAILID,
  port: process.env.PORT || 2000,
  pass: process.env.PASSWORD,
};




