const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const db = sqlite3('./Achieve.db', { verbose: console.log });


const saltRounds = 10;
const app = express();
const staticPath = path.join(__dirname, 'public');

// -------------------- CORE MIDDLEWARE --------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(staticPath));

//-----------------------games--------------------------------------------------//

app.get('/games', (req, res)=>{

    const games = db.prepare(`

        Select 
        id,
        name, 
        picture 
        From game


    `).all();

    res.json(games);

});

//-----------------------Achivements--------------------------------------------//

app.get('/achievements/:gameId', (req, res) => {
    const gameId = req.params.gameId;

    const achievements = db.prepare(`
        SELECT 
        name, 
        description,
        image
        FROM achievements
        WHERE id_game = ?
        ORDER BY name COLLATE NOCASE ASC
    `).all(gameId);

    res.json(achievements);
});









app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
