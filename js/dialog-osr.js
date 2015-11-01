
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
	var htmlPois = ''
	for (var id in pois)
		htmlPois += '<b data-id="'+id+'">' + pois[id] + '</b>'
	htmlPois = '<div>' + htmlPois + '</div>'

	$('#add-osr-poi').on('click', 'button', function() {
		$('#add-osr-poi').html(htmlPois)
		return false
	})
	$('#add-osr-poi').on('click', 'div b', function(e) {
		var item = '<p><span>' + e.target.innerHTML + '</span></p>'
		$('.dialog-osr .pois .places').append(item)
		$('#add-osr-poi').html('<button>+</button>')
	})
	//
	// get current POIs selected by user
	window.getCurrentPOIs = function() {
		var result = []
		$('.dialog-osr .pois .places b').each(function() {
			result.push(+$(this).attr('data-id'))
		})
		return result
	}
}




