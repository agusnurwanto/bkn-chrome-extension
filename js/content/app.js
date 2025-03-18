get_profile();

let previousUrl = "";
const observer = new MutationObserver(() => {
  	if (window.location.href !== previousUrl) {
	    console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
	    previousUrl = window.location.href;
	    cekUrl(previousUrl);
  	}
});

observer.observe(document, { subtree: true, childList: true });

function cekUrl(current_url, nomor=1){
	if(nomor > 1){
		console.log('Run ulang cekUrl() ke '+nomor+' URL: '+current_url);
	}
	
	var loading = ''
		+'<div id="wrap-loading">'
	        +'<div class="lds-hourglass"></div>'
	        +'<div id="persen-loading"></div>'
	        +'<div id="pesan-loading"></div>'
	    +'</div>';
	if(jQuery('#wrap-loading').length == 0){
		jQuery('body').prepend(loading);
	}

	setTimeout(function(){
		jQuery('.aksi-extension').remove();
		jQuery('.modal-extension').remove();
		var cek_reload = true;

		if(current_url.indexOf('/skp/') != -1){
			cek_reload = false;
			console.log('Halaman SKP', nomor);
			var btn_rhk = `
				<div class="col-12 col-sm-4 col-md-3 aksi-extension">
					<button class="btn btn-block btn-warning" id="tarik-rhk-lokal">Tarik data RHK dari Lokal</button>
				</div>
			`;
			jQuery('div:contains("Ajukan SKP").col-12.col-sm-4.col-md-3').after(btn_rhk);
			jQuery('#tarik-rhk-lokal').on('click', function(){
				get_rhk_lokal();
			})
		}

		// ulangi cek url
		if(cek_reload){
			console.log('cek_reload', cek_reload, current_url, location.href);
			current_url = window.location.href;
			cekUrl(current_url, nomor+1);
		}
	}, 1000);
}