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