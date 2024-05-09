const searchRow = require("./searchRow");
const updateField = require("./updateField");
const newMail = {
  id: 523, // Додаємо унікальний ID на основі довжини масиву отриманих повідомлень
  viewed: false, // По замовчуванню, лист не переглянутий
  date: Date.now(), // Текуща дата та час в мілісекундах
  sender: "esxample_sender@gmail.com", // Випадковий відправник
  recipient: "test@kvantomail.com", // Випадковий отримувач
  subject: "Test Subject", // Тема листа
  text: "This is a test email. Hello world!", // Текст листа
  html: "<p>This is a <b>test email</b>. Hello world!</p>", // HTML версія листа
};
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
  post.received.push(newMail);
  console.log(post);

  updateField(
    recipient,
    "posts",
    "email",
    JSON.stringify(post),
    (err, result) => {
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
    }
  );
}

searchRow("users", "email", "test@kvantomail.com", (row) => {
  if (row) {
    console.log(row.posts);
    post = JSON.parse(row.posts);
    return updatePosts(
      newMail.sender,
      newMail.recipient,
      newMail.subject,
      newMail.text,
      newMail.html,
      newMail.emailData,
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
