const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

class Logger extends EventEmitter {
  log(message) {
    const logMessage = `${new Date().toISOString()} - ${message}\r\n`;

    console.log(logMessage);

    try {
      fs.appendFileSync(path.join(__dirname, "../log.txt"), logMessage);
    } catch (err) {
      console.error("Error writing to log file:", err);
    }
  }
}

module.exports = new Logger();
