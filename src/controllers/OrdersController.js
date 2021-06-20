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
  async getById(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "Missing order id" });
      const sql = await database.query(
        `SELECT * FROM orders WHERE order_id = ${id}`
      );
      if (sql[0].length > 0) return res.send(sql[0]);
      return res.status(404).send("Order does not exist!");
    } catch (err) {
      return res.status(400);
    }
  }
}

module.exports = new OrdersController();
