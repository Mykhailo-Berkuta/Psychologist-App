const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/clients", clientController.getClients);
router.get("/add_client", clientController.showAddForm);
router.post("/add_client", clientController.addClient);
router.get("/client/:id/consultations", clientController.getClientConsultations);

router.get("/edit_client/:id", clientController.showEditForm);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);

module.exports = router;