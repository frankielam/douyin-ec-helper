function test() {
	return 'background'
}
var running_msg = {
	refresh_count: 0,
	send_count: 0,
	cost_count: 0,
	sales_count: 0
}

let wx_app = {
	corpid: 'wwd91a1f6ed9202b',
	agent_id: 1000002,
	agent_secrect: '0ymUObW4JuB_va42C4xxrIlz6o5JYi5cGPFdAfuFZBQ',
	token_url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
	msg: {'touser': '@all', 'msgtype': 'text', 'agentid': 0, 'text': {'content': ''}, 'safe': 0},
	send_url: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=',
}

let token_obj = {};
var json_obj = {};

function sendMsg(content) {
	var msg = wx_app.msg;
	msg.agentid = wx_app.agent_id;
	msg.text.content = content; //'hey';
	$.post(wx_app.send_url + token_obj.token, JSON.stringify(msg), function(data, status){
		// alert("#send 数据: " + JSON.stringify(data) + "\n状态: " + status);
		running_msg.send_count++;
	});
}

function token() {
	var req_time = new Date().getTime();
	$.get(wx_app.token_url, {'corpid': wx_app.corpid, 'corpsecret': wx_app.agent_secrect}, function(data, status){
        // alert("数据: " + JSON.stringify(data) + "\n状态: " + status);
        if (data.errcode === 0) {
        	token_obj.token = data.access_token;
        	token_obj.request_time = req_time;
        	token_obj.expires_in = data.expires_in;
        	token_obj.expires_at = req_time + data.expires_in * 1000;
        	// alert(token_obj.token);
        	running_msg.refresh_count++;
        	// sendMsg()
        }
    });
}

function refreshToken() {
	if (token_obj.token) {
		var now = new Date().getTime();
		if (now >= token_obj.expires_at) {
			token_obj = {};
		}
	}
	if (!token_obj.token) {
		// alert(1);
		token();
	}
	setTimeout(refreshToken, 6000);
}

(function(){
	

	chrome.runtime.onMessage.addListener(function(result, sender, sendResponse) {
		if (result.wx) {
			sendMsg(result.content)
			return false
		}

		if (result.sales) {	//
			json_obj.sales = result.sales
			running_msg.sales_count++
		} else if (result.cost) {	// 千川后台
			var sales = json_obj.sales>0?json_obj.sales:0
			json_obj = result
			json_obj.sales = sales
			running_msg.cost_count++
		}
		sendResponse(json_obj)
	});
	alert('后台初始化完成，每 6 秒刷新一次企业微信应用 token');
	// token();
	setTimeout(refreshToken, 3000);
})();
