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

			var modal = ''
				+'<div class="modal fade modal-extension" id="modal-extension" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true" style="z-index: 99999; background: #0000003d;">'
			        +'<div class="modal-dialog" style="max-width: 1500px;" role="document">'
			            +'<div class="modal-content">'
			                +'<div class="modal-header bgpanel-theme">'
			                    +'<h3 class="fw-bolder m-0">Data Rencana Hasil Kerja (RHK) Lokal</h4>'
			                    +'<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>'
			                +'</div>'
			                +'<div class="modal-body">'
			                  	+'<table class="table table-bordered table-hover table-striped" id="table-extension">'
			                      	+'<thead>'
			                        	+'<tr>'
			                          		+'<th class="text-center" style="font-weight: bold;"><input type="checkbox" id="modal_cek_all"></th>'
			                          		+'<th class="text-center" style="font-weight: bold;">RHK Atasan</th>'
			                          		+'<th class="text-center" style="font-weight: bold;">RHK</th>'
			                          		+'<th class="text-center" style="font-weight: bold;">Indikator</th>'
			                        	+'</tr>'
			                      	+'</thead>'
			                      	+'<tbody></tbody>'
			                  	+'</table>'
			                +'</div>'
			                +'<div class="modal-footer">'
			                    +'<button type="button" class="btn btn-primary" id="proses-extension">Simpan</button>'
			                    +'<button type="button" class="btn btn-default" data-dismiss="modal">Tutup</button>'
			                +'</div>'
			            +'</div>'
			        +'</div>'
			    +'</div>';
			jQuery('body').append(modal);
			var btn_rhk = `
				<div class="col-12 col-sm-4 col-md-3 aksi-extension">
					<button class="btn btn-block btn-warning" id="tarik-rhk-lokal" style="font-weight: bold;">Tarik data RHK dari Lokal</button>
				</div>
			`;
			jQuery('div:contains("Ajukan SKP").col-12.col-sm-4.col-md-3').after(btn_rhk);
			jQuery('#tarik-rhk-lokal').on('click', function(){
				get_rhk_lokal();
			});
		}

		// ulangi cek url
		if(cek_reload){
			console.log('cek_reload', cek_reload, current_url, location.href);
			current_url = window.location.href;
			cekUrl(current_url, nomor+1);
		}
	}, 1000);
}