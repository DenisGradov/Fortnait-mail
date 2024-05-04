#!/bin/bash

# Клонуємо репозиторій
git clone https://github.com/DenisGradov/Fortnait-mail.git
cd Fortnait-mail

# Функція для очищення та встановлення npm залежностей
function clean_and_install() {
  # Видаляємо node_modules і package-lock.json
  rm -rf node_modules package-lock.json

  # Встановлюємо залежності
  npm install
}

# Обробка для папки back
cd back
clean_and_install
cd ..

# Обробка для папки front
cd front
clean_and_install
cd ..

# Перезапускаємо всі pm2 процеси
pm2 restart all

# Виходимо з папки репозиторію
cd ..
