const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const geoip = require("geoip-lite");
require("dotenv").config({ path: "../.env" });

const transporter = nodemailer.createTransport({
  host: "127.0.0.1", // Указываем IPv4 адрес localhost
  port: 25,
  secure: false, // true для порта 465, false для порта 25 или 587
  tls: {
    rejectUnauthorized: false, // Если ваш сервер не использует сертификаты SSL/TLS
  },
});

function addToLog(text, row, req, res) {
  const ip = req.headers["x-forwarded-for"];
  const id = row.id;
  const geo = geoip.lookup(ip);
  updateUserLogsAndLastAccess(
    "users",
    id,
    text,
    ip,
    geo ? geo.country : "none",
    (error, result) => {
      if (error) {
        console.error("Произошла ошибка:", error);
      }
    }
  );
}

const cors = require("cors");

const domain = process.env.DOMAIN;
console.log(domain); // виведе вашдомен.com

const searchRow = require("./dataBase/functions/searchRow.js");
const updateField = require("./dataBase/functions/updateField.js");
const getAllUsers = require("./dataBase/functions/getAllUsers.js");
const addNewUser = require("./dataBase/functions/addNewUser.js");
const changeUserPasswordAndCookie = require("./dataBase/functions/changeUserPassword.js");
const deleteUserById = require("./dataBase/functions/deleteUserById.js");
const changeUserLogin = require("./dataBase/functions/changeUserLogin.js");
const updateUserLogsAndLastAccess = require("./dataBase/functions/updateUserLogsAndLastAccess.js");
const app = express();
const SECRET_KEY = "HLHNLcHGnJQM-be2aR0P5UpZl-NruOGVFZMu5d";
// Для обробки JSON тіла запиту
app.use(express.json());
app.use(cors({ origin: ["https://kvantomail.com", "http://localhost:5173"] }));

// Соль для хеширования. 10 — это количество раундов генерации соли.
const saltRounds = 10;

// Для обробки URL-кодованих даних
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  // Представь, что тут код для проверки логина и пароля пользователя
  res.cookie("sessionId", "some-encrypted-session-id", {
    httpOnly: true,
    secure: true,
  });
  res.send("Вы вошли в систему.");
});

app.post("/api/SendMail", (req, res) => {
  const { token, login, loginType, sendTo, sendSubject, sendText } = req.body;
  console.log(`sendto:${sendTo}`);
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  } else {
    searchRow("users", loginType, login, (row) => {
      console.log(loginType);
      console.log(row.cookie);
      if (row) {
        if (token === row.cookie) {
          let mailOptions = {
            from: row.email,
            to: sendTo, // Адреса отримувача
            subject: sendSubject, // Тема листа
            text: sendText, // Текст листа
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Помилка при відправленні: ", error);
              res.status(500).send("Помилка сервера при відправленні листа");
            } else {
              console.log("Лист відправлено: %s", info.messageId);
              addToLog("Отправил письмо", row, req, res);

              res.send("Лист успішно відправлено");
            }
          });
        } else {
          console.log("Рядок не знайдено");
          res.statusCode = 401;
          res.send("don't good");
        }
      }
    });
  }
});

app.post("/api/getPosts", (req, res) => {
  const { token, login, loginType } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  } else {
    searchRow("users", loginType, login, (row) => {
      console.log(loginType);
      console.log(row.cookie);
      if (row) {
        if (token === row.cookie) {
          updateUserLastAccest("users", row.id, (error, result) => {
            if (error) {
              console.error("Произошла ошибка:", error);
            }
          });
          res.json(JSON.parse(row.posts));
        } else {
          console.log("Рядок не знайдено");
          res.statusCode = 401;
          res.send("don't good");
        }
      }
    });
  }
});

app.post("/api/AddNewUser", (req, res) => {
  const {
    token,
    login,
    loginType,
    newUserEmail,
    newUserLogin,
    newUserPassword,
    adminStatus,
  } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  }

  searchRow("users", loginType, login, (row) => {
    console.log(loginType);
    console.log(row.cookie);
    if (row) {
      if (token === row.cookie && row.admin == 1) {
        const writeSucsess = addNewUser(
          newUserLogin,
          newUserEmail,
          newUserPassword,
          adminStatus
        );
        if (writeSucsess) {
          updateUserLastAccest("users", row.id, (error, result) => {
            if (error) {
              console.error("Произошла ошибка:", error);
            }
          });
          res.status(200).send("good");
        } else {
          console.log("какая-то ошибка при записи в бд");
          res.status(300).send("Ошибка при записи в бд");
        }
      } else {
        console.log("Рядок не знайдено");
        res.status(401).send("Invalid token");
      }
    } else {
      console.log("Рядок не знайдено");
      res.status(401).send("User not found");
    }
  });
});

app.post("/api/deleateUser", (req, res) => {
  const { token, login, loginType, userId } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  }

  searchRow("users", loginType, login, (row) => {
    console.log(loginType);
    console.log(row.cookie);
    if (row) {
      if (token === row.cookie && row.admin == 1) {
        deleteUserById("users", userId, (err, success) => {
          if (err) {
            console.log("Произошла ошибка при удалении пользователя:", err);
            res.status(300).send("error");
          } else if (success) {
            console.log("Пользователь успешно удален.");

            updateUserLastAccest("users", row.id, (error, result) => {
              if (error) {
                console.error("Произошла ошибка:", error);
              }
            });
            res.status(200).send("good");
          } else {
            console.log("Пользователь с таким ID не найден.");
            res.status(300).send("error");
          }
        });
      } else {
        console.log("Рядок не знайдено");
        res.status(401).send("Invalid token");
      }
    } else {
      console.log("Рядок не знайдено");
      res.status(401).send("User not found");
    }
  });
});

app.post("/api/changePasswordByAdmin", (req, res) => {
  const { token, login, loginType, userId, newUserPassword } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  }

  searchRow("users", loginType, login, (row) => {
    if (row) {
      if (token === row.cookie && row.admin == 1) {
        bcrypt.hash(newUserPassword, 10, (err, hash) => {
          if (err) {
            console.error("Ошибка при хешировании:", err);
            return res.status(500).send("Ошибка при хешировании нового пароля");
          }

          changeUserPasswordAndCookie("users", userId, hash, (err, success) => {
            if (err) {
              console.log("Произошла ошибка при изменении данных:", err);
              res.status(300).send("error");
            } else if (success) {
              updateUserLastAccest("users", row.id, (error, result) => {
                if (error) {
                  console.error("Произошла ошибка:", error);
                }
              });
              console.log("Данные пользователя успешно обновлены.");

              res.status(200).send("good");
            } else {
              console.log("Пользователь с таким ID не найден.");

              res.status(300).send("error");
            }
          });
        });
      } else {
        console.log("Рядок не знайдено");
        res.status(401).send("Invalid token");
      }
    } else {
      console.log("Рядок не знайдено");
      res.status(401).send("User not found");
    }
  });
});
app.post("/api/changeLoginByAdmin", (req, res) => {
  const { token, login, loginType, userId, newUserLogin } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  }

  searchRow("users", loginType, login, (row) => {
    console.log(loginType);
    console.log(row.cookie);
    if (row) {
      if (token === row.cookie && row.admin == 1) {
        changeUserLogin("users", userId, newUserLogin, (err, success) => {
          if (err) {
            console.log("Произошла ошибка при изменении данных:", err);
            res.status(300).send("error");
          } else if (success) {
            console.log("Данные пользователя успешно обновлены.");

            updateUserLastAccest("users", row.id, (error, result) => {
              if (error) {
                console.error("Произошла ошибка:", error);
              }
            });
            res.status(200).send("good");
          } else {
            console.log("Пользователь с таким ID не найден.");

            res.status(300).send("error");
          }
        });
      } else {
        console.log("Рядок не знайдено");
        res.status(401).send("Invalid token");
      }
    } else {
      console.log("Рядок не знайдено");
      res.status(401).send("User not found");
    }
  });
});

app.post("/api/getUsers", (req, res) => {
  const { token, login, loginType } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  }

  searchRow("users", loginType, login, (row) => {
    console.log(loginType);
    console.log(row.cookie);
    if (row) {
      if (token === row.cookie && row.admin == 1) {
        getAllUsers("users", (err, users) => {
          if (err) {
            console.log("Сталася помилка:", err);
            return res.status(500).send("Server error");
          } else if (users.length > 0) {
            console.log("Знайдені користувачі:", users);
            const newUsers = [];
            users.forEach((user) => {
              newUsers.push({
                admin: user.admin,
                email: user.email,
                id: user.id,
                lastAsset: user.lastAsset,
                login: user.login,
                logs: JSON.parse(user.logs),
              });
            });
            updateUserLastAccest("users", row.id, (error, result) => {
              if (error) {
                console.error("Произошла ошибка:", error);
              }
            });
            res.status(200).send(newUsers);
          } else {
            console.log("Користувачі не знайдені.");
            res.status(404).send("Users not found");
          }
        });
      } else {
        console.log("Рядок не знайдено");
        res.status(401).send("Invalid token");
      }
    } else {
      console.log("Рядок не знайдено");
      res.status(401).send("User not found");
    }
  });
});

app.post("/api/verifyToken", (req, res) => {
  const { token, login, loginType } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  } else {
    searchRow("users", loginType, login, (row) => {
      console.log(loginType);
      if (row) {
        if (token === row.cookie) {
          console.log(row);
          const ip = req.ip;
          const geo = geoip.lookup(ip);
          updateUserLastAccest("users", row.id, (error, result) => {
            if (error) {
              console.error("Произошла ошибка:", error);
            }
          });
          res.statusCode = 200;
          res.json({ status: row.admin.toString(), email: row.email });
        } else {
          console.log("Рядок не знайдено");
          res.statusCode = 401;
          res.send("don't good");
        }
      } else {
        res.statusCode = 401;
        res.send("don't good");
      }
    });
  }
});
app.post("/api/ChangePassword", (req, res) => {
  const { token, login, loginType, oldPassword, newPassword } = req.body;

  if (token == "undefined") {
    return res.status(401).send("Token is required");
  }

  searchRow("users", loginType, login, (row) => {
    if (!row) {
      return res.status(404).send("User not found");
    }
    if (token !== row.cookie) {
      return res.status(401).send("Invalid token");
    }

    bcrypt.compare(oldPassword, row.password, (err, isMatch) => {
      if (err) {
        console.error("Ошибка при проверке пароля:", err);
        return res.status(500).send("Ошибка при проверке пароля");
      }
      if (!isMatch) {
        return res.status(401).send("Old password does not match");
      }

      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          console.error("Ошибка при хешировании:", err);
          return res.status(500).send("Ошибка при хешировании нового пароля");
        }

        updateField(
          login,
          "password",
          login.includes("@") ? "email" : "login",
          hash,
          (err, result) => {
            if (err) {
              console.error("Помилка оновлення:", err);
              return res.status(500).send("Ошибка при обновлении пароля");
            }
            if (result.changes <= 0) {
              return res.status(404).send("User not found");
            }

            // Пароль успешно обновлён, очистка cookie
            updateField(
              login,
              "cookie",
              login.includes("@") ? "email" : "login",
              "",
              (err, result) => {
                if (err) {
                  console.error("Помилка оновлення cookie:", err);
                  return res.status(500).send("Ошибка при обновлении cookie");
                }
                if (result.changes <= 0) {
                  return res.status(404).send("User not found");
                }

                setTimeout(() => {
                  addToLog("Изменил пароль", row, req, res), 500;
                }, 500);
                // Отправка ответа о успешном изменении пароля
                res.send("password change");
              }
            );
          }
        );
      });
    });
  });
});

app.post("/api/checkPost", (req, res) => {
  const { token, login, loginType, element } = req.body;
  if (token == "undefined") {
    return res.status(401).send("Token is required");
  } else {
    searchRow("users", loginType, login, (row) => {
      if (row && token === row.cookie) {
        let postsObject = JSON.parse(row.posts);
        let receivedUpdated = false;
        const newReceived = postsObject.received.map((e) => {
          console.log("asdasd");
          if (e.id === element.id) {
            // Предполагаем, что у вас есть уникальный идентификатор письма
            receivedUpdated = true;
            return { ...e, viewed: true };
          }
          return e;
        });

        if (receivedUpdated) {
          const updatedPosts = {
            ...postsObject,
            received: newReceived,
          };
          updateField(
            login,
            "posts",
            login.includes("@") ? "email" : "login",
            JSON.stringify(updatedPosts),
            (err, result) => {
              if (err) {
                console.error("Помилка оновлення:", err);
                res.status(500).send("Server error");
              } else if (result.changes > 0) {
                updateUserLastAccest("users", row.id, (error, result) => {
                  if (error) {
                    console.error("Произошла ошибка:", error);
                  }
                });
                res.json(updatedPosts); // Отправляем полный объект posts на фронтенд
              } else {
                console.log("Рядок для оновлення не знайдено.");
                res.status(404).send("User not found");
              }
            }
          );
        } else {
          res.status(404).send("Mail not found");
        }
      } else {
        res.status(401).send("Invalid token or user not found");
      }
    });
  }
});

app.post("/helloworld", (req, res) => {
  res.status(200);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <h1>Hello World</h1>
    </body>
    </html>
  `);
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

              addToLog("Авторизовался", row, req, res);
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
