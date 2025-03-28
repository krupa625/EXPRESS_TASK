const express = require("express");
const {
  getItems,
  deleteItems,
  postItems,
  putItems,
  getItemID,
  getPaginatedItem,
} = require("../controller/item.controller");

const router = express.Router();

router.get("/data", getItems);
router.delete("/data/:iId", deleteItems);
router.post("/data/", postItems);
router.put("/data/:iId", putItems);
router.get("/data/:iId", getItemID);
router.get("/pagination/data", getPaginatedItem);

module.exports = router;
