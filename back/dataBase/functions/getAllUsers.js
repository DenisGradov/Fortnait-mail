const sqlite3 = require("sqlite3").verbose();

// Функція для отримання всіх користувачів з таблиці
// tableName - назва таблиці з якої будуть отримані дані
function getAllUsers(tableName, callback) {
  const db = new sqlite3.Database(
    "./dataBase/mydatabase.db",
    sqlite3.OPEN_READONLY,
    (err) => {
      if (err) {
        console.error("Помилка при відкритті бази даних:", err.message);
      }
    }
  );

  const sql = `SELECT * FROM ${tableName}`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Помилка при виконанні запиту:", err.message);
      callback(err, null); // Повертаємо помилку через callback
    } else {
      callback(null, rows); // Повертаємо результати через callback
    }
  });

  db.close((err) => {
    if (err) {
      console.error("Помилка при закритті бази даних:", err.message);
    }
  });
}

/* Використання функції
getAllUsers("users", (err, users) => {
  if (err) {
    console.log("Сталася помилка:", err);
  } else if (users.length > 0) {
    console.log("Знайдені користувачі:", users);
  } else {
    console.log("Користувачі не знайдені.");
  }
});
*/
module.exports = getAllUsers;
