
function createDialogOSR() {
	var pois = ''
	for (var id in POI_CATEGORIES)
		pois += '<b data-id="'+id+'">'+POI_CATEGORIES[id].name+'</b>'
	pois = '<div>'+pois+'</div>'
	//
	$('.dialog-osr .add').on('click', 'button', function() {
		$('#add-osr-poi').html(pois)
	})
	$('.dialog-osr .places').on('click', 'button', function() {
		$('.dialog-osr .places').empty()
		GraphastMap.cleanMap();
	})
	$('#add-osr-poi').on('click', 'div b', function(e) {
		var places = $('.dialog-osr .pois .places')
		if (places.children().length == 0)
			places.append('<p><button>x</button></p>')
		var id   = e.target.getAttribute('data-id')
		var name = e.target.innerHTML
		var item = '<p><span data-id="'+id+'">'+name+'</span></p>'
		places.append(item)
		$('#add-osr-poi').html('<button>+</button>')
	})
	//
	// get current POIs selected by user
	window.getCurrentPOIs = function() {
		var result = []
		$('.dialog-osr .pois .places span').each(function() {
			result.push(+$(this).attr('data-id'))
		})
		return result
	}
	//
	// click on 'Go!'
	$('.dialog-osr button.go').click(function() {
		var time = getClockTime();
		var categories = getCurrentPOIs();
		if (categories.length > 0) {
			GraphastMap.getOSR( "OSR", time, categories );
		}
	})
	//
}




