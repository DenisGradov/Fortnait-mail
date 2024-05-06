const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

function addNewUser(login, email, password) {
  let allGood = true;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Ошибка при хешировании:", err);
      allGood = false;
    } else {
      const db = new sqlite3.Database("./dataBase/mydatabase.db");
      const posts = JSON.stringify({
        sent: [],
        received: [],
      });
      db.run(
        "INSERT INTO users (email, login, password, admin, logs, posts, cookie,lastAsset ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [email, login, hash, "0", JSON.stringify([]), posts, "", "none"],
        function (err) {
          if (err) {
            allGood = false;
            console.error("Ошибка при записи в базу данных:", err);
            db.close();
          } else {
            console.log("Пользователь добавлен с ID:", this.lastID);
            db.close();
          }
        }
      );
    }
  });
  return allGood;
}

module.exports = addNewUser;
