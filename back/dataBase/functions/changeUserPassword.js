const sqlite3 = require("sqlite3").verbose();

/**
 * Функция для изменения пароля и cookie пользователя по его ID.
 * @param {string} tableName - Название таблицы, в которой происходит изменение.
 * @param {number} userId - ID пользователя, которому нужно изменить пароль.
 * @param {string} newPassword - Новый пароль пользователя (уже хешированный).
 * @param {Function} callback - Функция обратного вызова, принимающая ошибку и результат выполнения.
 */
function changeUserPasswordAndCookie(tableName, userId, newPassword, callback) {
  const db = new sqlite3.Database(
    "./dataBase/mydatabase.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error("Ошибка при открытии базы данных:", err.message);
        callback(err); // Возвращаем ошибку и прекращаем выполнение
        return;
      }
    }
  );

  const sql = `UPDATE ${tableName} SET password = ?, cookie = ? WHERE id = ?`;

  db.run(sql, [newPassword, newPassword, userId], function (err) {
    if (err) {
      console.error("Ошибка при обновлении данных пользователя:", err.message);
      callback(err, false);
    } else if (this.changes > 0) {
      console.log("Данные пользователя успешно обновлены.");
      callback(null, true);
    } else {
      console.log("Пользователь не найден.");
      callback(null, false);
    }
  });

  db.close((err) => {
    if (err) {
      console.error("Ошибка при закрытии базы данных:", err.message);
    }
  });
}

module.exports = changeUserPasswordAndCookie;
