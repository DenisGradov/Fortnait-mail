import telebot
from telebot import types

API_TOKEN = '6357040556:AAFaHh-AfWm3s0mVTQo7nEFnkarIZfoxIfA'

bot = telebot.TeleBot(API_TOKEN)

# Обработчик команды /start
@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = types.InlineKeyboardMarkup()
    web_app = types.WebAppInfo("https://kvantomail.com")  # Укажите URL вашего веб-приложения
    btn = types.InlineKeyboardButton(text="Открыть Kvantomail", web_app=web_app)
    markup.add(btn)
    bot.send_message(message.chat.id, "Привет! Нажми на кнопку ниже, чтобы открыть веб-приложение Kvantomail.", reply_markup=markup)

# Запуск бота
bot.polling()