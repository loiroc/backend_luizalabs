const database = require("../config/database");

class ProductsController {
  async get(req, res) {
    try {
      const sql = await database.query("SELECT * FROM products");
      if(sql[0].length > 0) return res.send(sql[0]);
      return res.status(400).json({message: "There is no product registred yet!"})
    } catch (err) {
      return res.status(400);
    }
  }
  async getById(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "Missing product id" });
      const sql = await database.query(
        `SELECT * FROM products WHERE id = ${id}`
      );
      if (sql[0].length > 0) return res.send(sql[0]);
      return res.status(404).send("Product does not exist!");
    } catch (err) {
      return res.status(400);
    }
  }
}

module.exports = new ProductsController();
