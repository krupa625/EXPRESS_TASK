const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({ message, data });
  // res.set({ "Content-Type": "application/json" });
};

module.exports = { sendResponse };
