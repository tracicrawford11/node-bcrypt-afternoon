require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");

//controllers
const {register, login, logout} = require("./controllers/authController");
const {dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure} = require('./controllers/treasureController');
const {usersOnly, adminsOnly} = require('./middleware/authMiddleware');

const {SESSION_SECRET, CONNECTION_STRING, SERVER_PORT} = process.env;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(dbInstance => {
    app.set("db", dbInstance);
    console.log("Connected to SkyNet.")
})

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: SESSION_SECRET,
    })
);


app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/auth/logout", logout);

app.get('/api/treasure/dragon', dragonTreasure);
app.get('/api/treasure/user', getUserTreasure, usersOnly);
app.post('/api/treasure/user', usersOnly, addUserTreasure);
app.get('/api/treasure/all',usersOnly, adminsOnly, getAllTreasure);

app.listen(SERVER_PORT, () => console.log(`Running on PORT ${SERVER_PORT}.`))