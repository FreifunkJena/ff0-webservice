$(document).ready(function(){
    $.getJSON("cgi-bin/online.json", function(haveInternet) {
        if(!haveInternet) {
	    $('#online').hide();
            $('#offline').show();
        }
    });
});
