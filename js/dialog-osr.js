
function createDialogOSR() {
	var pois = [
		'bank',
		'beach',
		'restaurant',
		'shopping',
		'abc',
		'cinema',
		'gym',
		'hospital',
		'park',
		'theatre',
		'museum',
		'airport'
	]
	var htmlPois = ''
	for (var i = 0; i < pois.length; i++)
		htmlPois += '<b>' + pois[i] + '</b>'
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
}




