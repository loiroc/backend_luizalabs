const routes = require("express").Router();

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

module.exports = routes;
