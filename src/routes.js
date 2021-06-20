const routes = require('express').Router();

// costumers routes
const CostumerController = require("./controllers/CostumersController")

routes.get('/costumers/', CostumerController.get)
routes.get('/costumers/:id', CostumerController.getById);
routes.post('/costumers/', CostumerController.post)
routes.put('/costumers/:id', CostumerController.put)
routes.delete('/costumers/:id', CostumerController.delete)

module.exports = routes;