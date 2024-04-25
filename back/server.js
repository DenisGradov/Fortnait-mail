const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");

const searchRow = require("./dataBase/functions/searchRow");

function updatePosts(
  sender,
  recipient,
  subject,
  text,
  html,
  emailData,
  post,
  row
) {
  const newMail = { sender, recipient, subject, text, html, emailData };
  console.log(post);
  console.log(row);
  console.log(row.posts);
  post.received.push(newMail);
  updateField(recipient, "posts", "email", post, (err, result) => {
    if (err) {
      // Обробка помилки
      console.error("Помилка оновлення:", err);
    } else if (result.changes > 0) {
      // Оновлення пройшло успішно
      console.log("В бд добавлено письмо:", result);
    } else {
      // Рядок для оновлення не знайдено
      console.log("Рядок для оновлення не знайдено.");
    }
  });
}

const server = new SMTPServer({
  disabledCommands: ["AUTH"],
  onData(stream, session, callback) {
    let emailData = "";
    stream.on("data", (chunk) => {
      emailData += chunk.toString();
    });

    stream.on("end", () => {
      simpleParser(emailData, (err, parsed) => {
        if (err) {
          console.error(err);
        } else {
          // Получаем данные из разобранного сообщения
          const { from, to, subject, text, html, attachments } = parsed;
          const sender = from.value.map((r) => r.address).join(", ");
          const recipient = to.value.map((r) => r.address).join(", ");
          const post = {};
          //subject + text + html + attachments

          searchRow("users", "email", recipient, (row) => {
            if (row) {
              post = JSON.parse(row.posts);
              return updatePosts(
                sender,
                recipient,
                subject,
                text,
                html,
                emailData,
                post,
                row
              );
            } else {
              recipient = "admin@likemail.ru";
              searchRow("users", "email", recipient, (row) => {
                if (row) {
                  post = JSON.parse(row.posts);
                  updatePosts(
                    sender,
                    recipient,
                    subject,
                    text,
                    html,
                    emailData,
                    post,
                    row
                  );
                }
              });
            }
          });
        }
      });
      callback();
    });
  },
});

server.listen(25, "0.0.0.0", () => {
  console.log("SMTP server listening on port 25");
});

server.on("error", (err) => {
  console.error("Failed to start server", err);
});
