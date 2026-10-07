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

// ---------- ДОДАВАННЯ КЛІЄНТА ----------
app.get("/add_client", (req, res) => {
  res.render("add_client");
});

app.post("/add_client", async (req, res) => {
  try {
    const { full_name, birth_date, phone, email, contact_source, status } = req.body;
    await pool.query(
      `INSERT INTO Client (full_name, birth_date, phone, email, contact_source, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, birth_date || null, phone, email || null, contact_source || null, status]
    );
    res.redirect("/clients");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
});

// ---------- ДОДАВАННЯ ПОСЛУГИ ----------
app.get("/add_service", (req, res) => {
  res.render("add_service");
});

app.post("/add_service", async (req, res) => {
  try {
    const { service_name, format, duration_min, price, description } = req.body;
    await pool.query(
      `INSERT INTO ServiceType (service_name, format, duration_min, price, description)
       VALUES (?, ?, ?, ?, ?)`,
      [service_name, format, duration_min, price, description || null]
    );
    res.redirect("/services");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
});

// ---------- ДОДАВАННЯ КОНСУЛЬТАЦІЇ ----------
app.get("/add_consultation", async (req, res) => {
  try {
    const [clients] = await pool.query("SELECT client_id, full_name FROM Client ORDER BY full_name");
    const [services] = await pool.query("SELECT service_id, service_name, format FROM ServiceType ORDER BY service_name");
    res.render("add_consultation", { clients, services });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
});

app.post("/add_consultation", async (req, res) => {
  try {
    const { client_id, service_id, consultation_date, status, payment_status, notes } = req.body;
    await pool.query(
      `INSERT INTO Consultation (client_id, service_id, consultation_date, status, payment_status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [client_id, service_id || null, consultation_date.replace("T", " "),
       status, payment_status || null, notes || null]
    );
    res.redirect("/consultations");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Сервер запущено на порту 3000");
});