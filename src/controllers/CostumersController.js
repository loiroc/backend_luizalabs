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
  async getById(req, res) {
    try {
      const id = req.params.id;
      const sql = await database.query(
        `SELECT * FROM costumers WHERE id = ${id}`
      );
      if (sql[0].length > 0) return res.send(sql[0]);
      return res.status(404).send("Costumers does not exist!");
    } catch (err) {
      return res.status(400);
    }
  }
}

module.exports = new CostumerController();
