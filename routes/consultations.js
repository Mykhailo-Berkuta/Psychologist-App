const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");

router.get("/consultations", consultationController.getConsultations);
router.get("/add_consultation", consultationController.showAddForm);
router.post("/add_consultation", consultationController.addConsultation);

router.get("/edit_consultation/:id", consultationController.showEditForm);
router.put("/consultations/:id", consultationController.updateConsultation);
router.delete("/consultations/:id", consultationController.deleteConsultation);

module.exports = router;