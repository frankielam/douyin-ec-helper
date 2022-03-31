const STATUS_LIST = ['待支付', '备货中', '已发货', '已完成', '已关闭']

function addListener() {
    chrome.runtime.onMessage.addListener(function(result, sender, sendResponse) {
        if (result.name == 'popup') {
            var response = copy()
            sendResponse(response)
        } else if (result.name == 'view') {
            viewData()
        } else
            sendResponse({ 'hello': 'there' })
    });
}

function copy() {

    var tableList = $('.mortise-rich-table-row')

    var list = []
    var f = true
    for (var i = 0; i < tableList.length; i++) {
        var obj = {};

        var orderId = $("div[class^='index_content_']", $(tableList[i]));
        obj.orderId = $(orderId).text().replace('订单编号', '').trim();

        var orderTime = $("span[class^='index_text__'][data-foobar='true']", $(tableList[i]));
        obj.orderTime = $(orderTime).text().replace('下单时间', '').trim();

        //style_linkName
        var productName = $("div[class^='style_name']", $(tableList[i]));
        // if (f) alert($(productName).html());
        obj.productName = $(productName).text();
        var productProperty = $("div[class^='style_property']", $(tableList[i]));
        obj.productProperty = $(productProperty[0]).text();


        var comboAmount = $("div[class^='table_comboAmount_']", $(tableList[i]));
        obj.comboAmount = $(comboAmount).text();
        var comboNum = $("div[class^='table_comboNum_']", $(tableList[i]));
        obj.comboNum = $(comboNum).text();
        var payAmount = $("div[class^='index_payAmount_']", $(tableList[i]));
        obj.payAmount = $(payAmount).text();

        var nickname = $("a[class^='table_nickname_']", $(tableList[i]));
        obj.nickname = $(nickname).text();

        var contacts = $("div[class^='index_infoItem_']", $(tableList[i]));
        obj.name = $(contacts[0]).text();
        obj.cell = $(contacts[1]).text();
        obj.address = $(contacts[2]).text();

        var status = $("div[class^='index_cell_']", $(tableList[i]));
        // if (f) alert(status.length);
        var statusMatch = false
        for (var idx = 0; idx < status.length; idx++) {
            for (var j = 0; j < STATUS_LIST.length; j++) {
                if ($(status[idx]).text().startsWith(STATUS_LIST[j])) {
                    obj.status = STATUS_LIST[j]
                    statusMatch = true
                    break;
                }
            }
            if (statusMatch)
                break
        }

        f = false;
        list.push(obj)
    }
    return list
}


function tabName() {
    return document.location.host + '/' + document.location.pathname
}

var dataList = [];
var idx = 0;
function viewData() {
    // data-kora="查看敏感信息"
    dataList = $('a[data-kora="查看敏感信息"]');
    // alert($(dataList).length);
    simulateClick();
}

function simulateClick() {
    if (dataList.length <= idx) return false;
    var obj = dataList[idx];
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var canceled = !obj.dispatchEvent(evt);

    var t = idx++ * 100 + 3000;
    setTimeout(simulateClick, t);
}

(function() {
    if (document.location.pathname === '/ffa/morder/order/list') {
        addListener()
        // setTimeout(viewData, 5 * 1000)
    }
})();
