var send = require("./SendResult");

/**
 * Форматирует дату в нужный формат
 * @param date
 * @returns {string}
 */
function formatDate(date) {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    var hh = date.getHours();
    var min = date.getMinutes();
    var ss = date.getSeconds();

    return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
}

/**
 * Авторизует пользователя в игре
 * @param request
 * @param response
 * @param client
 * @returns {boolean}
 */
function loginUser(request, response, client) {
    if (request.method == 'POST')
    {
        if (!request.body.DeviceID || !request)
        {
            send.SendResult('[ERROR]: Empty request', 'login', '', response);
            return false;
        }

        var DeviceID = request.body.DeviceID.toString();
        var date = new Date();
        var LastLoginDate = formatDate(date);

        if (DeviceID == "") {
            send.SendResult('[ERROR]: Empty DeviceID parameter!', 'login', '', response);
            return false;
        }
        else {
            client.getConnection(function (err, connection) {
                if (!err) {
                    console.log("Database is connected ");
                } else {
                    console.log("Error connecting database ");
                    return false;
                }
                connection.query('SELECT * FROM users WHERE DeviceID="' + DeviceID + '"', function (error, result, fields) {
                    if (result.length == 0) {
                        send.SendResult('Enter player name', 'CreateAccount', '', response);
                        return false;
                    }
                    else {
                        var QueryObject =
                            {
                                PlayerName: result[0].PlayerName,
                                AccScore: result[0].AccScore,
                                BonusData: JSON.parse(result[0].BonusData),
                                AccMoney: result[0].AccMoney,
                                GameProgress: JSON.parse(result[0].GameProgress)
                            };
                        connection.query('UPDATE users SET LastLoginDate = "' + LastLoginDate + '" WHERE DeviceID="' + DeviceID + '"', function (errr, result, fields) {
                            connection.release();
                            return send.SendResult('Login Successful!', 'login', QueryObject, response);
                        });
                    }
                });
            });
        }
    }
}

/**
 * Регистрация пользователя
 * @param request
 * @param response
 * @param client
 */
function registerUser(request, response, client) {
    if (request.method == 'POST') {
        if (!request.body.PlayerName || !request.body.DeviceID || !request)
        {
            send.SendResult('[ERROR]: Empty request', 'CreateAccount', '', response);
            return false;
        }

        var DeviceID = request.body.DeviceID.toString();
        var PlayerName = request.body.PlayerName.toString();

        if (DeviceID == "") {
            send.SendResult('[ERROR]: Empty DeviceID parameter!', 'CreateAccount', '', response);
            return false;
        }
        if (PlayerName == "") {
            send.SendResult('[ERROR]: Empty PlayerName parameter!', 'CreateAccount', '', response);
            return false;
        }
        client.getConnection(function (err, connection) {
            connection.query('SELECT * FROM users WHERE PlayerName="' + PlayerName + '"', function (error, result, fields) {
                if (result.length != 0) {
                    send.SendResult('[WARNING]: Player name already contains!', 'CreateAccount', '', response);
                    return false;
                }
                else {
                    var date = new Date();
                    var LastLoginDate = formatDate(date);
                    var RegDate = formatDate(date);
                    var AccScore = 0;
                    var AccMoney = 0;
                    var BonusData = JSON.stringify(
                        {
                            "OneRowSpawn": 0,
                            "Turn": 0,
                            "KillOneBall": 0,
                            "KillBallsType": 0
                        });
                    var GameProgress = JSON.stringify(
                        {
                            "0": 0,
                            "1": 0,
                            "2": 0,
                            "3": 0,
                            "4": 0
                        });
                    var AccData =
                        {
                            "PlayerName": PlayerName,
                            "AccScore": AccScore,
                            "BonusData": JSON.parse(BonusData),
                            "AccMoney": AccMoney,
                            "GameProgress": JSON.parse(GameProgress)
                        };
                    connection.query("INSERT INTO users (PlayerName,DeviceID,RegDate,LastLoginDate,AccScore,BonusData,AccMoney,GameProgress)" +
                        " VALUES('" + PlayerName + "','" + DeviceID + "','" + RegDate + "','" + LastLoginDate + "','" + AccScore + "','" + BonusData + "','" + AccMoney + "','" + GameProgress + "')",
                        function (errr, result, fields) {
                            connection.release();
                            return send.SendResult('[INFO]: New Device saved!', 'login', AccData, response);
                        });
                }
            });
        });
    }
}

/**
 * Экспорт функций
 * @type {loginUser}
 */
module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;