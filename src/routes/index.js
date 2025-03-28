const express = require("express");
const itemRoutes = require("./item.routes");

const router = express.Router();

router.use("/", itemRoutes);

module.exports = router;
