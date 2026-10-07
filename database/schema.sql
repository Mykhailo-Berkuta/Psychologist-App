CREATE DATABASE IF NOT EXISTS Psychologist
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Psychologist;

CREATE TABLE Client (
  client_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  birth_date DATE,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  contact_source VARCHAR(100),
  status VARCHAR(50) NOT NULL
);

CREATE TABLE ServiceType (
  service_id INT PRIMARY KEY AUTO_INCREMENT,
  service_name VARCHAR(150) NOT NULL,
  format VARCHAR(50) NOT NULL,
  duration_min INT NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE Consultation (
  consultation_id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  service_id INT NULL,
  consultation_date DATETIME NOT NULL,
  status VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50),
  notes VARCHAR(500),
  FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES ServiceType(service_id) ON DELETE SET NULL
);

INSERT INTO Client (full_name, birth_date, phone, email, contact_source, status) VALUES
('Олена Коваленко', '1990-03-14', '0671111111', 'olena.k@gmail.com', 'Instagram', 'Активний'),
('Андрій Мельник', '1985-07-22', '0672222222', 'andriy.m@ukr.net', 'Рекомендація', 'Активний'),
('Марія Шевченко', '1998-11-05', '0673333333', 'maria.sh@gmail.com', 'Сайт', 'На паузі'),
('Іван Бондаренко', '1979-01-30', '0674444444', NULL, 'Рекомендація', 'Завершив терапію'),
('Софія Ткаченко', '2000-09-18', '0675555555', 'sofia.t@gmail.com', 'Telegram', 'Активний');

INSERT INTO ServiceType (service_name, format, duration_min, price, description) VALUES
('Первинна консультація', 'Онлайн', 60, 800.00, 'Знайомство, збір запиту'),
('Індивідуальна терапія', 'Офлайн', 50, 1200.00, 'Стандартна сесія'),
('Індивідуальна терапія', 'Онлайн', 50, 1000.00, 'Стандартна сесія онлайн'),
('Сімейна консультація', 'Офлайн', 90, 1800.00, 'Для пар і сімей'),
('Кризова консультація', 'Онлайн', 40, 700.00, 'Термінова підтримка');

INSERT INTO Consultation (client_id, service_id, consultation_date, status, payment_status, notes) VALUES
(1, 1, '2026-09-01 10:00:00', 'Проведена', 'Оплачено', 'Запит: тривожність'),
(1, 3, '2026-09-08 10:00:00', 'Проведена', 'Оплачено', NULL),
(1, 3, '2026-10-13 10:00:00', 'Запланована', 'Очікує оплати', NULL),
(2, 2, '2026-09-10 15:00:00', 'Проведена', 'Оплачено', 'Робота з вигоранням'),
(2, 2, '2026-09-24 15:00:00', 'Скасована', 'Очікує оплати', 'Клієнт захворів'),
(3, 1, '2026-08-20 12:00:00', 'Проведена', 'Оплачено', NULL),
(4, 4, '2026-07-05 18:00:00', 'Проведена', 'Оплачено', 'Завершення терапії'),
(5, NULL, '2026-10-20 11:30:00', 'Запланована', 'Передоплата', 'Вид послуги уточнюється');