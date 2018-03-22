BALLS SERVER
=====================

http://localhost:3851

Структура
-------------------

      config.js             Конфиги для соединения с бд
      index.js              Точка входа
      SendResul.js          Функция для отправки ответов
      user.js               Обрабатывает логику пользователя
      
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
Маршруты
------------

### Вход

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
### Регистрация
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
### Обновление информации об аккаунте
~~~
Маршрут на обновление информации о польозвателе
# http://localhost:3851/updateacc  метод POST
# Передается JSON  обязательные параметры
{
  "DeviceID": "1234",
  "AccScore": 41,
  "AccMoney": 41,
  "GameProgress": {
    "0": 40,
    "1": 40,
    "2": 40,
    "3": 40,
    "4": 40
  },
  "BonusData": {
    "Turn": 39,
    "KillOneBall": 39,
    "OneRowSpawn": 39,
    "KillBallsType": 39
  }
}
~~~
~~~
# При успехе возвращается JSON
{
    "Result": "Update Acc Successful!",
    "QueryType": "UpdateAccInfo",
    "QueryObject": ""
}
~~~
### Обновление информации о бонусах
~~~
Маршрут на обновление информации о бонусах польозвателя
# http://localhost:3851/updatebonus  метод POST
# Передается JSON  обязательные параметры
{
  "DeviceID": "1234", 
  "BonusData": {
    "Turn": 39,
    "KillOneBall": 39,
    "OneRowSpawn": 39,
    "KillBallsType": 39
  }
}
~~~
~~~
# При успехе возвращается JSON
{
    "Result": "Update BonusInfo Successful!",
    "QueryType": "UpdateBonusInfo",
    "QueryObject": ""
}
~~~
### Обновление информации о счете пользователя
~~~
Маршрут на обновление информации о счете польозвателя
# http://localhost:3851/updatemoney  метод POST
# Передается JSON  обязательные параметры
{
  "DeviceID": "1234", 
  "AccMoney": 41
}
~~~
~~~
# При успехе возвращается JSON
{
    "Result": "Update MoneyInfo Successful!",
    "QueryType": "UpdateMoneyInfo",
    "QueryObject": ""
}
~~~

### Получение топ 10 пользователей
~~~
Маршрут на получение топ 10 пользователей
# http://185.228.232.205:3851/rating?deviceid=8e5293557ed58237e945357f3ba8c061b6e41def метод GET
~~~
# При успехе возвращается JSON
~~~
{
	"Result": "Info Rating",
	"QueryType": "RatingTableData",
	"QueryObject": {
		"RatingTableData": [
		  {
			"ID": 2,
			"Position": 1,
			"Name": "EvilDevil",
			"Score": 230130000
		  },
		  {
			"ID": 2,
			"Position": 1,
			"Name": "EvilDevil",
			"Score": 230130000
		  },
		  {
			"ID": 4,
			"Position": 2,
			"Name": "Test",
			"Score": 4634000
			},
		  {
			"ID": 3,
			"Position": 3,
			"Name": "Hate",
			"Score": 65360
		  },
		  {
			"ID": 5,
			"Position": 4,
			"Name": "serov",
			"Score": 22760
		  }
		],
	}
}
~~~
