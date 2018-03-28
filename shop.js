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
                for (key in result) {
                    price += '"' + result[key].BonusID + '":"' + result[key].Price + '",';
                }
                price = price.substring(0, price.length - 1);
                price += "}";

                var res = {
                    "PriceData": JSON.parse(price)
                }
                connection.release();
                return send.SendResult('PriceList', 'PriceList', res, response);

            });

        });

    }
}

/**
 * Покупка бонусов
 * @param request
 * @param response
 * @param client
 * @returns {*}
 * @constructor
 */
function Buy(request, response, client) {
    if (request.method == 'POST') {
        if (!request.body.DeviceID || (request.body.Count == 0) || !request) {
            send.SendResult('[ERROR]: Empty request', 'Fail', '', response);
            return false;
        }
        var DeviceID = request.body.DeviceID.toString();
        var Count = request.body.Count.toString();
        var ItemID = request.body.ItemID.toString();

        client.getConnection(function (err, connection) {
            if (!err) {
                console.log("Database is connected ");
            } else {
                console.log("Error connecting database ");
                return false;
            }
            connection.query('SELECT * FROM users WHERE DeviceID="' + DeviceID + '"', function (error, result, fields) {
                if (result.length == 0) {
                    send.SendResult('No user in database', 'BuyFail', '', response);
                    return false;
                }
                BonusData = JSON.parse(result[0].BonusData);
                AccMoney = result[0].AccMoney;

                connection.query('SELECT Price FROM price WHERE BonusID="' + ItemID + '"', function (errr, res, field) {
                    if (res.length == 0) {
                        send.SendResult('No bonus in database', 'BuyFail', '', response);
                        return false;
                    }
                    price = res[0].Price;
                    if (price > AccMoney) {
                        return send.SendResult('txtMoneyNotEnough', 'BuyFail', '', response);
                        return false
                    }
                    AccMoney = AccMoney - (price * Count);
                    var i=0;
                    for (key in BonusData) {
                        if (i == ItemID) {
                            BonusData[key] = Number(BonusData[key]) + Number(Count);
                        }
                        i++;
                    }


                    var result ={
                        "BonusData":BonusData,
                        "CurrentMoney":AccMoney,
                    }
                    BonusData = JSON.stringify(BonusData);
                    connection.query("UPDATE users SET AccMoney = '" + AccMoney + "', BonusData= '" + BonusData + "' WHERE DeviceID='" + DeviceID + "'", function (e, r, f) {
                        connection.release();
                        return send.SendResult('Success Buy', 'BuyDone', result, response);
                    });
                });
            });
        });
    }

}
/**
 * Экспорт функций
 * @type {loginUser}
 */
module.exports.GetPriceList = GetPriceList;
module.exports.Buy = Buy;