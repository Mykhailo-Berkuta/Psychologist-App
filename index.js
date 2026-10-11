const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // дані з HTML-форм
app.use(express.json());                         // дані у форматі JSON (для PUT і DELETE)

// Головна сторінка веде на список клієнтів
app.get("/", (req, res) => res.redirect("/clients"));

// Підключення файлів з маршрутами
app.use("/", require("./routes/clients"));
app.use("/", require("./routes/services"));
app.use("/", require("./routes/consultations"));
app.use("/", require("./routes/stats"));

app.listen(3000, () => {
  console.log("Сервер запущено на порту 3000");
});