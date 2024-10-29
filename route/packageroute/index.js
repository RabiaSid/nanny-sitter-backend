const express = require("express");
const PackageController = require("../../controllers/packagecontroller");
const route = express.Router();

route.get("/", PackageController.get);
route.post("/", PackageController.add);
route.put("/:id", PackageController.edit);
route.delete("/:id", PackageController.det);

module.exports = route;