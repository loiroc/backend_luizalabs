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
  async post(req, res) {
    const description = req.body.description;
    const color = req.body.color;
    const size = req.body.size;
    const price = req.body.price;

    if (description && color && size && price) {
      try {
        const sql = await database.query(
          `INSERT INTO products (description, color, size, price) VALUES ('${description}', '${color}', '${size}', '${price}')`
        );
        return res
          .status(201)
          .send(`Product with id ${sql[0].insertId} was created!`);
      } catch (err) {
        return res.status(400);
      }
    } else {
      return res.status(400).json({
        message:
          "You have missing fields, please make sure you are sending description, color, size and price values.",
      });
    }
  }
  async put(req, res) {
    const id = req.params.id;
    const description = req.body.description;
    const color = req.body.color;
    const size = req.body.size;
    const price = req.body.price;
    if (!id) return res.status(400).json({ message: "Missing product id" });
    if (description && color && size && price) {
      try {
        const sql = await database.query(
          `UPDATE products SET description = '${description}', color = '${color}', size = '${size}', price = '${price}' WHERE id = ${id}`
        );
        return res.status(200).send(`Costumer with id ${id} was updated!`);
      } catch (err) {
        return res.status(400);
      }
    } else {
      return res.status(400).json({
        message:
          "You should send all the fileds, please make sure you are sending description, color, size and price values.",
      });
    }
  }
}

module.exports = new ProductsController();
