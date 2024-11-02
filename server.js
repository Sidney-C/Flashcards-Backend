const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db.js");

const app = express();
const port = 3000;
const isDemo = true;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/allcards", async (req, res) => {
    try {
        const allCards = await pool.query("SELECT * FROM cards");
        res.json(allCards.rows);
    } catch (error) {
        console.log("Failed to connect...");
        console.error(error.message);
    }
});

app.post("/addcard", async (req, res) => {
    if (isDemo) {
        res.json("Action cannot be performed in demo mode.");
    } else {
        try {
            const { english, turkish } = req.body;
            await pool.query("INSERT INTO cards (english, turkish) VALUES ($1, $2)", [english, turkish]);
            res.json("added!");
        } catch (error) {
            console.error(error.message);
        }
    }
});

app.put("/editcard/:id", async (req, res) => {
    if (isDemo) {
        res.json("Action cannot be performed in demo mode.");
    } else {
        try {
            const { id } = req.params;
            const { english, turkish } = req.body;
            await pool.query("UPDATE cards SET english = $1, turkish = $2 WHERE id = $3", [english, turkish, id]);
            res.json("updated!");
        } catch (error) {
            console.error(error.message);
        }
    }
});

app.delete("/deletecard/:id", async (req, res) => {
    if (isDemo) {
        res.json("Action cannot be performed in demo mode.");
    } else {
        try {
            const { id } = req.params;
            await pool.query("DELETE FROM cards WHERE id = $1", [id]);
            res.json("deleted!");
        } catch (error) {
            console.error(error.message);
        }
    }
});

app.delete("/deleteall", async (req, res) => {
    if (isDemo) {
        res.json("Action cannot be performed in demo mode.");
    } else {
        try {
            await pool.query("DELETE FROM cards");
            res.json("deleted all!");
        } catch (error) {
            console.error(error.message);
        }
    }
});

app.listen(port, () => {
    console.log("Server running on Port " + port);
});
