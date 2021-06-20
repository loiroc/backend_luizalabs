const database = require("../config/database");

class CostumerController {
  async get(req, res) {
    try {
      const sql = await database.query("SELECT * FROM costumers");
      if(sql[0].length > 0) return res.send(sql[0]);
      return res.status(400).json({message: "There is no costumer registred yet!"})
    } catch (err) {
      return res.status(400);
    }
  }
  async getById(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "Missing costumer id" });
      const sql = await database.query(
        `SELECT * FROM costumers WHERE id = ${id}`
      );
      if (sql[0].length > 0) return res.send(sql[0]);
      return res.status(404).send("Costumers does not exist!");
    } catch (err) {
      return res.status(400);
    }
  }
  async post(req, res) {
    const name = req.body.name;
    const cpf = req.body.cpf;
    const gender = req.body.gender;
    const email = req.body.email;

    if (name && cpf && gender && email) {
      try {
        const sql = await database.query(
          `INSERT INTO costumers (name, cpf, gender, email) VALUES ('${name}', '${cpf}', '${gender}', '${email}')`
        );
        return res
          .status(201)
          .send(`Costumer with id ${sql[0].insertId} was created!`);
      } catch (err) {
        return res.status(400);
      }
    } else {
      console.log(name, cpf, gender, email);
      return res.status(400).json({
        message:
          "You have missing fields, please make sure you are sending name, cpf, gender and email values.",
      });
    }
  }
  async put(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const cpf = req.body.cpf;
    const gender = req.body.gender;
    const email = req.body.email;

    if (!id) return res.status(400).json({ message: "Missing costumer id" });
    if (name && cpf && gender && email) {
      try {
        const sql = await database.query(
          `UPDATE costumers SET name = '${name}', cpf = '${cpf}', gender = '${gender}', email = '${email}' WHERE id = ${id}`
        );
        return res.status(200).send(`Costumer with id ${id} was updated!`);
      } catch (err) {
        console.log(err);
        return res.status(400);
      }
    } else {
      console.log(name, cpf, gender, email);
      return res.status(400).json({
        message:
          "You should send all the fileds, please make sure you are sending name, cpf, gender or email values.",
      });
    }
  }
  async delete(req, res) {
    const id = req.params.id;

    if (!id) return res.status(400).json({ message: "Missing costumer id" });

    try {
      const sql = await database.query(
        `DELETE FROM costumers WHERE id = ${id}`
      );
      return res.status(200).send(`Costumer with id ${id} was deleted!`);
    } catch (err) {
      console.log(err);
      return res.status(400);
    }
  }
}

module.exports = new CostumerController();
