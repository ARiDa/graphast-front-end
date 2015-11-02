
function createAppMenu() {
	//
	$('#app-menu').on('click', 'button', function() {
		if ($(this).hasClass('selected'))
			return
		cleanMap()
		$('#app-menu button').removeClass('selected')
		$(this).addClass('selected')
		var button = $(this).html()
		if (button.indexOf('Shortest Path') == 0) {
			$('.dialog.dialog-osr').addClass('hidden')
			$('.dialog.dialog-knn').addClass('hidden')
			$('.dialog.dialog-shortest-path').removeClass('hidden')
		}
		if (button.indexOf('OSR') == 0) {
			$('.dialog.dialog-shortest-path').addClass('hidden')
			$('.dialog.dialog-knn').addClass('hidden')
			$('.dialog.dialog-osr').removeClass('hidden')
		}
		if (button.indexOf('kNN') == 0) {
			$('.dialog.dialog-shortest-path').addClass('hidden')
			$('.dialog.dialog-osr').addClass('hidden')
			$('.dialog.dialog-knn').removeClass('hidden')
		}
	})
}


