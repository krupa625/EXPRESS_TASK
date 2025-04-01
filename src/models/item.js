const { v4: uuidv4 } = require("uuid");

class Item {
  constructor(sName, nPrice, nQuantity, sStatus = "available") {
    (this.iId = uuidv4()),
      (this.sName = sName),
      (this.nPrice = nPrice),
      (this.nQuantity = nQuantity),
      (this.sStatus = sStatus),
      (this.dCreatedAt = new Date()),
      (this.dUpdatedAt = new Date());
  }
}
module.exports = { Item };
