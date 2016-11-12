var request = require("request-promise");
var jsuri = require("jsuri");
var TOKENS = require("./tokens.json");
function fetchCurrentInternationalGold(fetchTimeout){
    var queryOpt = {
        uri : "http://apis.haoservice.com/lifeservice/gold/InternationalGold",
        qs  : {
            key:TOKENS.GOLD_API_TOKEN
        },
        json:true,
        headers:{
            "User-Agent":"JOHN ROBOT"
        }
    }
    request(queryOpt).then(function(data){
        console.log("fetch gold 200");
        if(data.error_code === 0){
            sendGoldPushToDing(data.result[0]);
        }else{
            return Promise.reject(data);
        }
        setTimeout(function(){
            fetchCurrentInternationalGold(fetchTimeout);
        },fetchTimeout)
    }).catch(function(err){
        console.log("fetch gold failed");
        sendGoldPushToDing(err,true);
        setTimeout(function(){
            fetchCurrentInternationalGold(fetchTimeout);
        },10*1000);
    })
}

function sendGoldPushToDing(data,withError){
    var sendDingPushUrl = new jsuri("https://oapi.dingtalk.com/robot/send");
    sendDingPushUrl.addQueryParam("access_token",TOKENS.DING_ROBOT_TOKEN);
    var postOpt = {
        uri: sendDingPushUrl.toString(),
        method:"POST",
        body:{
            msgtype:"text",
            text:{
                content: JSON.stringify(data)
            }
        },
        json:true
    }
    request(postOpt);
}

function entry(){
    var queryTimeout = 40*60*1000;
    fetchCurrentInternationalGold(queryTimeout);
    // sendGoldPushToDing({"Test":"Test"})
}

entry();
