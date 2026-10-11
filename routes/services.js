const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.get("/services", serviceController.getServices);
router.get("/add_service", serviceController.showAddForm);
router.post("/add_service", serviceController.addService);

router.get("/edit_service/:id", serviceController.showEditForm);
router.put("/services/:id", serviceController.updateService);
router.delete("/services/:id", serviceController.deleteService);

module.exports = router;