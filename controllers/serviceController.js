const { runDBCommand } = require("../db/connection");

// Список послуг
exports.getServices = async (req, res) => {
  try {
    const services = await runDBCommand("SELECT * FROM ServiceType");
    res.render("services", { services });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Форма додавання послуги
exports.showAddForm = (req, res) => {
  res.render("add_service");
};

// Додавання послуги
exports.addService = async (req, res) => {
  try {
    const { service_name, format, duration_min, price, description } = req.body;
    await runDBCommand(
      `INSERT INTO ServiceType (service_name, format, duration_min, price, description)
       VALUES (?, ?, ?, ?, ?)`,
      [service_name, format, duration_min, price, description || null]
    );
    res.redirect("/services");
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Форма редагування послуги
exports.showEditForm = async (req, res) => {
  try {
    const services = await runDBCommand(
      "SELECT * FROM ServiceType WHERE service_id = ?", [req.params.id]
    );
    if (services.length === 0) {
      return res.status(404).send("Послугу не знайдено");
    }
    res.render("edit_service", { service: services[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Оновлення послуги (запит PUT)
exports.updateService = async (req, res) => {
  try {
    const { service_name, format, duration_min, price, description } = req.body;
    await runDBCommand(
      `UPDATE ServiceType
       SET service_name = ?, format = ?, duration_min = ?, price = ?, description = ?
       WHERE service_id = ?`,
      [service_name, format, duration_min, price, description || null, req.params.id]
    );
    res.json({ redirect: "/services" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Видалення послуги (запит DELETE)
exports.deleteService = async (req, res) => {
  try {
    await runDBCommand("DELETE FROM ServiceType WHERE service_id = ?", [req.params.id]);
    res.json({ redirect: "/services" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};