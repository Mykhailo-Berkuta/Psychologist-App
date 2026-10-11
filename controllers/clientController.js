const { runDBCommand } = require("../db/connection");

// Список клієнтів
exports.getClients = async (req, res) => {
  try {
    const clients = await runDBCommand("SELECT * FROM Client");
    res.render("clients", { clients });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Форма додавання клієнта
exports.showAddForm = (req, res) => {
  res.render("add_client");
};

// Додавання клієнта
exports.addClient = async (req, res) => {
  try {
    const { full_name, birth_date, phone, email, contact_source, status } = req.body;
    await runDBCommand(
      `INSERT INTO Client (full_name, birth_date, phone, email, contact_source, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, birth_date || null, phone, email || null, contact_source || null, status]
    );
    res.redirect("/clients");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Консультації конкретного клієнта
exports.getClientConsultations = async (req, res) => {
  try {
    const clients = await runDBCommand(
      "SELECT * FROM Client WHERE client_id = ?", [req.params.id]
    );
    if (clients.length === 0) {
      return res.status(404).send("Клієнта не знайдено");
    }
    const consultations = await runDBCommand(
      `SELECT c.consultation_id, c.consultation_date, c.status, c.payment_status, c.notes,
              s.service_name, s.format, s.price
       FROM Consultation c
       LEFT JOIN ServiceType s ON c.service_id = s.service_id
       WHERE c.client_id = ?
       ORDER BY c.consultation_date`,
      [req.params.id]
    );
    res.render("client_consultations", { client: clients[0], consultations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};