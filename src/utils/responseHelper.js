const { STATUS_CODES } = require("./constants");

const sendResponse = (res, responseType, message, data = null) => {
  const status = STATUS_CODES[responseType] || STATUS_CODES.InternalServerError;
  return res.status(status).json({ message, data });
};

module.exports = { sendResponse };
