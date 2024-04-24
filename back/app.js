const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const searchRow = require("./dataBase/functions/searchRow.js");
const updateField = require("./dataBase/functions/updateField.js");
const app = express();
const SECRET_KEY = "HLHNLcHGnJQM-be2aR0P5UpZl-NruOGVFZMu5d";
// Для обробки JSON тіла запиту
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Соль для хеширования. 10 — это количество раундов генерации соли.
const saltRounds = 10;

// Для обробки URL-кодованих даних
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  // Представь, что тут код для проверки логина и пароля пользователя
  // Если проверка успешна:
  res.cookie("sessionId", "some-encrypted-session-id", {
    httpOnly: true,
    secure: true,
  });
  res.send("Вы вошли в систему.");
});

app.post("/api/verifyToken", (req, res) => {
  const { token, login, loginType } = req.body;
  console.log(req.body);
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  } else {
    console.log(token);
    searchRow("users", loginType, login, (row) => {
      if (row) {
        if (token === row.cookie) {
          console.log(row);
          res.statusCode = 200;
          res.send(row.admin.toString());
        }
      } else {
        console.log("Рядок не знайдено");
        res.statusCode = 401;
        res.send("don't good");
      }
    });
  }
});

app.post("/api/login", (req, res) => {
  console.log("sssss2");
  const { formData } = req.body;
  console.log("s");
  searchRow(
    "users",
    formData.login.includes("@") ? "email" : "login",
    formData.login,
    (row) => {
      if (row) {
        bcrypt.compare(formData.password, row.password, (err, isMatch) => {
          if (err) {
            console.error("Ошибка при проверке пароля:", err);
          } else {
            if (isMatch) {
              console.log("Пароль совпадает!");
              res.statusCode = 200;
              console.log(req.cookies);
              // Устанавливаем cookie напрямую
              const token = jwt.sign({ userId: formData.login }, SECRET_KEY, {
                expiresIn: "10y",
              });
              updateField(
                formData.login,
                "cookie",
                formData.login.includes("@") ? "email" : "login",
                token,
                (err, result) => {
                  if (err) {
                    console.error("Помилка оновлення:", err);
                  } else if (result.changes > 0) {
                    console.log("Оновлено поле:", result);
                  } else {
                    console.log(formData.login);
                    console.log("Рядок для оновлення не знайдено.");
                  }
                }
              );
              res.json({
                errorData: [false, false],
                token,
                login: formData.login,
                type: formData.login.includes("@") ? "email" : "login",
              });
            } else {
              console.log("Пароль не совпадает.");
              res.statusCode = 401;
              res.send("don't good");
            }
          }
        });
      } else {
        console.log("Рядок не знайдено");
        res.statusCode = 401;
        res.send("don't good");
      }
    }
  );

  console.log(formData);
  if (!formData) return res.status(401).send("Token is required");
});

app.post("/logout", (req, res) => {
  // Удали куки при выходе
  res.clearCookie("sessionId");
  res.send("Вы вышли из системы.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
