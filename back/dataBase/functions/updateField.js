const sqlite3 = require("sqlite3").verbose();

function updateField(login, field, withWhatSearch, newValue, callback) {
  const db = new sqlite3.Database(
    "./dataBase/mydatabase.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
        callback(err);
        return;
      }
    }
  );

  const sql = `UPDATE users SET ${field} = ? WHERE ${withWhatSearch} = ?`;

  db.run(sql, [newValue, login], function (err) {
    if (err) {
      console.error(err.message);
      callback(err);
    } else {
      callback(null, {
        login: login,
        [field]: newValue,
        changes: this.changes,
      });
    }
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}
/* Використання функції:
updateField('userLogin', 'login', 'password', 'newSecretPassword', (err, result) => {
  if (err) {
    // Обробка помилки
    console.error('Помилка оновлення:', err);
  } else if (result.changes > 0) {
    // Оновлення пройшло успішно
    console.log('Оновлено поле:', result);
  } else {
    // Рядок для оновлення не знайдено
    console.log('Рядок для оновлення не знайдено.');
  }
});
*/
module.exports = updateField;
