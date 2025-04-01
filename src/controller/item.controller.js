const path = require("path");
const { readFileData, writeFileData } = require("../utils/fileHandler");
const { sendResponse } = require("../utils/responseHelper");
const { isUniqueName, isNameExists } = require("../middleware/item.validate");
const { sendEmail } = require("../service/email");
const Logger = require("../utils/logger");
const { Item } = require("../models/item");
process.on("unhandledRejection", (err) => {
  console.log(err);
});
function getItems(req, res) {
  try {
    const sFilePath = path.join(__dirname, "../data.json");
    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, "NotFound", "Data not found!");
      }
      return sendResponse(res, "OK", "Data fetched successfully!", data);
    });
  } catch (err) {
    sendResponse(res, "InternalServerError", "Something went wrong!");
  }
}

function getItemID(req, res) {
  try {
    const { iId } = req.params;

    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, "InternalServerError", "Server Error");
      }

      const oItem = data.find((obj) => obj.iId === iId);

      if (oItem) {
        return sendResponse(
          res,
          "OK",
          "Data fetched successfully",
          (data = oItem)
        );
      } else {
        return sendResponse(res, "NotFound", "Item not found");
      }
    });
  } catch (err) {
    sendResponse(res, "InternalServerError", "Something went wrong!");
  }
}
function getPaginatedItem(req, res) {
  try {
    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(
          res,
          "InternalServerError",
          "Internal Server Error"
        );
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedData = data.slice(startIndex, endIndex);

      return sendResponse(
        res,
        "OK",
        "Data fetched successfully",
        (data = {
          page,
          limit,
          totalRecords: data.length,
          totalPages: Math.ceil(data.length / limit),
          data: paginatedData,
        })
      );
    });
  } catch (err) {
    sendResponse(res, "InternalServerError", "Something went wrong!");
  }
}
function deleteItems(req, res) {
  try {
    const { iId } = req.params;

    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, "InternalServerError", "Error reading data");
      }

      const aFilteredData = data.filter((item) => item.iId !== iId);

      if (aFilteredData.length === data.length) {
        return sendResponse(res, "NotFound", "Item not found");
      }

      writeFileData(sFilePath, aFilteredData, (writeErr) => {
        if (writeErr) {
          return sendResponse(
            res,
            "InternalServerError",
            "Error deleting data"
          );
        }

        return sendResponse(res, "OK", "Data deleted successfully");
      });
      Logger.log(` Item deleted: ${JSON.stringify(aFilteredData)}`);
    });
  } catch (err) {
    sendResponse(res, "InternalServerError", "Something went wrong!");
  }
}

function postItems(req, res) {
  try {
    const { sName, nPrice, nQuantity, sStatus } = req.body;

    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, "InternalServerErro", "Error reading data");
      }

      if (isNameExists(data, sName)) {
        return sendResponse(res, "BadRequest", "Name already exists");
      }
      const oData = new Item(sName, nPrice, nQuantity, sStatus);

      data.push(oData);

      writeFileData(sFilePath, data, (writeErr) => {
        if (writeErr) {
          return sendResponse(res, "InternalServerError", "Error saving data");
        }
        return sendResponse(
          res,
          "Create",
          "Item created successfully",
          (data = oData)
        );
      });
      console.log(` Sending email to: pkripa42@gmail.com`);
      sendEmail("pkripa42@gmail.com", oData);

      Logger.log(`New item created: ${JSON.stringify(oData)}`);
    });
  } catch (err) {
    sendResponse(res, "InternalServerError", "Something went wrong!");
    console.log(err.message);
  }
}

function putItems(req, res) {
  try {
    const { iId } = req.params;
    const sFilePath = path.join(__dirname, "../data.json");
    const oUpdatedItem = req.body;

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, "InternalServerError", "Error reading data");
      }

      const aItemIndex = data.findIndex((item) => item.iId === iId);

      if (aItemIndex === -1) {
        return sendResponse(res, "NotFound", "Item not found");
      }
      const existingItem = data[aItemIndex];

      if (
        oUpdatedItem.sName !== existingItem.sName &&
        !isUniqueName(data, oUpdatedItem.sName, iId)
      ) {
        return sendResponse(res, "BadRequest", "Name already exists");
      }

      data[aItemIndex].sName = oUpdatedItem.sName;
      data[aItemIndex].nPrice = oUpdatedItem.nPrice;
      data[aItemIndex].nQuantity = oUpdatedItem.nQuantity;
      data[aItemIndex].sStatus = oUpdatedItem.sStatus;
      data[aItemIndex].dUpdatedAt = new Date();

      writeFileData(sFilePath, data, (writeErr) => {
        if (writeErr) {
          return sendResponse(
            res,
            "InternalServerError",
            "Error updating data"
          );
        }

        return sendResponse(
          res,
          "OK",
          "Data updated successfully",
          (data = data[aItemIndex])
        );
      });
      Logger.log(` Item updated: ${JSON.stringify(data[aItemIndex])}`);
    });
  } catch (err) {
    sendResponse(res, "InternalServerError", "Something went wrong!");
  }
}

module.exports = {
  getItems,
  deleteItems,
  postItems,
  putItems,
  getItemID,
  getPaginatedItem,
};
