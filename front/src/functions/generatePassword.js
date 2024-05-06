function generatePassword() {
  const length = Math.floor(Math.random() * 3) + 6; // Генерируем длину от 6 до 8 символов
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
}
export default generatePassword;
