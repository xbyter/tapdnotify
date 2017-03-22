showNotifyUnreadCount();//显示未读消息数量
setInterval(showNotifyUnreadCount, 5000);//定时获取未读消息数量
setInterval(showNotifyMessage, 5000);//显示未读消息通知

//给前台返回消息数据
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message == 'getMessage'){
        getMessage(function (json) {
            sendResponse(json.user + ' - ' + json.date, json.title + "\n" + json.content);
        });
    }
});