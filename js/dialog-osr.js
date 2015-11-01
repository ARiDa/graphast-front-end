
function createDialogOSR() {
	var pois  = {}
	pois[6]   = 'Hotel'
	pois[13]  = 'Police'
	pois[22]  = 'University'
	pois[23]  = 'Bar'
	pois[25]  = 'Cafe'
	pois[29]  = 'Restaurant'
	pois[33]  = 'Hospital'
	pois[34]  = 'Pharmacy'
	pois[46]  = 'Bank'
	pois[105] = 'Supermarket'
	pois[162] = 'Fuel'
	//
	var html = ''
	for (var id in pois)
		html += '<b data-id="'+id+'">'+pois[id]+'</b>'
	html = '<div>'+html+'</div>'
	//
	$('.dialog-osr .add').on('click', 'button', function() {
		$('#add-osr-poi').html(html)
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
}




