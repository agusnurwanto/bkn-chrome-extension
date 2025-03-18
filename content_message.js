window.addEventListener('message', function(event) {
	var command = event.data.command;
	console.log('run_script', event.data);
	switch(command) {
    	case 'window.data_bkn':
			window.data_bkn = event.data.data; console.log(data_bkn);
			break;
	}
});