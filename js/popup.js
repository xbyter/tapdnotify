//显示近10条通知列表
chrome.runtime.sendMessage('getMessage', function(response){
    getMessage(function (json) {
        showMessage(json);
    });
});

function showMessage(list){
    var table = '<table id="message_tb"><tr><th>日期</th><th>发送人</th><th>内容</th></tr>';
    if (list.length) {
        var unreadCount = getUnreadCount();
        list = list.slice(0, 10);
        for(var i in list){
            var url = list[i].url;
            if (url) {
                var content = '<a target="_blank" href="' + url + '"><b>'+list[i].title + '</b><br>' + list[i].content +'</a>';
            } else {
                var content = '<b>'+list[i].title + '</b><br>' + list[i].content;
            }

            var unreadClass = unreadCount > i ? 'unread' : '';
            table += '<tr class="' + unreadClass + '">';
            table += '<td>'+list[i].date+'</td>';
            table += '<td>'+list[i].user+'</td>';
            table += '<td>' + content + '</td>';
            table += '</tr>';
        }
    }else{
        table += '<tr><td colspan="3" align="center">暂无消息</td></tr>'
    }

    table += '</table>'

    $("#message_div").html(table);
}
