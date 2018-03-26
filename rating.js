var send = require("./SendResult");

/**
 * Получение статистики
 */
function GetRating(request, response, client){
    if (request.method == 'GET') {
        var deviceid = request.query.deviceid;
        client.getConnection(function (err, connection) {
            if (!err) {
                console.log("Database is connected ");
            } else {
                console.log("Error connecting database ");
                return false;
            }
            // WHERE DeviceID='+connection.escape(deviceid)+'
            connection.query('SET @n = 0')
            connection.query('SELECT id, AccScore, PlayerName, POSITION FROM (SELECT (@n := @n + 1) AS POSITION, id, DeviceID, PlayerName, AccScore FROM users ORDER BY AccScore DESC) as tt WHERE tt.DeviceID='+connection.escape(deviceid), function (error, result, fields) {
                if (error) throw error;
                if (result.length == 0) {
                    send.SendResult('No user in database', 'RatingTableData', '', response);
                    return false;
                }

                connection.query('SET @n = 0')
                connection.query('SELECT (@n := @n + 1) AS POSITION, id, AccScore, PlayerName FROM users ORDER BY AccScore DESC  LIMIT 10', function (errr, res, fields) {
                    connection.release();
                    var users = []
                    users.push(
                        {
                            'ID':result[0].id,
                            'Position':result[0].POSITION,
                            'Name':result[0].PlayerName,
                            'Score':result[0].AccScore
                        });
                    for(key in res){
                        users.push(
                            {
                                'ID':res[key].id,
                                'Position':res[key].POSITION,
                                'Name':res[key].PlayerName,
                                'Score':res[key].AccScore
                            });
                    }

                    return send.SendResult('Info Rating', 'RatingTable', users, response);

                });

            });

        });
    }
}

/**
 * Экспорт функций
 * @type {loginUser}
 */
module.exports.GetRating = GetRating;