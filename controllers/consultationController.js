const { runDBCommand } = require("../db/connection");

// Список консультацій (з іменем клієнта та назвою послуги)
exports.getConsultations = async (req, res) => {
  try {
    const consultations = await runDBCommand(`
      SELECT c.consultation_id, cl.full_name, s.service_name, s.format,
             c.consultation_date, c.status, c.payment_status, c.notes
      FROM Consultation c
      JOIN Client cl ON c.client_id = cl.client_id
      LEFT JOIN ServiceType s ON c.service_id = s.service_id
      ORDER BY c.consultation_date
    `);
    res.render("consultations", { consultations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Форма додавання консультації (потрібні списки клієнтів і послуг)
exports.showAddForm = async (req, res) => {
  try {
    const clients = await runDBCommand("SELECT client_id, full_name FROM Client ORDER BY full_name");
    const services = await runDBCommand("SELECT service_id, service_name, format FROM ServiceType ORDER BY service_name");
    res.render("add_consultation", { clients, services });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Додавання консультації
exports.addConsultation = async (req, res) => {
  try {
    const { client_id, service_id, consultation_date, status, payment_status, notes } = req.body;
    await runDBCommand(
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
};