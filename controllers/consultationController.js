const { runDBCommand } = require("../db/connection");

// Перетворює дату й час з БД у формат РРРР-ММ-ДДTГГ:ХХ для поля <input type="datetime-local">
function toInputDateTime(d) {
  if (!d) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

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

// Форма редагування консультації
exports.showEditForm = async (req, res) => {
  try {
    const rows = await runDBCommand(
      "SELECT * FROM Consultation WHERE consultation_id = ?", [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).send("Консультацію не знайдено");
    }
    const clients = await runDBCommand("SELECT client_id, full_name FROM Client ORDER BY full_name");
    const services = await runDBCommand("SELECT service_id, service_name, format FROM ServiceType ORDER BY service_name");
    res.render("edit_consultation", {
      consultation: rows[0],
      dateValue: toInputDateTime(rows[0].consultation_date),
      clients,
      services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Оновлення консультації (запит PUT)
exports.updateConsultation = async (req, res) => {
  try {
    const { client_id, service_id, consultation_date, status, payment_status, notes } = req.body;
    await runDBCommand(
      `UPDATE Consultation
       SET client_id = ?, service_id = ?, consultation_date = ?, status = ?, payment_status = ?, notes = ?
       WHERE consultation_id = ?`,
      [client_id, service_id || null, consultation_date.replace("T", " "),
       status, payment_status || null, notes || null, req.params.id]
    );
    res.json({ redirect: "/consultations" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Видалення консультації (запит DELETE)
exports.deleteConsultation = async (req, res) => {
  try {
    await runDBCommand("DELETE FROM Consultation WHERE consultation_id = ?", [req.params.id]);
    res.json({ redirect: "/consultations" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};