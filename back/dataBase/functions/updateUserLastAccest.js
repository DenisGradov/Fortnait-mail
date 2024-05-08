const sqlite3 = require("sqlite3").verbose();

/**
 * Функция для обновления журнала действий пользователя и времени последнего доступа по его ID.
 * @param {string} tableName - Название таблицы, в которой происходит изменение.
 * @param {number} userId - ID пользователя.
 * @param {Function} callback - Функция обратного вызова, принимающая ошибку и результат выполнения.
 */
function updateUserLastAccest(tableName, userId, callback) {
  const db = new sqlite3.Database(
    "./dataBase/mydatabase.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error("Ошибка при открытии базы данных:", err.message);
        callback(err);
        return;
      }
    }
  );

  // Получаем текущие данные logs пользователя
  db.get(`SELECT logs FROM ${tableName} WHERE id = ?`, [userId], (err, row) => {
    if (err) {
      console.error("Ошибка при получении данных пользователя:", err.message);
      db.close();
      callback(err);
      return;
    }

    const newLastAccess = new Date().toISOString();

    // Обновляем logs и lastAccess в базе данных
    const sql = `UPDATE ${tableName} SET  lastAsset = ? WHERE id = ?`;
    db.run(sql, [newLastAccess, userId], function (err) {
      if (err) {
        console.error(
          "Ошибка при обновлении данных пользователя:",
          err.message
        );
        callback(err, false);
      } else if (this.changes > 0) {
        console.log(
          "Журнал и время последнего доступа пользователя успешно обновлены."
        );
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
  });
}

module.exports = updateUserLastAccest;
