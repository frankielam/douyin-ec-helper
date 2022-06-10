let TIP = '';
let preObj = {'展示次数': 1};
let preCost = 0;
function updateDate() {
	if (document.location.host.indexOf('compass.') >= 0 && document.location.pathname === '/screen/live/shop') {
		// preCost = $('#root .odometer-value').text();
		// alert($('#root .odometer-value').text());

		var money = $('#root .odometer-value').text();
		chrome.runtime.sendMessage({'sales': money},  function(response) { console.log('update money success'); });
		// alert(preCost);
		setTimeout(function() {
			window.location.reload();
		}, 30 *  1000)
	}

	if (document.location.host.indexOf('qianchuan.') >= 0) {
		let text = $('.update-date').text();
		if (TIP != text) {
			TIP = text
			// alert(TIP)
			genData();
		}
		// alert($('.update-date').text())
	}



	let d = new Date();
	setTimeout(updateDate, (65 - d.getSeconds()) *1000)
	// window.location.reload ()
}

function genData() {
	// class="promotion-container standard-scrollbar"  data-overview

	var data_name = $('.promotion-container .data-overview .data-rows .byted-popover-wrapper .metric-name')
	var data_value = $('.promotion-container .data-overview .data-rows .byted-popover-wrapper .metric-value')
	// alert(data_name.length)
	// alert(data_value.length)
	
	if (data_name.length ==  data_value.length)  {
		let obj =  {}
		// var str = ''
		for (var i = 0; i < data_name.length; i++ ) {
			var k = $(data_name[i]).text().trim().split(' ')[0]
			var v = $(data_value[i]).text().trim().split(' ')[0]

			// str += i + ' ' + $(data_name[i]).text() + '=' + $(data_value[i]).text() + '\n'
			obj[k] = v
		}

		let d = new Date();
		let NOW = d.getFullYear()+'-'+((d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1))+'-'+(d.getDate()<10?'0'+d.getDate():d.getDate())
			+' '+(d.getHours()<10?'0'+d.getHours():d.getHours())+':'+(d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes())+':'+(d.getSeconds()<10?'0'+d.getSeconds():d.getSeconds());
		obj.time = NOW;
		obj.update = '数据更新于' + TIP.split('数据更新于')[1];

		// alert(str);
		// alert(JSON.stringify(obj));
		// let preCost = 0;
		chrome.runtime.sendMessage({'cost': obj}, function(response) {
			preCost = response.sales;
			sendWxMsg(obj);
		});

		
	}
}

function sendWxMsg(obj) {
	if (preObj['展示次数']) {
			obj['名称'] = $('.shop-name').text()
			if (parseInt(obj['展示次数']) >0 || parseInt(obj['展示次数']) - parseInt(preObj['展示次数']) > 5000 
				|| parseInt(obj['新增粉丝数']) - parseInt(preObj['新增粉丝数']) > 10 
				|| obj['平均千次展现费用(元)'] != preObj['平均千次展现费用(元)'])  {
				// var bg = chrome.extension.getBackgroundPage();
				// alert(preCost);
				if (preCost > 0) {
					obj['销售金额'] = preCost;
				}
	
    			chrome.runtime.sendMessage({'wx': true, content: dataFormat(obj)}, function(response) {
					// alert('发送成功' + response);
				});
    			preObj = obj;
			}
	}
}


const data_col = ["消耗(元)", "展示次数", "平均千次展现费用(元)", "点击次数", "点击率", "新增粉丝数", "直播间超过1分钟观看人次", "直播间商品点击次数", "直接成交金额(元)", "间接成交金额", "名称", "update", "销售金额"];
function dataFormat(obj) {
	let str = '';
	data_col.forEach(item => {
		if (obj[item] != undefined) 
			str += item + ' = ' + obj[item] + '\n';
	})
	return str;
}


(function(){
	
	if (document.location.host.indexOf('qianchuan.') >= 0 && document.location.pathname === '/promotion') {
		alert('千川页面后台初始化');
		setTimeout(updateDate, 8000);
	}
	if (document.location.host.indexOf('compass.') >= 0 && document.location.pathname === '/screen/live/shop') {
		// alert('直播数据大屏后台初始化');
		setTimeout(updateDate, 7000);
	}
	// setTimeout(updateDate, 5000);
})();
