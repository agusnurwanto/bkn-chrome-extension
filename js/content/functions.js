function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

function show_loading(){
	jQuery('#wrap-loading').show();
	jQuery('#persen-loading').html('');
	jQuery('#persen-loading').attr('persen', '');
	jQuery('#persen-loading').attr('total', '');
}

function hide_loading(){
	jQuery('#wrap-loading').hide();
	jQuery('#persen-loading').html('');
	jQuery('#persen-loading').attr('persen', '');
	jQuery('#persen-loading').attr('total', '');
}

function pesan_loading(pesan, loading=false){
	if(loading){
		pesan = 'LOADING...<br>'+pesan;
	}
	jQuery('#persen-loading').html(pesan);
	console.log(pesan);
}

function run_script(command, data=false){
	postMessage({
		command: command,
		data: data
	}, '*');
}

function capitalizeFirstLetter(string) {
  	return string.charAt(0).toUpperCase() + string.slice(1);
}

function relayAjax(options, retries=20, delay=5000, timeout=1800000){
	options.timeout = timeout;
	options.cache = false;
	if(options.length){
		var start = options.url.split('start=');
		if(start.length >= 2){
			start = +(start[1].split('&')[0]);
		}else{
			options.url += '&start=0';
			start = 0;
			options.all_data = [];
			options.success2 = options.success;
		}
		var _length = options.url.split('length=');
		if(_length.length <= 1){
			options.url += '&length='+options.length;
		}
		pesan_loading('GET DATATABLE start='+start, true);
		options.success = function(items){
			items.data.map(function(b, i){
				options.all_data.push(b);
			});
			if(options.all_data.length >= items.recordsTotal){
				items.data = options.all_data;
				options.success2(items);
			}else{
				var newstart = options.all_data.length - 1;
				options.url = options.url.replace('&start='+start, '&start='+newstart);
				setTimeout(function(){
	                relayAjax(options);
	            }, 1000);
			}
		};
	}

	options.beforeSend = function (xhr) {			    
		xhr.setRequestHeader("Authorization", 'Bearer '+localStorage.token);
		xhr.setRequestHeader("X-Xsrf-Token", getCookieData('XSRF-TOKEN'));  
	}

    jQuery.ajax(options)
    .fail(function(jqXHR, exception){
    	// console.log('jqXHR, exception', jqXHR, exception);
    	if(
    		jqXHR.status != '0' 
    		&& jqXHR.status != '503'
    		&& jqXHR.status != '500'
    	){
    		if(jqXHR.responseJSON){
    			options.success(jqXHR.responseJSON);
    		}else{
    			options.success(jqXHR.responseText);
    		}
    	}else if (retries > 0) {
            console.log('Koneksi error. Coba lagi '+retries, options);
            var new_delay = Math.random() * (delay/1000);
            setTimeout(function(){ 
                relayAjax(options, --retries, delay, timeout);
            }, new_delay * 1000);
        } else {
            alert('Capek. Sudah dicoba berkali-kali error terus. Maaf, berhenti mencoba.');
        }
    });
}

function getCookieData( name ) {
    var pairs = document.cookie.split("; "),
        count = pairs.length, parts; 
    while ( count-- ) {
        parts = pairs[count].split("=");
        if ( parts[0] === name )
            return parts[1];
    }
    return false;
}

function get_profile(){
	if(typeof profile_bkn == 'undefined'){
		window.profile_bkn = {};
	}
	new Promise(function(resolve, reject){
		relayAjax({
			url: config.bkn_url+'api/pegawai/profil',
			success: function(val){
				if(val.success){
					profile_bkn = val.data;
				}
				resolve(profile_bkn);
			}
		});
	});
}

function get_rhk_lokal(){
	show_loading();
	var kode_rhk = location.href.split('/').pop();
	pesan_loading('GET detail RHK BKN dengan kode "'+kode_rhk);
	relayAjax({
		url: config.bkn_url+'api/skp/'+kode_rhk+'?master=1',
		success: function(val){
			pesan_loading('GET RHK lokal atas Nama "'+profile_bkn.nama+'", NIP: '+profile_bkn.nip+', Tahun: '+val.data.info.tahun+', Jabatan: '+val.data.info.pegawai_jabatan);
			var data_peg = {
				action: 'get_rencana_hasil_kerja',
				api_key: config.api_key,
				nip: profile_bkn.nip,
				tahun_anggaran: val.data.info.tahun
			}
			var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_peg,
		    			return: true
					}
			    }
			};
			chrome.runtime.sendMessage(data_back, function(response) {
			    console.log('responeMessage', response);
			});
		}
	});
}

function open_modal_rhk_lokal(data){
	console.log('Open RHK Modal', data);
	var body = '';
	for (var i in data){
		var indikator = '';
		for(ind in data[i].indikator){
			indikator += `
				<tr>
					<td class="text-center">${data[i].indikator[ind].aspek_rhk_teks}</td>
					<td>${data[i].indikator[ind].indikator}</td>
					<td class="text-center">${data[i].indikator[ind].target_akhir}</td>
					<td class="text-center">${data[i].indikator[ind].satuan}</td>
				</tr>
			`;
		}
		body += `
			<tr>
				<td class="text-center"><input type="checkbox"></td>
				<td>-</td>
				<td>${data[i].detail.label}</td>
				<td style="padding: 2px;">
					<table class="table table-bordered" style="margin: 0;">
						<thead>
							<tr>
								<th class="text-center">Aspek</th>
								<th class="text-center">Indikator</th>
								<th class="text-center">Target</th>
								<th class="text-center">Satuan</th>
							</tr>
						</thead>
						<tbody>
							${indikator}
						</tbody>
					</table>
			</tr>
		`;
	}
	jQuery('#table-extension tbody').html(body);
	run_script('show_modal_sm', {order: [[1, "asc"]]});
	hide_loading();
}