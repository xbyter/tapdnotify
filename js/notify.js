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


$("#id-tapd-toolbar").on('dblclick', function () {
    if ($("#zt_dashboard").length) {
        $("#zt_dashboard").remove();
        return false;
    }
    
    let titleIndex = $("#iteration-list-head [title='标题']").index();
    let descIndex = $("#iteration-list-head [title='迭代摘要']").index();
    let dateList = {};
    $("#iteration-list td").each(function (){
        let index = $(this).index();
        let tdList = $(this).parent().children();
        let value = $.trim($(this).text());
        let title = $.trim(tdList.eq(titleIndex).text());
        let href = $.trim(tdList.eq(titleIndex).find('a').attr('href'));
        let desc = descIndex > -1 ? $.trim(tdList.eq(descIndex).text()) : '';
        let currentTitle = $("#iteration-list-head th").eq(index).attr('title');
        if (/^\d{4}\-\d{2}\-\d{2}/.test(value)) {
            if (! dateList[value]) {
                dateList[value] = [];
            }
            dateList[value].push({
                date: value,
                dateTitle: currentTitle,
                title: title.replace('（当前迭代）',''),
                desc: desc,
                href: href,
            });
        }
    });
    let dateSortList = Object.keys(dateList).sort();
    $("#zt_dashboard").remove();
    $("body").append('<table id="zt_dashboard" style="position: absolute;top: 10%;right: 10px;background: #fff;border: 1px solid #ccc;z-index: 9999;"><tr><th>截止日期</th><th>迭代标题</th><th>摘要</th><th>时间类型</th></tr></table>');
    $("body").append('<style type="text/css">#zt_dashboard td, #zt_dashboard th{padding:5px;border:1px solid #ccc;} #zt_dashboard th {font-weight: bold;}</style>');
    $.each(dateSortList, function(i, date){
        let infoList = dateList[date];
        let rows = infoList.length + 1;
        let html = `<tr><td rowspan="${rows}">${date}</td></tr>`;
        $.each(infoList, function(j, item) {
            html += `<tr><td><a href="${item.href}">${item.title}</a></td><td>${item.desc}</td><td>${item.dateTitle}</td></tr>`;
        });
        $("#zt_dashboard").append(html);
    });
});
