BALLS SERVER
=====================

http://localhost:3851

Структура
-------------------

      config.js             Конфиги для соединения с бд
      index.js              Точка входа
      SendResul.js          Функция для отправки ответов
      user.js               Обрабатывает логику входа и регистрации
      
Рекомендация
------------
Установить nodejs - https://nodejs.org/en/
Установить и запустить mysql server.

Установка
------------

### Установка и запуск

~~~
# Выполнить в папке команду git clone https://github.com/mrsova/balls.git .
# Перейти в папку и выполнить консоле команду
$ npm i - Установка зависимостей
$ node index.js - Запуск сервера
~~~

~~~
# Импортировать базу данных из корня проекта balls.sql
~~~

### Маршруты

~~~
Маршрут на авторизацию польозвателя
# http://localhost:3851/login  метод POST
# Передается JSON обязательные параметры
{
    "DeviceID":"4654"
}
~~~
~~~
# При успешной авторизации возвращается JSON
{
    "Result": "Login Successful!",
    "QueryType": "login",
    "QueryObject": 
    {
        "PlayerName": "132",
        "AccScore": 40,
        "BonusData": 
        {
            "Turn": 30,
            "KillOneBall": 89,
            "OneRowSpawn": 40,
            "KillBallsType": 50
        },
        "AccMoney": 40,
        "GameProgress": 
        {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0
        }
}
~~~

~~~
Маршрут на регистрацию польозвателя
# http://localhost:3851/register  метод POST
# Передается JSON  обязательные параметры
{
    "DeviceID":"12456",
    "PlayerName": "Test"
}
~~~
~~~
# При успехе возвращается JSON
{
    "Result": "[INFO]: New Device saved!",
    "QueryType": "login",
    "QueryObject": 
    {
        "PlayerName": "Test",
        "AccScore": 0,
        "BonusData": {
            "OneRowSpawn": 0,
            "Turn": 0,
            "KillOneBall": 0,
            "KillBallsType": 0
        },
        "AccMoney": 0,
        "GameProgress": {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0
        }
    }
}
~~~