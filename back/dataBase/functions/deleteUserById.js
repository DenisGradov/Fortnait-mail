const sqlite3 = require("sqlite3").verbose();

/**
 * Функция для удаления пользователя из таблицы по его ID.
 * @param {string} tableName - Название таблицы, из которой удаляется пользователь.
 * @param {number} userId - ID пользователя, которого нужно удалить.
 * @param {Function} callback - Функция обратного вызова, принимающая ошибку и результат выполнения.
 */
function deleteUserById(tableName, userId, callback) {
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

  const sql = `DELETE FROM ${tableName} WHERE id = ?`;

  db.run(sql, [userId], function (err) {
    if (err) {
      console.error("Ошибка при удалении пользователя:", err.message);
      callback(err, false);
    } else if (this.changes > 0) {
      console.log("Пользователь успешно удален.");
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

module.exports = deleteUserById;
