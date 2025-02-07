var msg = "Hi"

console.log(msg)

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const mongoose = require("mongoose");
const bodyParser = require ("body-parser");

const Games = require("./models/games");
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")))

const mongouri = "mongodb://localhost:27017/GamesDB"
mongoose.connect(mongouri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});

app.get("/games", async (req, res)=>{
  try{
      const games = await Games.find();
      res.json(games);
      console.log(games);
  }catch(err){
      res.status(500).json({error:"Failed to get games."});
  }
});

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});
 
router.get('/AddToList',function(req,res){
  res.sendFile(path.join(__dirname+'/public/addtolist.html'));
});

router.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/public/login.html'));
});

app.post("/addtolist", async (req,res)=>{
  try{
      const newGame = new Games(req.body)
      const saveGame = await newGame.save()
      res.redirect("/")
      console.log(saveGame)
  }catch(err){
      res.status(501).json({error:"Failed to add new Game."});
  }
})

app.delete("/games/:id", async (req, res) => {
  try {
      const deleteGame = await Games.findOneAndDelete({ _id: req.params.id });
      if (!deleteGame) {
          return res.status(404).json({ error: "Game not found" });
      }

      res.json({ message: "Game deleted successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/games/:id", async (req, res) => {
  try {
      const game = await Games.findById(req.params.id);
      if (!game) {
          return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch game" });
  }
});

app.put("/updategames/:id", async (req, res) => {
  try {
      const updatedGame = await Games.findByIdAndUpdate(
          req.params.id, 
          { gameName: req.body.gameName},
          { new: true } 
      );

      if (!updatedGame) {
          return res.status(404).json({ error: "Game not found" });
      }

      res.json(updatedGame);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update game" });
  }
});

app.get("/edit/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "edit.html"));
});

app.use('/', router);
app.listen(process.env.port || 3000);


console.log('Running at Port 3000');