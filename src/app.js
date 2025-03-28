const express = require("express");
const { port } = require("./config/configuration");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use("/api", routes);
app.use("/public", express.static("public"));

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
