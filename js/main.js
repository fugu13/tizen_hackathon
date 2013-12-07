var backEventListener = null;

var unregister = function() {
    if ( backEventListener !== null ) {
        document.removeEventListener( 'tizenhwkey', backEventListener );
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }
    
    // TODO:: Do your initialization job
    console.log("init() called");
    
    var backEvent = function(e) {
        if ( e.keyName == "back" ) {
            try {
                if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch( ex ) {
                unregister();
            }
        }
    }
    
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener( 'tizenhwkey', backEvent );
    backEventListener = backEvent;
    
    var database = {};
    
    $('.make').bind('click', function() {
    	var textarea = $('#write');
    	//textarea.addClass('visible');
    	textarea.focus();
    });
    var makeNoteItem = function(text) {
    	return '<li>' + text + '</li>';
    };
    var note = function() {
    	var textarea = $('#write');
    	var text = textarea.val()
    	if(text) {
    		$('#notes').append(makeNoteItem(text)).listview('refresh');
    	}
    	//textarea.removeClass('visible');
    	textarea.val('');
    };
    $('#content').on('keypress', '#write.visible', function(e) {
    	var code = e.keyCode || e.which;
    	if(code == 13) {
    		note();
    	}
    });
    var contacts = tizen.contact.getDefaultAddressBook();
    contacts.find(function(people) {
    	for(var ii = 0; ii < people.length; ii++) {
    		$('#participants').append('<li><a href="#">' + people[ii].name + '</a></li>').listview('refresh');
    	}
    });
    $('#participants').on('click', 'a', function() {
    	database.current = $(this).text();
    	console.log("Current!", database.current);
    	$('#notes').append('<li data-role="list-divider">' + database.current + '</li>').listview('refresh');
    	$('#content').tap();
    });
};

$(document).bind( 'pageinit', init );
$(document).unload( unregister );