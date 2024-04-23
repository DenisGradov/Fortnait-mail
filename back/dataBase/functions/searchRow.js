const sqlite3 = require("sqlite3").verbose();

// Функція для пошуку рядків у базі даних
// tableName - назва таблиці для пошуку
// searchKey - ключ, за яким проводимо пошук
// searchValue - значення ключа для пошуку
function searchRow(tableName, searchKey, searchValue, callback) {
  const db = new sqlite3.Database(
    "./dataBase/mydatabase.db",
    sqlite3.OPEN_READONLY,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );

  const sql = `SELECT * FROM ${tableName} WHERE ${searchKey} = ?`;

  db.get(sql, [searchValue], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    callback(row); // викликаємо callback з результатом
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

/* Використання функції
searchRow("users", "username", "johndoe", (row) => {
  if (row) {
    console.log(row); // Виводимо знайдений рядок
  } else {
    console.log("Рядок не знайдено");
  }
});
*/
module.exports = searchRow;
