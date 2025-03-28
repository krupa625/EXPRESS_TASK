const fs = require("fs");

const readFileData = (sFilePath, callback) => {
  fs.readFile(sFilePath, "utf8", (err, data) => {
    if (err) {
      return callback(err, null);
    }
    try {
      const parsedData = JSON.parse(data);
      callback(null, parsedData);
    } catch (parseError) {
      callback(parseError, null);
    }
  });
};

const writeFileData = (sFilePath, data, callback) => {
  fs.writeFile(sFilePath, JSON.stringify(data, null, 2), "utf8", (err) => {
    callback(err);
  });
};

module.exports = { readFileData, writeFileData };
