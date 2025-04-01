const { check, validationResult } = require("express-validator");
const { sendResponse } = require("../utils/responseHelper");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return sendResponse(res, "BadRequest", errors);
  }
  next();
};
const validateStatus = [
  check("sStatus")
    .isString()
    .isIn(["available", "unavilable", "soldout"])
    .withMessage(
      "Invalid status, must be one of: available, unavailable, soldout"
    ),
];

function isUniqueName(data, sName, iId) {
  return !data.some((item) => item.sName === sName && item.iId !== iId);
}
function isNameExists(data, sName) {
  return data.some((item) => item.sName === sName);
}

module.exports = {
  validateRequest,
  isUniqueName,
  isNameExists,
  validateStatus,
};
