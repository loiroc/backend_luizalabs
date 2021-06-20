const database = require("../config/database");

class CostumerController {
  async get(req, res) {
    try {
      const sql = await database.query("SELECT * FROM costumers");
      return res.send(sql[0]);
    } catch (err) {
      return res.status(400);
    }
  }
}

module.exports = new CostumerController();
