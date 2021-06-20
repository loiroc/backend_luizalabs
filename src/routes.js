const routes = require('express').Router();

// routes
const CostumerController = require("./controllers/CostumersController")

routes.get('/costumers/', CostumerController.get)

module.exports = routes;