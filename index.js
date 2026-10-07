require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Подключение к базе данных
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
});

// Главная страница ведёт на список клиентов
app.get("/", (req, res) => res.redirect("/clients"));

// Список клиентов
app.get("/clients", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Client");
    res.render("clients", { clients: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
});

// Список послуг
app.get("/services", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ServiceType");
    res.render("services", { services: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
});

// Список консультацій (з іменем клієнта та назвою послуги)
app.get("/consultations", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.consultation_id, cl.full_name, s.service_name, s.format,
             c.consultation_date, c.status, c.payment_status, c.notes
      FROM Consultation c
      JOIN Client cl ON c.client_id = cl.client_id
      LEFT JOIN ServiceType s ON c.service_id = s.service_id
      ORDER BY c.consultation_date
    `);
    res.render("consultations", { consultations: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Сервер запущено на порту 3000");
});