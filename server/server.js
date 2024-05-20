require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("./sequelize_conn.js");
const Task = require("./Task.js");
const User = require("./User.js");
const port = process.env.SERVER_PORT;
const app = express();

sequelize.sync();

app.use(express.static("views"));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/token", authenticateToken, (req, res) => {
  res.json({ user: req.user.username, id: req.user.id });
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "El usuario ya existe" });
    }

    const hashedPassword = await bycrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Usuario se creó de manera exitosa",
      newUser,
    });
  } catch (error) {
    console.error("Error on signup:", error);
    res.status(500).json({ success: false, message: "Error on signup" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send("Credenciales incorrectas");
    }
    const match = await bycrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ success: true, token, message: "Login correcto" });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res
      .status(500)
      .json({ success: false, message: "Error en el inicio de sesión" });
  }
});

// --- TODO APP API's --- //

app.get("/tasks/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.findAll({
      where: { UserId: userId },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
});

app.post("/task", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

app.put("/task/:id", async (req, res) => {
  const affectedRow = await Task.update(req.body, {
    where: { id: req.params.id },
  });
  res.json({ message: `Actualizado: ${affectedRow}` });
});

app.put("/taskComplete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { complete } = req.body;

    const affectedRows = await Task.update({ complete }, {
      where: { id },
    });
    
    const success = affectedRows > 0;
    res.json({ success });
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


app.delete("/task/:id", async (req, res) => {
  const deleteRow = await Task.destroy({
    where: { id: req.params.id },
  });
  res.json({ message: "Task Deleted: " + deleteRow });
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});

module.exports = app;
