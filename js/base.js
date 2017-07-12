//获取未读消息数量
function getUnreadCount() {
    var userId = getUserId();
    var count = 0;
    if (userId) {
        $.ajax({
            async : false,
            url : 'https://www.tapd.cn//fastapp/tcloud/get_user_notify_count.php?user_id=' + userId + '&first_load=1',
            success : function (data) {
                count = data
            }
        });
    }

    return parseInt(count) || 0;
}

function getUserId() {
    var userId = sessionStorage.getItem('user_id') || '';
    if (userId == '') {
        $.ajax({
            async : false,
            url : 'https://www.tapd.cn/my_worktable',
            success : function (data) {
                var reg = new RegExp(/var user_id = '([\d]+)'/);
                var result = reg.exec(data);
                if (result) {
                    userId = result[1];
                } else {
                    var src = $(data).find(".avatar-container.avatar-nav img").attr('src');
                    var index = src.indexOf('avatar/');
                    var lastIndex = src.indexOf('?');
                    userId = src.substring(index + 'avatar/'.length, lastIndex);
                }
            }
        });
        userId && sessionStorage.setItem('user_id', userId);
    }
    console.log(userId);
    return userId;
}

//获取未读消息
function getUnreadMessage(callback) {
    var unreadCount = getUnreadCount();
    if (unreadCount > 0) {
        getMessage(function (data) {
            if(data.length) {
                data = data.slice(0, unreadCount);
                if (typeof callback == 'function') {
                    callback.call($(this), data);
                }
            }
        });
    }
}

//获取所有消息
function getMessage(callback) {
    $.get('https://www.tapd.cn/letters/?from=top_nav_worktable_v2', function (data) {
        var bodyObj = $(data);
        var json = [];
        bodyObj.find('.letter-list .letter').each(function () {
            var user = $(this).find('.user span').text();
            var title = $(this).find('.info .title').text();
            var date = $(this).find('.date p').text();
            var content = $(this).find('.info   p:last a').text();
            var url = $(this).find('.info   p:last a').attr('href');
            json.push({
                user : user,
                date : date,
                title : title,
                content : content,
                url : url
            });
        });
        if (typeof callback == 'function') {
            callback.call($(this), json);
        }
    });
}

function getStorage(key) {
    return sessionStorage.getItem(key);
}

function setStorage(key, value) {
    return sessionStorage.setItem(key, value);
}

function removeStorage(keys) {
    return sessionStorage.removeItem(keys);
}


function clearStorage() {
    return sessionStorage.clear();
}

//显示消息通知
function showNotifyMessage() {
    var notifyType = getStorage('notify_type');
    if (notifyType == 'simple') {
        var count = getUnreadCount();
        if (count > 0) {
            var userId = getUserId();
            var key = 'show_unread_notify:' + userId + ':' + count;
            var keyCount = key + ':count';
            var storage = parseInt(getStorage(key));
            var storageCount = parseInt(getStorage(keyCount)) || 0;
            var time = new Date().getTime();
            if (!storage || (storage + 60 * 2 * (1 + storageCount) * 1000 < time && storageCount < 3)) {//每2分钟显示一次
                setStorage(key, time);
                setStorage(keyCount, ++storageCount);
                showNotify('您有' + count + '条通知未读', '点击跳转去通知页', 'https://www.tapd.cn/letters');
            }
        }
    } else {
        getUnreadMessage(function (data) {
            $.each(data, function (i, item) {
                var key = item.user + ':' + item.date + ':' + item.title;
                var keyCount = key + ':count';
                var storage = parseInt(getStorage(key));
                var storageCount = parseInt(getStorage(keyCount)) || 0;
                var time = new Date().getTime();
                if (!storage || (storage + 60 * 5 * (1 + storageCount) * 1000 < time && storageCount < 3)) {//未读并且每5分钟显示一次, 提示不超过3次
                    setStorage(key, time);
                    setStorage(keyCount, ++storageCount);
                    showNotify(item.user + ' - ' + item.date, item.title + "\n" + item.content, item.url);
                }
            });
        });
    }

}

//显示未读消息通知
function showNotifyUnreadCount() {
    var count = getUnreadCount();
    chrome.browserAction.setBadgeText({text: count + ''})
}

//显示通知
function showNotify(title, content, link) {
    var options = {
        dir: "rtl",
        lang: "zh-CN",
        body: content,
        icon: "images/icon-message.png"
        // tag:"msgId",
    };
    var notification = new Notification(title, options);
    notification.onclick = function () {
        var notifyType = getStorage('notify_type');
        if (notifyType == 'simple') {
            //重置通知数目提示
            clearStorage();
            setStorage('notify_type', notifyType);
        }

        if (link) {
            window.open(link);
        }
    };
}

