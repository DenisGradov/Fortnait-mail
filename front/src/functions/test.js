function parseString(input) {
  const regex = /^(\w+)@(\w+\.\w+):(\w+)$/;
  const match = input.match(regex);

  if (match) {
    const login = match[1];
    const domain = match[2];
    const password = match[3];
    const email = `${login}@${domain}`;

    return {
      email: email,
      login: login,
      password: password,
    };
  } else {
    return false;
  }
}

// Примеры использования функции
console.log(parseString("username@example.com:password123")); // Вернет объект с email, login, password
console.log(parseString("not_a_valid_string")); // Вернет false
console.log(parseString("l.jackson312@kvantomail.com:XOAIiia$mu43s")); // Вернет false
