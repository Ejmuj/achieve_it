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

// -------------------- CORE MIDDLEWARE -----------------------------------------//


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));


// -------------------- AUTH MIDDLEWARE -----------------------------------------//


function requireAuth(req, res, next) {
  if (!req.session.loggedIn) {
    return res.redirect("/login");
  }
  next();
}

//----------------------- ROUTES ------------------------------------------------//

app.get("/", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});


//----------------------- ACHIEVEMNTS --------------------------------------------//

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

//----------------------- AUTH ROUTES ---------------------------------------------//


app.post('/login', (req, res) => {
    const { username, password } = req.body;


    const user = db
        .prepare("SELECT * FROM person WHERE username = ?")
        .get(username);


    if (!user) {
        return res.send("User not found");
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
        return res.send("Wrong password");
    }

    req.session.loggedIn = true;
    req.session.username = user.username;
    req.session.userid = user.id;

    return res.redirect('/');
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const existingUser = db
        .prepare("SELECT * FROM person WHERE username = ?")
        .get(username);

    if (existingUser) {
        return res.send("Username already taken");
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const result = db
        .prepare("INSERT INTO person (username, password) VALUES (?, ?)")
        .run(username, hashedPassword);

    req.session.loggedIn = true;
    req.session.username = username;
    req.session.userid = result.lastInsertRowid;

    return res.redirect('/');
});



app.get('/logout', (req, res) => {
    req.session.destroy();
    res.sendFile(path.join(__dirname, "/login"));
});

app.get('/games', (req, res) => {
    const sql = db.prepare('SELECT id, name, picture FROM game');
    res.json(sql.all());
});

app.get('/myGames', (req, res) => {
    const sql = db.prepare('SELECT id, name, picture FROM person_games');
    res.json(sql.all());
});

app.post('/newGame', (req, res) => {
    const { game, image } = req.body;

    db.prepare(`
        INSERT INTO person_games(name, picture)
        VALUES (?, ?)
    `).run(game, image);

    res.sendStatus(200);
});


//------------------------------- STATIC FILES ---------------------------------------------------------------//

app.use(express.static(staticPath));

//----------------------------- KJØRE SERVER --------------------------------------------------------------//

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
