const express = require("express");
const { port } = require("./config/configuration");
const routes = require("./routes");
const { sendResponse } = require("./utils/responseHelper");

const app = express();

app.use(express.json());

app.use("/healthcheck", (req, res) => {
  sendResponse(res, "OK", "Server is Running Up!");
});

app.use("/api", routes);
app.use("/public", express.static("public"));

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
