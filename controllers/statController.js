const { runDBCommand } = require("../db/connection");

// Статистика 1: клієнти та їхні консультації (без дат)
exports.getClientsStat = async (req, res) => {
  try {
    const stats = await runDBCommand(`
      SELECT cl.client_id, cl.full_name, cl.status,
             COUNT(c.consultation_id) AS total,
             COUNT(CASE WHEN c.status = 'Проведена' THEN 1 END) AS held,
             COUNT(CASE WHEN c.status = 'Скасована' THEN 1 END) AS cancelled,
             COALESCE(SUM(CASE WHEN c.payment_status = 'Оплачено' THEN s.price END), 0) AS paid
      FROM Client cl
      LEFT JOIN Consultation c ON c.client_id = cl.client_id
      LEFT JOIN ServiceType s ON c.service_id = s.service_id
      GROUP BY cl.client_id, cl.full_name, cl.status
      ORDER BY total DESC, cl.full_name
    `);
    res.render("stat_clients", { stats });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};

// Статистика 2: сторінка з формою вибору періоду
exports.showPeriodForm = (req, res) => {
  res.render("stat_activity");
};

// Статистика 2: результат за обраний період (дати приходять з форми)
exports.getActivityStat = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).send("Вкажіть обидві дати");
    }
    if (startDate > endDate) {
      return res.status(400).send("Дата «з» не може бути пізнішою за дату «по»");
    }
    // Умова по датах стоїть у ON (а не в WHERE), щоб послуги без консультацій
    // за цей період теж потрапили у звіт з нулями
    const stats = await runDBCommand(
      `SELECT s.service_id, s.service_name, s.format, s.price,
              COUNT(c.consultation_id) AS total,
              COUNT(CASE WHEN c.status = 'Проведена' THEN 1 END) AS held,
              COUNT(CASE WHEN c.status = 'Скасована' THEN 1 END) AS cancelled,
              COALESCE(SUM(CASE WHEN c.payment_status = 'Оплачено' THEN s.price END), 0) AS income
       FROM ServiceType s
       LEFT JOIN Consultation c
              ON c.service_id = s.service_id
             AND DATE(c.consultation_date) BETWEEN ? AND ?
       GROUP BY s.service_id, s.service_name, s.format, s.price
       ORDER BY total DESC, s.service_name`,
      [startDate, endDate]
    );
    res.render("stat_activity_result", {
      stats,
      startDate,
      endDate,
      today: new Date().toLocaleDateString("uk-UA"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Помилка бази даних: " + err.message);
  }
};