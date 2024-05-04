const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

function createDb() {
  const db = new sqlite3.Database("./dataBase/mydatabase.db");
  db.serialize(function () {
    db.run(
      "CREATE TABLE if not exists users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, login TEXT, password TEXT, admin INTEGER,logs TEXT, posts TEXT, cookie TEXT, lastAsset TEXT)"
    );
  });
  db.close();
}
function writeInDb() {
  bcrypt.hash("Arfar1754", 10, (err, hash) => {
    if (err) {
      console.error("Ошибка при хешировании:", err);
    } else {
      const db = new sqlite3.Database("./dataBase/mydatabase.db");
      const posts = JSON.stringify({
        sent: [],
        received: [],
      });
      db.run(
        "INSERT INTO users (email, login, password, admin, logs, posts, cookie,lastAsset ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "IslamAliev2008@kvantomail.com",
          "IslamAliev",
          hash,
          "0",
          "",
          posts,
          "",
          "none",
        ],
        function (err) {
          if (err) {
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
}
function searchInDb() {
  const db = new sqlite3.Database("./dataBase/mydatabase.db");
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.login, row.email);
    });
  });
}

createDb();
writeInDb();
//searchInDb();
