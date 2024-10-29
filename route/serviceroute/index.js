const express = require("express");
const ServicesController = require("../../controllers/servicecontroller");
const route = express.Router();

route.get("/", ServicesController.get);
route.post("/", ServicesController.add);
route.put("/:id", ServicesController.edit);
route.delete("/:id", ServicesController.det);

module.exports = route;