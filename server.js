require("dotenv").config();
const express = require("express");
const cors = require("cors");

const trainRoutes = require("./routes/trainRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/trains", trainRoutes);

app.get("/", (req,res) => {
    res.send("Train Graph API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});