
function createDialogOSR() {
	var pois = ''
	for (var id in App.poiCategories)
		pois += '<b data-id="'+id+'">'+App.poiCategories[id]+'</b>'
	pois = '<div>'+pois+'</div>'
	//
	$('.dialog-osr .add').on('click', 'button', function() {
		$('#add-osr-poi').html(pois)
	})
	$('.dialog-osr .places').on('click', 'button', function() {
		$('.dialog-osr .places').empty()
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
		alert('OK')
	})
	//
}




