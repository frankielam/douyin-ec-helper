let info = {}
const HEADERS = [
    'orderId',
    'orderTime',
    'productName',
    'productProperty',
    'comboAmount',
    'comboNum',
    'payAmount',
    'nickname',
    'name',
    'cell',
    'address',
    'status'
];
const HEADER_MAP = {
    'orderId': '订单编号',
    'orderTime': '下单时间',
    'productName': '商品名称',
    'productProperty': '商品规格',
    'comboAmount': '单价',
    'comboNum': '数量',
    'payAmount': '支付金额',
    'nickname': '抖音昵称',
    'name': '收件人姓名',
    'cell': '收件人电话',
    'address': '收件人地址',
    'status': '订单状态'
};

function callback(msg) {
    $('#copyit').show();
    $('#exportcsv').show();
    var html = '<table id="order" class="table table-bordered">';
    for (var i = 0; i < msg.length; i++) {
        if (i == 0) {
            html += '<tr>' + genHeader() + '</tr>';
        }
        html += '<tr>' + formatter(msg[i]) + '</tr>';
    }
    html += '</table>';
    $('#data').html(html);

    // $('#tips').html('<div>' + JSON.stringify(msg) + '</div>');
    fillTextArea(msg);
    statis(msg);
}
function statis(msg) {
    info.total = msg.length;
    info.mosaic = 0
    for (var i = 0; i < msg.length; i++) {
        var obj = msg[i];
        if (info[obj.status] == null) {
            info[obj.status] = 1;
        } else {
            info[obj.status]++;
        }
        if (obj.name.endsWith('*')) {
            info.mosaic++
        }
    }
}

function genHeader() {
    var html = '';
    for (var idx in HEADERS) {
        html += '<th>' + HEADER_MAP[HEADERS[idx]] + '</th>';
    }
    return html;
}

function formatter(obj) {
    return '<td>' + obj.orderId + '</td>'
        + '<td>' + obj.orderTime + '</td>'
        + '<td>' + obj.productName + '</td>'
        + '<td>' + obj.productProperty + '</td>'
        + '<td>' + obj.comboAmount + '</td>'
        + '<td>' + obj.comboNum + '</td>'
        + '<td>' + obj.payAmount + '</td>'
        + '<td>' + obj.nickname + '</td>'
        + '<td>' + obj.name + '</td>'
        + '<td>' + obj.cell + '</td>'
        + '<td>' + obj.address + '</td>'
        + '<td>' + obj.status + '</td>'
}

function fillTextArea(msg) {
    $('#text').text('');
    var text = '';
    for (var i = 0; i < HEADERS.length; i++) {
        text += HEADER_MAP[HEADERS[i]];
        if (i != HEADERS.length - 1) {
            text += '\t';
        }
    }
    $('#text').append(text + '\n');

    for (var i = 0; i < msg.length; i++) {
        var obj = msg[i];
        var text = obj.orderId + '\t'
            + obj.orderTime + '\t'
            + obj.productName + '\t'
            + obj.productProperty + '\t'
            + obj.comboAmount + '\t'
            + obj.comboNum + '\t'
            + obj.payAmount + '\t'
            + obj.nickname + '\t'
            + obj.name + '\t'
            + obj.cell + '\t'
            + obj.address + '\t'
            + obj.status + '\n';
        $('#text').append(text);
    }
}

(function() {
    info = {};

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // alert(JSON.stringify(tabs))
        if (tabs[0].url.startsWith('https://fxg.jinritemai.com/ffa/morder/order/list')) {
            chrome.tabs.sendMessage(tabs[0].id, { 'name': 'popup' }, function(response) {
                if (callback) callback(response);
            });
        } else {
            $('#tips').html('仅支持在抖店订单管理页面查看。' + '打开 <a target="_blank" href="https://fxg.jinritemai.com/ffa/morder/order/list">订单管理</a>')
            $('#tips').append()
        }
    });

    $('#decode').click(function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 'name': 'view' }, function(response) {
                // alert('');
            });

        });
    });
    if (info.mosaic == 0) {
        $('#decode').hide()
    }

    $('#copyit').click(function() {

        if ($('#text').text().trim().length === 0) {
            alert('没有数据');
            return;
        }
        // $('#text').text($('#tips').text());
        $('#text').show();
        $('#text').select();
        document.execCommand('copy');
        $('#tips').html('复制 ' + info.total + ' 条记录成功 <br>')
        $('#tips').append(JSON.stringify(info).replace('mosaic', '姓名隐藏订单数数'));
        $('#text').hide();
    })

    exportBinding()

})();