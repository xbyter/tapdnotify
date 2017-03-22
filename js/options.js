$("[name=notify_type]").on('change', function () {
    setStorage('notify_type', $(this).val());
});

var notifyType = getStorage('notify_type');
if (notifyType == 'simple') {
    $("#show_simple").prop('checked', true);
}else{
    $("#show_detail").prop('checked', true);
}