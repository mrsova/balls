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
    if (request.method == 'POST') {		
        if (!request.body.DeviceID || !request) {
            send.SendResult('[ERROR]: Empty request', 'login', '', response);
            return false;
        }
		
        var DeviceID = request.body.DeviceID.toString();
        var date = new Date();
        var LastLoginDate = formatDate(date);
		
			
        if (DeviceID == "") {
            send.SendResult('[ERROR]: Empty DeviceID parameter!', 'Login', '', response);
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
        if (!request.body.PlayerName || !request.body.DeviceID || !request) {
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
			if (err) throw err;
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
 * Обновление информации аккаунта пользователя
 * @param request
 * @param response
 * @param client *
 */
function UpdateAccInfoUser(request, response, client) {
    if (request.method == 'POST') {
        if (!request.body.DeviceID || !request) {
            send.SendResult('[ERROR]: Empty request', 'UpdateAccInfo', '', response);
            return false;
        }
        var DeviceID = request.body.DeviceID.toString();
        var AccScore = request.body.AccScore.toString();
        var AccMoney = request.body.AccMoney.toString();
        var GameProgress = request.body.GameProgress;
        var BonusData = request.body.BonusData;
				
		if((AccScore == 0) && (AccMoney == 0) && (Object.keys(GameProgress).length == 2) && (Object.keys(BonusData).length == 2)){
			return false;
		}
		var sqlold = "UPDATE users SET AccScore = AccScore + '" + AccScore + "', AccMoney = AccMoney + '" + AccMoney + "', GameProgress = '" + GameProgress + "', BonusData = '" + BonusData + "'  WHERE DeviceID='" + DeviceID + "'"
		var sql = "UPDATE users SET";
		
		if(AccScore != 0){		
			var acccore = " AccScore = AccScore + '" + AccScore + "'";
			sql += acccore;
		}
		if(AccMoney != 0){
			if(bonusdata || gameprocess || acccore){sql += ",";}
			var accmoney = " AccMoney = AccMoney + '" + AccMoney + "'";
			sql += accmoney;
		}
		if(Object.keys(GameProgress).length > 2){
			if( bonusdata || accmoney || acccore){sql += ",";}
			var gameprocess = " GameProgress = '" + GameProgress + "'";
			sql += gameprocess;
		}
		if(Object.keys(BonusData).length > 2){
			if(gameprocess || accmoney || acccore){sql += ",";}
			var bonusdata = " BonusData = '" + BonusData + "'";
			sql += bonusdata;
		}	
		
        client.getConnection(function (err, connection) {
            if (!err) {
                console.log("Database is connected ");
            } else {
                console.log("Error connecting database ");
                return false;
            }
            connection.query('SELECT * FROM users WHERE DeviceID="' + DeviceID + '"', function (error, result, fields) {
                if (result.length == 0) {
                    send.SendResult('No user in database', 'UpdateAccInfo', '', response);
                    return false;
                }								
                connection.query(sql +  " WHERE DeviceID='" + DeviceID + "'", function (errr, result, fields) {
                    connection.release();
                    return send.SendResult('Update Acc Successful!', 'UpdateAccInfo', '', response);
                });
            });
        });

    }
}

/**
 * Обновление информации о бонусах
 * @param request
 * @param response
 * @param client *
 */
function UpdateBonusInfoUser(request, response, client) {
    if (request.method == 'POST') {
        if (!request.body.DeviceID || !request) {
            send.SendResult('[ERROR]: Empty request', 'UpdateBonusInfo', '', response);
            return false;
        }
        var DeviceID = request.body.DeviceID.toString();
        var BonusData = request.body.BonusData;

        client.getConnection(function (err, connection) {
            if (!err) {
                console.log("Database is connected ");
            } else {
                console.log("Error connecting database ");
                return false;
            }
            connection.query('SELECT * FROM users WHERE DeviceID="' + DeviceID + '"', function (error, result, fields) {
                if (result.length == 0) {
                    send.SendResult('No user in database', 'UpdateBonusInfo', '', response);
                    return false;
                }
                connection.query("UPDATE users SET BonusData = '" + BonusData + "' WHERE DeviceID='" + DeviceID + "'", function (errr, result, fields) {
                    connection.release();
                    return send.SendResult('Update BonusInfo Successful!', 'UpdateBonusInfo', '', response);
                });
            });
        });

    }
}

/**
 * Обновление информации о деньгах
 * @param request
 * @param response
 * @param client *
 */
function UpdateMoneyInfoUser(request, response, client) {
    if (request.method == 'POST') {
        if (!request.body.DeviceID || !request.body.AccMoney || !request) {
            send.SendResult('[ERROR]: Empty request', 'UpdateMoneyInfo', '', response);
            return false;
        }
        var DeviceID = request.body.DeviceID.toString();
        var AccMoney = request.body.AccMoney.toString();

        client.getConnection(function (err, connection) {
            if (!err) {
                console.log("Database is connected ");
            } else {
                console.log("Error connecting database ");
                return false;
            }
            connection.query('SELECT * FROM users WHERE DeviceID="' + DeviceID + '"', function (error, result, fields) {
                if (result.length == 0) {
                    send.SendResult('No user in database', 'UpdateMoneyInfo', '', response);
                    return false;
                }
                connection.query("UPDATE users SET AccMoney = AccMoney+ '" + AccMoney + "' WHERE DeviceID='" + DeviceID + "'", function (errr, result, fields) {
                    connection.release();
                    return send.SendResult('Update MoneyInfo Successful!', 'UpdateMoneyInfo', '', response);
                });
            });
        });

    }
}

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
		
					var Users = {					
						'RatingTableData':users
					}				
				
                    return send.SendResult('Info Rating', 'RatingTableData', Users, response);					
				
                });				

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
module.exports.UpdateAccInfoUser = UpdateAccInfoUser;
module.exports.UpdateBonusInfoUser = UpdateBonusInfoUser;
module.exports.UpdateMoneyInfoUser = UpdateMoneyInfoUser;
module.exports.GetRating = GetRating;