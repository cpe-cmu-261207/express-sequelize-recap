const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("hello my restful is worked!!!");
});

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./sql_database.db",
});

const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.TEXT,
    },
  },
  { timestamps: false }
);

app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.status(200).json({ data: user, message: "login success" });
    } else {
      res.status(402).json("login failed");
    }
  } catch (err) {
    res.json(err);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.create({ username, password });
    res.json("created success");
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    app.listen(8000, () => console.log("server started"));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
