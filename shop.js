var send = require("./SendResult");

/**
 * Получение статистики
 */
function GetPriceList(request, response, client) {
    if (request.method == 'GET') {
        client.getConnection(function (err, connection) {
            if (!err) {
                console.log("Database is connected ");
            } else {
                console.log("Error connecting database ");
                return false;
            }
            connection.query('SELECT * FROM price', function (error, result, fields) {
                if (error) throw error;
                if (result.length == 0) {
                    send.SendResult('No database', 'PriceList', '', response);
                    return false;
                }
                var price = '{';
                for (key in result){
                    price += '"'+result[key].BonusID+'":"'+result[key].Price+'",';
                }
                price = price.substring(0, price.length - 1);
                price += "}";

                var res = {
                    "PriceData":JSON.parse(price)
                }
                connection.release();
                return send.SendResult('PriceList', 'PriceList', res, response);

            });

        });

    }
}

/**
 * Экспорт функций
 * @type {loginUser}
 */
module.exports.GetPriceList = GetPriceList;