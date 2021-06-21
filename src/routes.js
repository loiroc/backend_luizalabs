const routes = require("express").Router();

// my route
routes.get("/", (req, res) => {
  res.json({
    message: "Olá, é um prazer em participar deste processo seletivo",
    author_name: "Meu nome é Lucas Coimbra",
    author_age: "Tenho 21 anos",
    author_current_role: "Atualmente sou Full Stack (React/Node)",
    author_linkedin_url: "https://www.linkedin.com/in/lucascmbr/",
    author_email: "coimbralusp@gmail.com",
    author_phone: "+55 (19) 9 9425-3921",
  });
});

// costumers routes
const CostumerController = require("./controllers/CostumersController");

routes.get("/costumers/", CostumerController.get);
routes.get("/costumers/:id", CostumerController.getById);
routes.post("/costumers/", CostumerController.post);
routes.put("/costumers/:id", CostumerController.put);
routes.delete("/costumers/:id", CostumerController.delete);

// products routes
const ProductsController = require("./controllers/ProductsController");

routes.get("/products/", ProductsController.get);
routes.get("/products/:id", ProductsController.getById);
routes.post("/products/", ProductsController.post);
routes.put("/products/:id", ProductsController.put);
routes.delete("/products/:id", ProductsController.delete);

// orders routes
const OrdersController = require("./controllers/OrdersController");

routes.get("/orders/", OrdersController.get);
routes.get("/orders/:id", OrdersController.getById);
routes.post("/orders/", OrdersController.post);
routes.put("/orders/:id", OrdersController.put);
routes.delete("/orders/:id", OrdersController.delete);

routes.post("/orders/:id/sendmail", OrdersController.sendmail)

module.exports = routes;
