const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/clients", clientController.getClients);
router.get("/add_client", clientController.showAddForm);
router.post("/add_client", clientController.addClient);
router.get("/client/:id/consultations", clientController.getClientConsultations);

module.exports = router;