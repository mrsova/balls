var express = require('express'),
    expressResponse = require('express-json-response'),
    bodyParser = require('body-parser'),
    user = require('./user'),
    mysql = require('mysql'),
    config = require('./config');

var client = mysql.createPool({
    host     : config.HOST,
    user     : config.USER,
    password : config.PASSWORD,
    database : config.DATABASE
});

var app = express();
app.use(expressResponse());

var server = require('http').Server(app);
var port = process.env.PORT || 3851;

/**
 * Создание application/json Парсера
 */
//var jsonParser = bodyParser.json();

/**
 * Создание application/x-www-form-urlencoded парсера
 */
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * Сообщение в консоль о запуске сервера
 */
server.listen(port, function(){
    console.log("listen port: " + port);
});

/**
 * Обратка пост запроса login
 */
app.post('/login', urlencodedParser, function(request, response){
    user.loginUser(request,response,client);
});

/**
 * Обработка пост запроса register
 */
app.post('/register', urlencodedParser, function(request, response){
    user.registerUser(request,response,client);
});

/**
 * Обработка пост запроса updateacc
 */
app.post('/updateacc', urlencodedParser, function(request, response){
    user.UpdateAccInfoUser(request,response,client);
});

/**
 * Обработка пост запроса updatebonus
 */
app.post('/updatebonus', urlencodedParser, function(request, response){
    user.UpdateBonusInfoUser(request,response,client);
});

/**
 * Обработка пост запроса updatemoney
 */
app.post('/updatemoney', urlencodedParser,function(request, response){
    user.UpdateMoneyInfoUser(request,response,client);
});
