const express = require('express');
const router = express.Router();
const trainController = require("../controllers/trainController");


router.get("/search", trainController.findTrainsBetweenStations);
router.get("/:trainNo", trainController.getTrainTimeline);
router.get("/", trainController.getAllTrains);

module.exports = router;