
function createLogin() {
	if (window.location.href.indexOf('login') == -1)
		return
	$('#Login').removeClass('hidden')
	$('#Login input').focus()
	//
	$('#Login input').keypress(function(e) {
		if (e.keyCode == 13) {
			var s = $('#Login input').val()
			$.post('http://demo.graphast.org:8080/graphast-ws/login', {pass: s}, function(data) {
				$('body').removeClass('public')
				$('#Login').addClass('hidden')
				history.pushState(null, null, '/')
			}).error(function(err) {
				$('#Login input').val('')
				$('#Login input')
					.animate({marginLeft: "-=40px"}, 100)
					.animate({marginLeft: "+=80px"}, 200)
					.animate({marginLeft: "-=80px"}, 200)
					.animate({marginLeft: "+=80px"}, 200)
					.animate({marginLeft: "-=40px"}, 100)
			})
		}
	})
}





