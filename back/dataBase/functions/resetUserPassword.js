
const userId = 1;//id юзера в бд
const newPassword = "admin";//новый пас юзера

const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

/**
 * Функция для изменения пароля пользователя на "Arfar1754" по его ID.
 * @param {number} userId - ID пользователя, которому нужно изменить пароль.
 * @param {Function} callback - Функция обратного вызова, принимающая ошибку и результат выполнения.
 */
function resetUserPassword(userId, callback) {
  // Правильный путь к базе данных
  const dbPath = path.resolve(__dirname, '../mydatabase.db');

  console.log("Путь к базе данных:", dbPath);

  // Проверка существования файла базы данных
  if (!fs.existsSync(dbPath)) {
    const err = new Error(`Файл базы данных не найден по пути: ${dbPath}`);
    console.error(err.message);
    callback(err); // Возвращаем ошибку и прекращаем выполнение
    return;
  }

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error("Ошибка при открытии базы данных:", err.message);
      callback(err); // Возвращаем ошибку и прекращаем выполнение
      return;
    }
  });


  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      console.error("Ошибка при хешировании:", err.message);
      callback(err); // Возвращаем ошибку и прекращаем выполнение
      return;
    }

    const sql = `UPDATE users SET password = ? WHERE id = ?`;

    db.run(sql, [hash, userId], function (err) {
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
  });
}


resetUserPassword(userId, (err, success) => {
  if (err) {
    console.error("Произошла ошибка при изменении пароля:", err);
  } else if (success) {
    console.log("Пароль пользователя успешно изменен.");
  } else {
    console.log("Пользователь с таким ID не найден.");
  }
});