
function createLogin() {
	if (window.location.href.indexOf('login') == -1)
		return
	$('#Login').removeClass('hidden')
	//
	$('#Login input').keypress(function(e) {
		if (e.keyCode == 13) {
			var s = $('#Login input').val()
			if (s == '123') {
				$('body').removeClass('public')
				$('#Login').addClass('hidden')
				location.hash = ''
			} else {
				$('#Login input').val('')
				$('#Login input')
					.animate({marginLeft: "-=40px"}, 100)
					.animate({marginLeft: "+=80px"}, 200)
					.animate({marginLeft: "-=80px"}, 200)
					.animate({marginLeft: "+=80px"}, 200)
					.animate({marginLeft: "-=40px"}, 100)
			}
			return
			//
			$.post('/login', {pass: $('#Login input').val()}, function(data) {
				$('body').addClass('superuser')
			}, function(err) {
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





