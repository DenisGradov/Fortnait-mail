<a name="начало"></a>

# Сайт для

### Привет, я Денис, и я разработал свой почтовый-сервис. Делался он под конкретный проэкт, поэтому часть функций урезаны (как пример - отправка писем сделана довольна костыльно, т.к. она банально не нужна в данной штуке), а что-то - наоборот, сделано черезмерно

### Прм разработке я использовал реакт и экспресс (а так же разные либы, по типу аксиоса)

### Ты можешь посмотреть [краткий видео-обзор](https://youtu.be/_zzrq352LDU), а можешь почитать этот пост

### Главы

- [Начало](#начало)
- [Авторизация](#Меню_авторизации)
- [Меню юзера](#Меню_юзера)
- [Админка](#Админка)
- [API документация](#Документация_API)
- [Используемые компоненты/функции](#компоненты)

<a name="Меню_авторизации"></a>

## Меню авторизации ([в начало](#начало))

### При запуске сайта - он ищет в бд юзера, куки которого соответствуют с куками юзера, который зашел на сайт. Если такой юзер не найден - мы видем меню авторизации, где необходимо указать свой логин и пароль, а так же решить простую капчу. Данные юзеров хранятся в sqlite бд на сервере (бекенд на ноде), а точнее не сам пароль, а хеш (либа - bcrypt). Если куки юзера найдены - нас отправляет на компонент Mail, а уже он распределяет нас в меню юзера или в меню админа. Капча в авторизации самодельная, так же как и авторизация по кукам (делал без гайдов, немного чатгпт, впервые в жизни)

#### P.s. на сайте намеренно не сделана регестрация юзера. То-есть рандомный чел не может зарегаться, профили для юзеров создаются админом

![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F_2024-05-12_103232313.png?raw=true)

<a name="Профиль"></a>

## Профиль и навигация ([в начало](#начало))

### В профиле сайта мы видем основную информацию: фамилия имя, айди, premissions, а так же ваш капитал. Капитал - сумма балансов всех карт и банок. Если какие-то карты в $, евро - их балансы конвертируются по курсу монобанка в гривны (в данной версии курс статичный, указывается в App.js). Так же, теперь вверху сайта появилось меню с навигацией по сайту

![screen](https://github.com/DenisGradov/React-monobank-api-control/blob/main/git-imgs/изображение_2023-07-21_222217577.png)

<a name="Меню_юзера"></a>

## Меню юзера ([в начало](#начало))

### Если данные юзера верны, а значение ячейки юзера "admin" в бд на беке хранит в себе "0" (не админ) - компонент Mail перекидывает нас на меню юзера. Сверху экрана элементы навигации, снизу - сами сообщения, мы же пойдем по порядку. Кнопка

### "Send mail" - отправка письма. Кликаем по кнопке, заполняем данные и письмо успешно отправляется. Над отправкой писем я просидел дня 3, так и не понял в чем проблема отправки (код выдавал что отправка успешно происходит, но письмо не шло), поэтому в финале я тупо прикрутил сторонний API сервис по отправке писем (т.к. по факту оптравка писем в этом проекте даже не нужна)

### Иконка перезапуска - обновление полученных писем (делается новый запрос на бек за получением писем), но жать кнопку не обязательно, т.к. каждые 15 секунд сайт сам делает этот запрос

### "Search mail" - инпут для поиска конкретных писем по отправителю / теме / тексту и т.д.

### Пагинацию мы можем найти под инпутом. На 1 странице может быть до 50 писем, если по факту их больше - письма делятся на страницы, по которым мы можем бегать при помощи стрелок. Эта идея / стиль была повзаимствована у гмайла

### Электронные письма распологаются в остальной нижней части. Здесь мы видим всю инфу о письме, включая время оптправки (которое прикольно меняется (0m -> 1h> 10may)). Слева письма мы видим иконку корзины, это нужно для удаления письма. После клика по иконке - сайт уточнит, уверены ли мы в желании удалить письмо. Если повторно кликнуть по иконке - письмо удалится. Что бы перейти в само письмо - нам нужно кликнуть по строке с нужным письмом. Фон строчки кстати зависит от того, просматривал ли юзер ранее это письмо или нет. Если смотрел - задний фон более светлый, если же нет - более темный

### Открыв письмо - мы увидим вверху сайта дублирование строки (но время отправки письма уже максимально точно указывается), стрелочку назад (для возвращения в список писем), а так же html файл письма

### Шестеренка справа от инпута - это иконка с настройками юзера, кликнув по которой - мы увидим мокап-меню. Здесь юзер может скопировать свою почту (т.к. вход в почту доступен например по логину - юзер может не помнить адреса почты), а так же изменить свой пароль. Для смены пароля юзеру нужно указать свой нынешний пароль + придумать новый. После смены пароля юзера выкинет на окно авторизации

### Если юзер в бане - ему будет выводить уведомление о бане, а любые функцие перестанут работать

![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202024-05-12%20104211.png?raw=true)
![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202024-05-12%20104556.png?raw=true)
![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202024-05-12%20104338.png?raw=true)
![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F_2024-05-12_104735337.png?raw=true)
![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F_2024-05-12_115441054.png?raw=true)
<br/>
<a name="Админка"></a>

## Админка ([в начало](#начало))

### Если данные юзера верны, а значение ячейки юзера "admin" в бд на беке хранит в себе "1" (админ) - компонент Mail перекидывает нас на админку. Заранее скажу, что при всех запросах к бд от админа - идет проверка, реально ли перед нами админ. В админке мы видем число юзеров, поиск конкретных юзеров. Мы можем добавить нового юзера. В целом тут много фишек, но давайте по порядку:

### Поиск юзеров. Сверху сайта мы видем число юзеров, а под этим числом - элементы пагинации. Тут аналогично письмам, на странице максимум может показываться определенное число юзеров, дальше - нужно будет бегать по страницам клавишами. Кнопка рестарта - запрашивает актуальную инфу у юзерах, и тоже, так же как в письмах - раз в 15 секунд сайт делает это действие сам. Дальше идет поиск юзера, где мы можем найти юзера по почте / логину. Еще ниже - элементы сортировки юзеров: по айди, почте, логину, ласт активности

### Сами юзеры - достаточно интересны сделаны, расскажу подробнее. Сразу мы видим аватарку юзера в цветной обводке. Зеленый - юзер не в бане, красный - в бане. Саму аватарку поменять нельзя, Иисус если это администратор и мультяшный герой если это обычный юзер. Дальше идет сама почта, логин, ласт актив юзера и иконка комментария. Админы могут добавлять комментарии для юзеров, если у юзера комент есть - иконка комментария будет желтоватой, иначе - серой. Левой кнопкой мыши мы можем кликнуть по юзеру, что бы открыть управление тем самым юзером

### Взаимодействие с юзером. Юзера мы можем заблокировать/разблокировать, для этого нам нужно по аналогии с удалением письма юзером кликнуть 3 раза по кнопке. Аналогичная история с удалением юзера. Так же мы можем изменить юзеру пароль на свой / на рандомный (на случай если юзер забудет тот самый пароль), аналогично мы можем изменить юзеру логин. Справа от управления юзером мы видим логи, куда попадает важная инфа: название действия, время, ip, страна. Сюда логируются только важные действия, по типу входа, смены пароля и т.д. Если же зайти так в управление аккаунтом администратора - логи будут теми же, но теперь будет показывтаь еще и действия админа (изменил юзеру пароль, забанил юзера и т.д.). Логи так же делятся на страницы, если не влазят на экран + сами обновляются раз в 15 секунд + можно обновить самому по кнопке. Если зайти так в профиль админа - мы не сможем его удалить / забанить :D

### Заметка о пользователе. Тут все просто, 1 заметка на всех админов, по сути - textarea, куда любой админ может вписать что-то важное

### Добавление пользователя. А это уже интересная штука, в которой мы можем зарегать новых юзеров. Есть 2 режима добавления: детальные настройки, либо в 1 строку. Рассмотрим первый режим. Тут мы указываем домен (да-да, на сайте их может быть несколько), эмаил юзера, логин и пароль (его сгенерировать рандомно можно). Все эти данные проходят валидацию: запрещены длинные слова, русские символы. После простой валидации - идет проверка на занятость (нельзя зарегать юзера с логином/почтой, которые уже существуют). Если данные не ворк - у инпута будет красная обводка (такая же штука была сделана и в окне авторизации кстати). Юзеру можно сделать админом, для этого нужно нажать аж на 3 чекбокса (сделано для того, что бы случайно создать админа было невозможно). Теперь вернемся ко 2 способу, добавления юзера в строку. Так получилось, что у проекта уже была таблица юзеров, и было бы проще копировать из таблицы строку с данными, а после просто вставлять в сайте. Так я и сделал. Логин юзера берется из эмайла (часть эмайла до @ превращается в логин). Валидация тут тоже есть, а вот админку выдать таким способом нельзя

### Просмотр писем юзера. Идея для фичи была взята у сервиса biz.mail.ru (корпоративная почта, в которой можно заходить за своих пользователей, но стоит такая фича 2$ за 1 аккаунт в месяц. Я же такое реализовал по приколу бесплатно). Для просмотра писем - просто кликаем ПРАВОЙ кнопкой мыши по юзеру в списке юзеров, нам покажет все его письма. Функционал кстати будет урезан (если посмотреть письмо юзера - в его бд не изменится состояние просмотренности письма. Мы не можем удалить письмо, не можем отправить от его имени письмо)

![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D1%8E%D0%B7%D0%B5%D1%80%D1%8B.png?raw=true)
![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%8E%D0%B7%D0%B5%D1%80%D0%BE%D0%BC.png?raw=true)
![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%8E%D0%B7%D0%B5%D1%80%D0%B0.png?raw=true)
![screen](https://github.com/DenisGradov/Fortnait-mail/blob/main/git-imgs/%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%20%D0%BF%D0%B8%D1%81%D0%B5%D0%BC%20%D1%8E%D0%B7%D0%B5%D1%80%D0%B0.png?raw=true)

<a name="Документация_API"></a>

## API документация ([в начало](#начало))

### Базовый url указывается в .env в корне сайта, в моем случае это https://backend.kvantomail.com

<details>
  <summary>POST /api/verifyToken</summary>
  <h2>Проверка токена пользователя для аутентификации</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "user_cookie", // Cookie токена пользователя
  "login": "user_login", // Логин пользователя
  "loginType": "user_type_login" // Тип логина пользователя
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "user_admin_status", // Административный статус пользователя (например, "1" для админа)
  "email": "user_email", // Электронная почта пользователя
  "blocked": "user_blocked_status"
}
```

</details>
<details>
  <summary>POST /api/login</summary>
  <h2>Аутентификация пользователя + получение токена</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "login": "user_login_or_email", // Логин или email пользователя
  "password": "user_password" // Пароль пользователя
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "errorData": [false, false], // Массив ошибок, если есть
  "token": "session_token", // Токен для сессии
  "login": "user_login_or_email", // Логин или email пользователя
  "type": "email_or_login" // Тип логина: email или login
}
```
</details>
<details>
  <summary>POST /api/logout</summary>
  <h2>Аутентификация пользователя + получение токена</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "no data needed": "Этот метод не требует данных в теле запроса."
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
<h2>"Вы вышли из системы."</h2>
```
</details>
<details>
  <summary>POST /api/getPosts</summary>
  <h2>Получаем письма юзера</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "user_cookie", // Cookie токена пользователя
  "login": "user_login", // Логин пользователя
  "loginType": "user_type_login", // Тип логина пользователя
  "fromAdmin": false, // Флаг запроса от администратора
  "userId": "target_user_id" // ID целевого пользователя (требуется если fromAdmin = true)
}
```

  <h3><strong>Ответ сервера при успехе:</strong></h3>
  
```json
{
  "posts": [
    {
      "id": "post_id",
      "content": "post_content",
      "timestamp": "post_timestamp"
    },
    // дополнительные посты
  ]
}
```

</details>
<details>
  <summary>POST /api/checkPost</summary>
  <h2>Пометка письма прочитанным</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "user_cookie", // Cookie токена пользователя
  "login": "user_login_or_email", // Логин или email пользователя
  "loginType": "user_login_type", // Тип логина пользователя
  "element": { "id": "post_id" } // Объект с идентификатором поста, который следует пометить как прочитанный
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "posts": [
    {
      "id": "post_id",
      "viewed": true
      // остальные поля поста
    }
    // дополнительные посты
  ]
}
```
</details>
<details>
  <summary>POST /api/deletePost</summary>
  <h2>Удалние письма пользователем</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "user_cookie", // Cookie токена пользователя
  "login": "user_login_or_email", // Логин или email пользователя
  "loginType": "user_login_type", // Тип логина пользователя
  "id": "post_id" // Идентификатор поста для удаления
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "posts": [
    // Обновлённый список постов
  ]
}
```
</details>
<details>
  <summary>POST /api/SendMail</summary>
  <h2>Отправляем письмо другому пользователю</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "user_cookie", // Cookie токена пользователя
  "login": "user_login", // Логин пользователя
  "loginType": "user_type_login", // Тип логина пользователя
  "sendTo": "recipient_login", // Почта получателя письма
  "sendSubject": "subject_text", // Тема письма
  "sendMessage": "message_text" // Текст письма
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "success",
  "message": "Письмо успешно отправлено"
}
```

</details>

<details>
  <summary>POST /api/ChangePassword</summary>
  <h2>Смена юзером пароля</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "user_cookie", // Cookie токена пользователя
  "login": "user_login_or_email", // Логин или email пользователя
  "loginType": "user_login_type", // Тип логина пользователя
  "oldPassword": "old_password", // Текущий пароль
  "newPassword": "new_password" // Новый пароль
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "message": "password change"
}
```
</details>

<details>
  <summary>POST /api/getUsers</summary>
  <h2>Получ аем список юзеров</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "admin_user_cookie", // Cookie токена администратора
  "login": "admin_user_login", // Логин администратора
  "loginType": "admin_user_login_type" // Тип логина администратора
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
[
  {
    "id": "user_id",
    "login": "user_login",
    "email": "user_email",
    "admin": 1,
    "blocked": 0,
    "adminMessage": "message_text",
    "lastAsset": "last_access_date",
    "logs": [
      // Список логов пользователя
    ]
  },
  // Дополнительные пользователи
]
```
</details>
<details>
  <summary>POST /api/AddNewUser</summary>
  <h2>Добавляем нового пользователя</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "admin_user_cookie", // Cookie токена администратора
  "login": "admin_user_login", // Логин администратора
  "loginType": "admin_user_login_type", // Тип логина администратора
  "newUserEmail": "new_user_email", // Email нового пользователя
  "newUserLogin": "new_user_login", // Логин нового пользователя
  "newUserPassword": "new_user_password", // Пароль нового пользователя
  "adminStatus": 0 // Статус администратора для нового пользователя (1 - админ, 0 - не админ)
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "success",
  "message": "good"
}
```
</details>
<details>
  <summary>POST /api/deleteUser</summary>
  <h2>Удаляем юзера</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "admin_user_cookie", // Cookie токена администратора
  "login": "admin_user_login", // Логин администратора
  "loginType": "admin_user_login_type", // Тип логина администратора
  "userId": "target_user_id" // ID пользователя, которого нужно удалить
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "success",
  "message": "good"
}
```
</details>
<details>
  <summary>POST /api/banUser</summary>
  <h2>Баним/разбаниваем юзера</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "admin_user_cookie", // Cookie токена администратора
  "login": "admin_user_login", // Логин администратора
  "loginType": "admin_user_login_type", // Тип логина администратора
  "userId": "target_user_id", // ID пользователя, статус которого нужно изменить
  "blockedStatus": 1 // Новый статус блокировки (1 - заблокирован, 0 - разблокирован)
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "success",
  "message": "good"
}
```
</details>
<details>
  <summary>POST /api/changePasswordByAdmin</summary>
  <h2>Меняем юзеру пароль</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "admin_user_cookie", // Cookie токена администратора
  "login": "admin_user_login", // Логин администратора
  "loginType": "admin_user_login_type", // Тип логина администратора
  "userId": "target_user_id", // ID пользователя, чей пароль необходимо изменить
  "newUserPassword": "new_password" // Новый пароль пользователя
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "success",
  "message": "good"
}
```
</details>
<details>
  <summary>POST /api/changeLoginByAdmin</summary>
  <h2>Меняем юзеру логин</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "admin_user_cookie", // Cookie токена администратора
  "login": "admin_user_login", // Логин администратора
  "loginType": "admin_user_login_type", // Тип логина администратора
  "userId": "target_user_id", // ID пользователя, чей логин необходимо изменить
  "newUserLogin": "new_user_login" // Новый логин пользователя
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "success",
  "message": "good"
}
```
</details>
<details>
  <summary>POST /api/changeAdminMessage</summary>
  <h2>Меняем юзеру админ-сообщение</h2>

  <h3><strong>Тело запроса:</strong></h3>

```json
{
  "token": "admin_user_cookie", // Cookie токена администратора
  "login": "admin_user_login", // Логин администратора
  "loginType": "admin_user_login_type", // Тип логина администратора
  "userId": "target_user_id", // ID пользователя, для которого необходимо изменить административное сообщение
  "adminMessage": "new_admin_message" // Новое административное сообщение
}
```

  <h3><strong>Ответ сервера:</strong></h3>
  
```json
{
  "status": "success",
  "message": "good"
}
```
</details>

###

<a name="компоненты"></a>

## Используемые компоненты ([в начало](#начало))

| Название компонента                          | Значение                                                                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| front/src/App.js                             | Связка всех компонентов                                                                                       |
| front/src/Blocked/Blocked.jsx                | Уведомление о бане                                                                                            |
| front/src/Login/Login.jsx                    | Страница авторизации                                                                                          |
| front/src/Logout/Logout.jsx                  | Страница для логаута (обнуляет куки)                                                                          |
| front/src/Mail/Admin/AdminMenu.jsx           | Админ меню                                                                                                    |
| front/src/Mail/Admin/UserLogs.jsx            | Логи юзера                                                                                                    |
| front/src/Mail/User/User.jsx                 | Юзер меню                                                                                                     |
| front/src/Mail/UserSettings/UserSettings.jsx | Настройки юзера                                                                                               |
| front/src/Mail/Mail.jsx                      | Связывающий компонент, перенаправляет на нужное меню                                                          |
| front/src/NotWorking/NotWorking.jsx          | Временная заглушка, в данный момент не юзается                                                                |
| front/src/SendMail/SendMail.jsx              | Отправка писем                                                                                                |
| front/src/functions/                         | Важные функции: копирование в буфер, форматирование данных, генерация пароля, валидация текста, парсинг писем |
| front/src/hooks/useCookie.jsx                | Юзер-хук для получения данных из куки                                                                         |
| front/src/Transactions.jsx                   | Все транзакции                                                                                                |
| back/dataBase/db.js                          | Генерация базы данных                                                                                         |
| back/functions/                              | Функции для работы с бд (слишком много что бы описывать детально)                                             |
| back/app.js                                  | Сам бекенд                                                                                                    |
| back/server.js                               | SMTP сервер                                                                                                   |
