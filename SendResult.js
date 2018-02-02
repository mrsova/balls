/**
 * Функция отпраялет ответ в игру
 * @param Result
 * @param QueryType
 * @param QueryObject
 * @param response
 * @constructor
 */
function SendResult(Result, QueryType, QueryObject, response)
{
    response.status(200).sendData({
        Result:Result,
        QueryType:QueryType,
        QueryObject:QueryObject
    });
}
module.exports.SendResult = SendResult;
