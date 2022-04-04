function info() {
     var bg = chrome.extension.getBackgroundPage()
     $('#tips').html('<div>' + 'Token 刷新次数: ' + bg.running_msg.refresh_count + '</div>');
     $('#tips').append('<div>' + '消耗刷新次数: ' + bg.running_msg.cost_count + '</div>');
     // $('#tips').append('<div>' + '销售额更新次数: ' + bg.running_msg.sales_count + '</div>');
     $('#tips').append('<div>' + '消息发送次数: ' + bg.running_msg.send_count + '</div>');
}

(function(){
	info()
})();
