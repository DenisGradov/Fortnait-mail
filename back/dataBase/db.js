const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const dbPath = path.resolve(__dirname, "mydatabase.db");

function createDb() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Could not open database file:", err.message);
    } else {
      db.serialize(function () {
        db.run(
          "CREATE TABLE if not exists users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, login TEXT, password TEXT, admin INTEGER, logs TEXT, posts TEXT, cookie TEXT, lastAsset TEXT, adminMessage TEXT, blocked TEXT)"
        );
      });
      db.close();
    }
  });
}

function writeInDb() {
  bcrypt.hash("admin", 10, (err, hash) => {
    if (err) {
      console.error("Ошибка при хешировании:", err);
    } else {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error("Could not open database file:", err.message);
        } else {
          const posts = JSON.stringify({
            sent: [],
            received: [],
          });
          db.run(
            "INSERT INTO users (email, login, password, admin, logs, posts, cookie, lastAsset, adminMessage, blocked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              "admin@kvantomail.com",
              "admin",
              hash,
              "1",
              "[]",
              posts,
              "",
              "none",
              "",
              "0",
            ],
            function (err) {
              if (err) {
                console.error("Ошибка при записи в базу данных:", err);
              } else {
                console.log("Пользователь добавлен с ID:", this.lastID);
              }
              db.close();
            }
          );
        }
      });
    }
  });
}

function searchInDb() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Could not open database file:", err.message);
    } else {
      db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.login, row.email);
        });
        db.close();
      });
    }
  });
}

createDb();
writeInDb();
// searchInDb();
