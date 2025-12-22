const trainService = require("../services/trainServices");
exports.getAllTrains = async (req, res) => {
  try {
    const trains = await trainService.getAllTrains();
    res.json(trains);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findTrainsBetweenStations = async (req, res) => {
    const { from, to } = req.query;

    try {
        const data = await trainService.findTrains(from, to);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error:err.message});
    }
};

exports.getTrainTimeline = async (req, res) => {
    try {
        const data = await trainService.getTimeline(req.params.trainNo);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
