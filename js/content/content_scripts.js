// console.log('run content_script.js');

function injectScript(file, node, _type) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    if(_type){
    	s.setAttribute('type', _type);
    }else{
    	s.setAttribute('type', 'text/javascript');
    }
    s.setAttribute('src', file);
    th.insertBefore(s, th.firstChild);
}

injectScript( chrome.runtime.getURL('/js/jquery.min.js'), 'html');
injectScript( chrome.runtime.getURL('/config.js'), 'html');
setTimeout(function(){
	injectScript( chrome.runtime.getURL('/content_message.js'), 'html');
	injectScript( chrome.runtime.getURL('/js/content/functions.js'), 'html');
	injectScript( chrome.runtime.getURL('/js/content/content_inject.js'), 'html');
}, 1000);
window.data_temp_onmessage = {};

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if(request.continue){
		if(typeof data_temp_onmessage[request.continue] == 'undefined'){
			data_temp_onmessage[request.continue] = [];
		}
		data_temp_onmessage[request.continue].push(request.data.data);
		if(request.no >= request.length){
			request.data.data = data_temp_onmessage[request.continue];
		}else{
			return;
		}
	}
	console.log('sender, request', sender, request);
	if(request.type == 'response-fecth-url'){
		var res = request.data;
		var _alert = true;
		var cek_hide_loading = true;
		if(res.action == 'get_rencana_hasil_kerja'){
			_alert = false;
			cek_hide_loading = false;
			open_modal_rhk_lokal(res.data);
		}
		if(cek_hide_loading){
			hide_loading();
		}
		if(_alert){
			alert(res.message);
		}
	}
	return sendResponse("THANKS from content_script!");
});