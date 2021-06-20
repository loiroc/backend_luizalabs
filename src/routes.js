const routes = require('express').Router();

// routes
const CostumerController = require("./controllers/CostumersController")

routes.get('/costumers/', CostumerController.get)
routes.get('/costumers/:id', CostumerController.getById);

module.exports = routes;