const { validate: isUuid } = require("uuid");

const validateData = (data) => {
  let aKeys = Object.keys(data);
  let bool = false;
  aKeys.forEach((key) => {
    if (
      key !== "sName" &&
      key !== "nQuantity" &&
      key !== "nPrice" &&
      key !== "sStatus"
    ) {
      bool = true;
    }
  });

  if (bool) {
    return "Enter valid keys";
  }
  const { sName, nQuantity, nPrice, sStatus } = data;

  if (typeof sName !== "string") {
    return "name should be a string";
  }
  if (typeof nQuantity !== "number" || nQuantity <= 0) {
    return "quantity should be a number";
  }
  if (typeof nPrice !== "number" || nPrice <= 0) {
    return "price should be a number";
  }
  if (typeof sStatus !== "string") {
    return "Status should be a string";
  }

  return null;
};

function isValidUUID(id) {
  return isUuid(id);
}

function isUniqueName(data, sName, iId) {
  return !data.some((item) => item.sName === sName && item.iId !== iId);
}
function isNameExists(data, sName) {
  return data.some((item) => item.sName === sName);
}

module.exports = { validateData, isValidUUID, isUniqueName, isNameExists };
