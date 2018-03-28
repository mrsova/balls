var express = require('express'),
    expressResponse = require('express-json-response'),
    bodyParser = require('body-parser'),
    user = require('./user'),
    rating = require('./rating'),
    shop = require('./shop'),
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
var jsonParser = bodyParser.json();

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
app.post('/login', jsonParser, function(request, response){
    user.loginUser(request,response,client);
});

/**
 * Обработка пост запроса register
 */
app.post('/register', jsonParser, function(request, response){
    user.registerUser(request,response,client);
});

/**
 * Обработка пост запроса updateacc
 */
app.post('/updateacc', jsonParser, function(request, response){
    user.UpdateAccInfoUser(request,response,client);
});

/**
 * Обработка пост запроса updatebonus
 */
app.post('/updatebonus', jsonParser, function(request, response){
    user.UpdateBonusInfoUser(request,response,client);
});

/**
 * Обработка пост запроса updatemoney
 */
app.post('/updatemoney', jsonParser,function(request, response){
    user.UpdateMoneyInfoUser(request,response,client);
});

/**
 * Обработка пост запроса rating
 */
app.get('/rating', urlencodedParser,function(request, response){
    rating.GetRating(request,response,client);
});

/**
 * Обработка пост запроса pricelist
 */
app.get('/pricelist', urlencodedParser,function(request, response){
    shop.GetPriceList(request,response,client);
});

/**
 * Обработка пост запроса pricelist
 */
app.post('/buyitem', jsonParser,function(request, response){
    shop.Buy(request,response,client);
});