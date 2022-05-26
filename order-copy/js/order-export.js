function saveCsv(fileName, csvData) {
    var bw = browser();
    if(!bw['edge'] || !bw['ie']) {
      var aLink = document.createElement("a");
      aLink.id = "csvDownloadLink";
      aLink.href = getDownloadUrl(csvData);
      document.body.appendChild(aLink);
      var linkDom = document.getElementById('csvDownloadLink');
      linkDom.setAttribute('download', fileName);
      linkDom.click();
      document.body.removeChild(linkDom);
    }
 }
  
function getDownloadUrl(csvData) {
    var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
    return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
}

function browser() {
    var sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.indexOf('edge') !== - 1 ? sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1]:
        (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
    return sys;
}

function exportBinding() {
	$('#exportcsv').click(function() {
		if ($('#text').text().trim().length === 0) {
            alert('没有数据');
            return;
        }
        // $('#text').text($('#tips').text());
        $('#text').show();
        // $('#text').select();
        // document.execCommand('copy');
        // $('#tips').html('复制 ' + info.total + ' 条记录成功 <br>')
        // $('#tips').append(JSON.stringify(info).replace('mosaic', '姓名隐藏订单数数'));
        // $('#text').hide();

		let title = '公司名,企业代码,纳税人识别号,地址,法定代表人,法定代表人电话,技术负责人,技术负责人电话,对接人,对接人电话,资质等级,跟进人,备注,证书编号'
  		saveCsv('订单数据-' + (new Date().getTime()) + '.csv', $('#text').text())
	});
	
}