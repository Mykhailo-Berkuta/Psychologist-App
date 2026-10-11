const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");

router.get("/consultations", consultationController.getConsultations);
router.get("/add_consultation", consultationController.showAddForm);
router.post("/add_consultation", consultationController.addConsultation);

module.exports = router;