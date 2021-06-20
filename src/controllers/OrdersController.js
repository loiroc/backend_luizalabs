const database = require("../config/database");
const moment = require("moment");

class OrdersController {
  async get(req, res) {
    try {
      const sql = await database.query("SELECT * FROM orders");
      if (sql[0].length > 0) return res.send(sql[0]);
      return res
        .status(400)
        .json({ message: "There is no order registred yet!" });
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
  async post(req, res) {
    const order_date = moment().format("YYYY-MM-DD HH:mm:ss");
    const costumer_id = req.body.costumer_id;
    const product_id = req.body.product_id;
    const product_quantity = req.body.product_quantity;
    const additional_note = req.body.additional_note;
    const payment_type = req.body.payment_type;

    if (costumer_id && product_id && product_quantity && payment_type) {
      const costumer = await database.query(
        `SELECT * FROM costumers WHERE id = ${costumer_id}`
      );
      if (costumer[0].length <= 0)
        return res
          .status(404)
          .json({ message: `Costumer with ${costumer_id} was not found` });

      const product = await database.query(
        `SELECT * FROM products WHERE id = ${product_id}`
      );
      if (product[0].length <= 0)
        return res
          .status(404)
          .json({ message: `Product with ${product_id} was not found` });

      try {
        const product_total = product[0][0].price * product_quantity;
        const sql = await database.query(
          `INSERT INTO orders (order_date, costumer_id, product_id, product_quantity, product_total, additional_note, payment_type) VALUES ('${order_date}', '${costumer_id}', '${product_id}', '${product_quantity}', '${product_total}', '${
            additional_note ? additional_note : ""
          }', '${payment_type}')`
        );
        return res
          .status(201)
          .send(`Order with id ${sql[0].insertId} was created!`);
      } catch (err) {
        return res.status(400);
      }
    } else {
      return res.status(400).json({
        message:
          "You have missing fields, please make sure you are sending costumer_id, product_id, product_quantity, payment_type values.",
      });
    }
  }
  async put(req, res) {
    const id = req.params.id;
    const order_date = moment().format("YYYY-MM-DD HH:mm:ss");
    const costumer_id = req.body.costumer_id;
    const product_id = req.body.product_id;
    const product_quantity = req.body.product_quantity;
    const additional_note = req.body.additional_note;
    const payment_type = req.body.payment_type;
    if (!id) return res.status(400).json({ message: "Missing order id" });
    if (costumer_id && product_id && product_quantity && payment_type) {
      const costumer = await database.query(
        `SELECT * FROM costumers WHERE id = ${costumer_id}`
      );
      if (costumer[0].length <= 0)
        return res
          .status(404)
          .json({ message: `Costumer with ${costumer_id} was not found` });

      const product = await database.query(
        `SELECT * FROM products WHERE id = ${product_id}`
      );
      if (product[0].length <= 0)
        return res
          .status(404)
          .json({ message: `Product with ${product_id} was not found` });
      try {
        const product_total = product[0][0].price * product_quantity;
        const sql = await database.query(
          `UPDATE orders SET order_date = '${order_date}', costumer_id = '${costumer_id}', product_id = '${product_id}', product_quantity = '${product_quantity}', product_total = '${product_total}', additional_note = '${
            additional_note ? additional_note : ""
          }', payment_type = '${payment_type}'`
        );
        return res.status(200).send(`Order with id ${id} was updated!`);
      } catch (err) {
        return res.status(400);
      }
    } else {
      return res.status(400).json({
        message:
          "You should send all the fileds, please make sure you are sending costumer_id, product_id, product_quantity, payment_type values.",
      });
    }
  }
  async delete(req, res) {
    const id = req.params.id;

    if (!id) return res.status(400).json({ message: "Missing order id" });

    try {
      const sql = await database.query(
        `DELETE FROM orders WHERE order_id = ${id}`
      );
      return res.status(200).send(`Order with id ${id} was deleted!`);
    } catch (err) {
      return res.status(400);
    }
  }
}

module.exports = new OrdersController();
