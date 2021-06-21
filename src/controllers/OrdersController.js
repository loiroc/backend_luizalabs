const database = require("../config/database");
const moment = require("moment");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const fs = require("fs");

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
  async sendmail(req, res) {
    const id = req.params.id;
    const email = req.body.email;

    if (!id) return res.status(400).json({ message: "Missing order id" });
    if (!email)
      return res.status(400).json({ message: "Missing recipient email" });

    const order_data = await database.query(
      `SELECT * FROM orders WHERE order_id = ${id}`
    );

    if (order_data[0].length <= 0)
      return res.status(400).json({ message: "Order does not exist" });

    const costumer_data = await database.query(
      `SELECT * FROM costumers WHERE id = ${order_data[0][0].costumer_id}`
    );

    const product_data = await database.query(
      `SELECT * FROM products WHERE id = ${order_data[0][0].product_id}`
    );

    const order_id = order_data[0][0].order_id;
    const costumer_name = costumer_data[0][0].name;
    const costumer_cpf = costumer_data[0][0].cpf;
    const costumer_gender = costumer_data[0][0].gender;
    const costumer_email = costumer_data[0][0].email;
    const product_description = product_data[0][0].description;
    const product_quantity = order_data[0][0].product_quantity;
    const product_price = product_data[0][0].price;
    const product_total = product_price * product_quantity;

    const output = `
    <h3>Pedido Nº ${order_id}</h3>
    <p>Dados do Cliente:</p>
    <ul>  
      <li>Cliente: ${costumer_name}</li>
      <li>CPF: ${costumer_cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      )}</li>
      <li>Sexo: ${costumer_gender === "M" ? "Masculino" : "Feminino"}</li>
      <li>E-mail: ${costumer_email}</li>
    </ul>
    <p>Dados do Pedido:</p>
    <ul>  
      <li>Produto: ${product_description}</li>
      <li>Quantidade: ${product_quantity}</li>
      <li>Preço Unitário: R$ ${product_price}</li>
      <li>Preço Total: R$ ${product_total}</li>
    </ul>
    <h3>Total do Pedido: R$ ${product_total}</h3>
  `;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "testedesenvolvedor01", // generated ethereal user
        pass: "dev01teste", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: '"Luizalabs" <contato@luizalabs.com>', // sender address
      to: `${email}`, // list of receivers
      subject: `Pedido de Venda Nº ${order_id}`, // Subject line
      text: "Pedido de Venda", // plain text body
      html: output, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({ message: "Something went wrong" });
      }

      res
        .status(200)
        .json({
          message: `The order with id ${order_id} has been sent to ${email}`,
        });
    });
  }
  async report(req, res) {

    const id = req.params.id;

    if (!id) return res.status(400).json({ message: "Missing order id" });

    const order_data = await database.query(
      `SELECT * FROM orders WHERE order_id = ${id}`
    );

    if (order_data[0].length <= 0)
      return res.status(400).json({ message: "Order does not exist" });

    const costumer_data = await database.query(
      `SELECT * FROM costumers WHERE id = ${order_data[0][0].costumer_id}`
    );

    const product_data = await database.query(
      `SELECT * FROM products WHERE id = ${order_data[0][0].product_id}`
    );

    const order_id = order_data[0][0].order_id;
    const costumer_name = costumer_data[0][0].name;
    const costumer_cpf = costumer_data[0][0].cpf;
    const costumer_gender = costumer_data[0][0].gender;
    const costumer_email = costumer_data[0][0].email;
    const product_description = product_data[0][0].description;
    const product_quantity = order_data[0][0].product_quantity;
    const product_price = product_data[0][0].price;
    const product_total = product_price * product_quantity;

    const content = `
    <h1>Pedido Nº ${order_id}</h1>
    <h3>Dados do Cliente:</h3>
    <p>Cliente: ${costumer_name} - Sexo: ${costumer_gender === "M" ? "Masculino" : "Feminino"} - CPF: ${costumer_cpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    )}</p>
      <p>E-mail: ${costumer_email}</p>
    <h3>Dados do Pedido:</h3>
    <ul>  
      <li>Produto: ${product_description}</li>
      <li>Quantidade: ${product_quantity}</li>
      <li>Preço Unitário: R$ ${product_price}</li>
      <li>Preço Total: R$ ${product_total}</li>
    </ul>
    <h3>Total do Pedido: R$ ${product_total}</h3>
  `;

    pdf.create(content, {}).toFile("./report.pdf", (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.readFile("report.pdf", (err, data) => {
          res.contentType("application/pdf");
          res.send(data);
        });
      }
    });
  }
}

module.exports = new OrdersController();
