const database = require("../config/database");

class OrdersController {
  async get(req, res) {
    try {
      const sql = await database.query("SELECT * FROM orders");
      if(sql[0].length > 0) return res.send(sql[0]);
      return res.status(400).json({message: "There is no order registred yet!"})
    } catch (err) {
      return res.status(400);
    }
  }
}

module.exports = new OrdersController();
