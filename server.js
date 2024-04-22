const { SMTPServer } = require("smtp-server");

const server = new SMTPServer({
  // Відключення автентифікації для базового тесту
  disabledCommands: ["AUTH"],

  // Коли лист надіслано до сервера
  onData(stream, session, callback) {
    // Тут може бути логіка для обробки повідомлення
    stream.on("data", (chunk) => {
      console.log(chunk.toString()); // Для прикладу, просто виводимо в консоль
    });

    stream.on("end", callback);
  },
});

// Слухаємо порт 587 замість порту 25
server.listen(25, "127.0.0.1", () => {
  console.log("SMTP server listening on port 25");
});
server.on("error", (err) => {
  console.error("Failed to start server", err);
});
