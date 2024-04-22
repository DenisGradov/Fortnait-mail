const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");

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
          console.log(
            "Отправитель:",
            from.value.map((r) => r.address).join(", ")
          );
          console.log("Получатель:", to.value.map((r) => r.address).join(", "));
          console.log("Тема:", subject);
          console.log("Текстовое содержимое:", text);
          // HTML содержимое, если есть
          console.log("HTML содержимое:", html);
          // Вложения, если есть
          if (attachments) {
            console.log("Количество вложений:", attachments.length);
          }
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
