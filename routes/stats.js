const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");

router.get("/stat_clients", statController.getClientsStat);
router.get("/stat_activity", statController.showPeriodForm);
router.post("/stat_activity", statController.getActivityStat);

module.exports = router;