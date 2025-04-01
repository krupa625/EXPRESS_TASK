const express = require("express");
const { check } = require("express-validator");
const {
  getItems,
  deleteItems,
  postItems,
  putItems,
  getItemID,
  getPaginatedItem,
} = require("../controller/item.controller");
const {
  validateRequest,
  validateStatus,
} = require("../middleware/item.validate");

const router = express.Router();

router.get("/data", getItems);
router.get(
  "/data/:iId",
  [check("iId").isUUID().withMessage("Invalid ID format"), validateRequest],
  getItemID
);
router.get("/pagination/data", getPaginatedItem);
router.delete(
  "/data/:iId",
  [check("iId").isUUID().withMessage("Invalid ID format"), validateRequest],
  deleteItems
);

router.post(
  "/data/",
  [
    check("sName").isString().notEmpty().withMessage("Name is required"),
    check("nPrice")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    check("nQuantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer"),
    check("sStatus").isString().notEmpty().withMessage("Status is required"),
    validateStatus,
    validateRequest,
  ],
  postItems
);

router.put(
  "/data/:iId",
  [
    check("iId").isUUID().withMessage("Invalid ID format"),
    check("sName")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Name must be a string"),
    check("nPrice")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    check("nQuantity")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer"),
    check("sStatus")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Status is required"),
    validateStatus,
    validateRequest,
  ],
  putItems
);

module.exports = router;
