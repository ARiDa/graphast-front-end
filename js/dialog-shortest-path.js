
function createDialogShortestPath() {
	$('.dialog-shortest .algorithms i').click(function() {
		if ($(this).hasClass('selected'))
			return $(this).removeClass('selected')
		$('.dialog-shortest .algorithms i.selected').removeClass('selected')
		$(this).addClass('selected')
	})
	//
	$('.dialog-shortest button.go').click(function() {
		var algorithm = getCurrentAlgorithm()
		if (algorithm == 'Dijkstra')
			GraphastMap.getShortestPath(algorithm, getClockTime())
		if (algorithm == 'A-Start')
			GraphastMap.getShortestPathAStart(algorithm)
	})
	//
	window.getCurrentAlgorithm = function() {
		var btn = $('.dialog-shortest .algorithms i.selected')
		if (btn.length > 0)
			return btn.html().trim()
		return null
	}
	//
}



