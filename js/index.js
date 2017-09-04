var code = $('#service_code');
var s_key = $('#secret_key');

var parameters = {
    src: "",
    autoPlay: "true",
    verbose: true,
    controlBarAutoHide: "true",
    controlBarPosition: "bottom",
    poster: "img/poster.png",
    plugin_hls: "swf/wmp_plugin_hls.swf"
};
var v_height = 640;
var v_width = 480;
$(function() {
	getData(1);
	$('#login').click(function() {
		if($(this).text() == '登录') {
			$('#layer').css({
				'visibility': 'visible',
	    		'opacity': 1
			})
		} else if($(this).text() == '退出') {
			window.localStorage.removeItem("service_code");
			window.localStorage.removeItem("secret_key");
			$('.welcome').css({
				'visibility': 'hidden',
    			'opacity': 0
			})
			$('#login').html('登录');
			code.val('');
			s_key.val('')
		}
	})
	$('.close').click(function() {
		$('#layer').css({
			'visibility': 'hidden',
    		'opacity': 0
		})
	})
	$('#submit_data').click(function() {
		if(!code.val()) {
			$('.code-err').text('service_code不能为空')
			return
		} else if(!s_key.val()) {
			$('.code-err').text('');
			$('.key-err').text('secret_key不能为空')
			return
		} else {
			$('.key-err').text('');
			window.localStorage.setItem("service_code",code.val());
			window.localStorage.setItem("secret_key",s_key.val());
			$('#layer').css({
				'visibility': 'hidden',
	    		'opacity': 0
			})
			$('.welcome').css({
				'visibility': 'visible',
    			'opacity': 1
			})
			$('#login').html('退出')
		}
	})
	$('#service_code').blur(function() {
		if(!code.val()) {
			$('.code-err').text('service_code不能为空')
		} else {
			$('.code-err').text('');
		}
	})
	$('#secret_key').blur(function() {
		if(!s_key.val()) {
			$('.key-err').text('secret_key不能为空')
		} else {
			$('.key-err').text('');
		}
	})
})
function getData(page) {
	const baseUrl = 'http://101.201.197.202:8080/zbk/restful/video/list';
	let data = {
		page: page
	};
	$.ajax({
		url: baseUrl,
		data: data,
		dataType: 'jsonp',
		success: function(data){
			if(!data['ret']) {
				return;
			}
		    var ldata = data.rows;
		    var total = data.total;
		    var allSumPage = Math.ceil(total/10);
		    var html = [];
		    if(ldata.length > 0) {
		    	html.push('<table class="table-box">');
				html.push('<thead>');
				html.push('<tr>');
				html.push('<th>头像</th>');
				html.push('<th>昵称</th>');
				html.push('<th>拍摄时间</th>');
				html.push('<th>拍摄地点</th>');
				html.push('<th>点赞数</th>');
				html.push('<th>播放次数</th>');
				html.push('<th>播放时长</th>');
				html.push('<th>播放</th>');
				html.push('</tr>');
				html.push('</thead>');
				html.push('<tbody>');
		    	for(let i=0;i<ldata.length;i++) {
			    	html.push('<tr>');
			    	if (!ldata[i]['avata']) {
			    		html.push('<td style="text-align: center;"><img class="avatar" id="v_avata" src="'+ranImgSrc('img/default_m.png','img/default_w.png')+'" alt="" /></td>');
			    	} else {
			    		html.push('<td style="text-align: center;"><img class="avatar" id="v_avata" src="'+ldata[i]['avata']+'" alt="" /></td>');
			    	}
			    	if (!ldata[i]['nick_name']) {
			    		html.push('<td id="v_nick_name">游客</td>')
			    	} else {
			    		html.push('<td id="v_nick_name">'+ldata[i]['nick_name']+'</td>')
			    	}
			    	html.push('<td id="v_create_time">'+ldata[i]['created_at']+'</td>');
			    	html.push('<td id="v_create_time">'+ldata[i]['location']+'</td>');
					html.push('<td id="v_zan_cnt">'+ldata[i]['zan_cnt']+'</td>');
					html.push('<td id="v_access_cnt">'+ldata[i]['access_cnt']+'</td>');
					html.push('<td id="v_duration">'+format(ldata[i]['duration'])+'</td>');
					html.push('<td style="text-align: center;"><a class="play-btn" onclick="p_click(this)" data-height="'+ldata[i]['height']+'" data-width="'+ldata[i]['width']+'" data-src="'+ldata[i]['video_url']+'" href="javascript:;"></a></td>');
					html.push('</tr>');
			    }
	    		html.push('</tbody>');
				html.push('</table>');
				
				pagePause = 0;
					//分页设置
					if(page < 2){
						$("#page").jPages({
							previous: "上一页",
					        next: "下一页",
							containerID : "t_data",
							clickStop   : true,
							perPage	: 2,
							startRange:0,
							midRange:0,
							endRange:0,
							allSumPage : allSumPage,
							callback: ajaxPageData
						});
					}
					
				$('#t_data').html(html.join(''));
		    } else {
		    	$('#t_data').html('<div>暂无数据</div>')
		    }
		},
		error: function(err) {
			console.log(err)
		}
	})
}

function p_click(obj){
	parameters.src = $(obj).attr('data-src');
	v_width = $(obj).attr('data-width');
	v_height = $(obj).attr('data-height');
	play();
	$('body').animate({
		scrollTop: 734
	},1000)
}


//获取列表分页回调函数
function ajaxPageData(obj){
	if(pagePause == 0){
		return false;
	}
	getData(obj["current"]);
}
function format(interval){
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
}
function _pad(num, n = 2){
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
}
function ranImgSrc(str1,str2){
	let random = parseInt(Math.random() * 10);
	return random > 5 ? str1 : str2;
}

function play() {
    swfobject.embedSWF(
        "swf/woan_wmp.swf",
        "woan_player",
        v_width,
        v_height,
        "10.1.0",
        "swf/expressInstall.swf",
        parameters,
        {
	        allowFullScreen: "true",
	        wmode: "opaque"
        },
        { name: "woan_player" }
    );
}