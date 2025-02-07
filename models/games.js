const mongoose = require("mongoose");

const gamesSchema = new mongoose.Schema({
    gameName:String
});

const Games = mongoose.model("Games", gamesSchema, "Games");

module.exports = Games;