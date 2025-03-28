const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readFileData, writeFileData } = require("../middleware/fileHandler");
const { sendResponse } = require("../utils/responseHelper");
const {
  validateData,
  isValidUUID,
  isUniqueName,
  isNameExists,
} = require("../validations/item.validate");
const { sendEmail } = require("../utils/email");
const Logger = require("../service/logger");

function getItems(req, res) {
  try {
    const sFilePath = path.join(__dirname, "../data.json");
    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, 404, "Data not found!", null);
      }
      sendResponse(res, 200, "Data fetched successfully!", data);
    });
  } catch (err) {
    sendResponse(res, 500, "Something went wrong!", null);
  }
}

function getItemID(req, res) {
  try {
    const iId = req.params.iId;
    if (!isValidUUID(iId)) {
      return sendResponse(res, 400, "Invalid ID");
    }
    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Server Error");
      }

      const oItem = data.find((obj) => obj.iId === iId);

      if (oItem) {
        return sendResponse(
          res,
          200,
          "Data fetched successfully",
          (data = oItem)
        );
      } else {
        return sendResponse(res, 404, "Item not found");
      }
    });
  } catch (err) {
    sendResponse(res, 500, "Something went wrong!", null);
  }
}
function getPaginatedItem(req, res) {
  try {
    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Internal Server Error");
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedData = data.slice(startIndex, endIndex);

      sendResponse(
        res,
        200,
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
    sendResponse(res, 500, "Something went wrong!", null);
  }
}
function deleteItems(req, res) {
  try {
    const iId = req.params.iId;
    if (!isValidUUID(iId)) {
      return sendResponse(res, 400, "Invalid ID");
    }
    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Error reading data");
      }

      const aFilteredData = data.filter((item) => item.iId !== iId);

      if (aFilteredData.length === data.length) {
        return sendResponse(res, 404, "Item not found");
      }

      writeFileData(sFilePath, aFilteredData, (writeErr) => {
        if (writeErr) {
          return sendResponse(res, 500, "Error deleting data");
        }

        sendResponse(res, 200, "Data deleted successfully");
      });
      Logger.log(` Item deleted: ${JSON.stringify(aFilteredData)}`);
    });
  } catch (err) {
    sendResponse(res, 500, "Something went wrong!", null);
  }
}

function postItems(req, res) {
  try {
    const oNewItem = req.body;
    if (!oNewItem || Object.keys(oNewItem).length === 0) {
      return sendResponse(res, 400, "Invalid or empty data provided");
    }

    const error = validateData(oNewItem);
    if (error) {
      return sendResponse(res, 400, "Invalid data");
    }
    const sFilePath = path.join(__dirname, "../data.json");

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Error reading data");
      }

      // console.log("New Item Name:", oNewItem.sName);

      if (isNameExists(data, oNewItem.sName)) {
        return sendResponse(res, 400, "Name already exists");
      }

      oNewItem.iId = uuidv4();
      oNewItem.dCreatedAt = new Date().toLocaleString();
      oNewItem.dUpdatedAt = oNewItem.dCreatedAt;

      data.push(oNewItem);

      writeFileData(sFilePath, data, (writeErr) => {
        if (writeErr) {
          return sendResponse(res, 500, "Error saving data");
        }
        sendResponse(res, 201, "Item created successfully", (data = oNewItem));
        console.log(` Sending email to: pkripa42@gmail.com`);
        sendEmail("pkripa42@gmail.com", oNewItem);

        try {
          Logger.log(`New item created: ${JSON.stringify(oNewItem)}`);
        } catch (error) {
          console.error("Logger Error:", error);
        }
      });
    });
  } catch (err) {
    sendResponse(res, 500, "Something went wrong!", null);
  }
}

function putItems(req, res) {
  try {
    const iId = req.params.iId;
    if (!isValidUUID(iId)) {
      return sendResponse(res, 400, "Invalid ID");
    }
    const sFilePath = path.join(__dirname, "../data.json");

    const oUpdatedItem = req.body;
    const error = validateData(oUpdatedItem);
    if (error) {
      return sendResponse(res, 400, "Invalid data");
    }
    oUpdatedItem.dUpdatedAt = new Date().toLocaleString();

    readFileData(sFilePath, (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Error reading data");
      }

      const aItemIndex = data.findIndex((item) => item.iId === iId);

      if (aItemIndex === -1) {
        return sendResponse(res, 404, "Item not found");
      }
      const existingItem = data[aItemIndex];

      if (
        oUpdatedItem.sName !== existingItem.sName &&
        !isUniqueName(data, oUpdatedItem.sName, iId)
      ) {
        return sendResponse(res, 400, "Name already exists");
      }

      data[aItemIndex] = { ...data[aItemIndex], ...oUpdatedItem };

      writeFileData(sFilePath, data, (writeErr) => {
        if (writeErr) {
          return sendResponse(res, 500, "Error updating data");
        }

        return sendResponse(
          res,
          200,
          "Data updated successfully",
          (data = data[aItemIndex])
        );
      });
      Logger.log(` Item updated: ${JSON.stringify(data[aItemIndex])}`);
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
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
