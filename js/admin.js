
function adminInit() {
	// load apps from server
	$.getJSON('http://demo.graphast.org:8080/graphast-ws/admin/apps', function(apps) {
		var html = ''
		for (var i = 0; i < apps.length; i++) {
			var  a = apps[i]
			var size = (a.size / 1024 / 1024).toFixed(2) + ' MB'
			html += '<button'
			html += ' data-id="'    + a.appName + '"'
			html += ' data-name="'  + a.appName + '"'
			html += ' data-dir="'   + a.graphDir + '"'
			html += ' data-nodes="' + a.numberOfNodes + '"'
			html += ' data-edges="' + a.numberOfEdges + '"'
			html += ' data-size="'  + size + '"'
			html += '>'
			html += a.appName
			html += '<b>' + size + '</b>'
			html += '<span>' + a.numberOfNodes + ' nodes</span>'
			html += '</button>'
		}
		AppsResult.innerHTML = html
	}, function(err) {
		console.log(err)
		alert('Error on GET admin apps')
	})
	//
	// event click ||| menu (top left)
	BtnMenuClose.addEventListener('click', function() {
		document.body.classList.toggle('admin')
		window['isAdmin'] = document.body.classList.contains('admin')
		//
		if (isAdmin)
			;// ...
		//
		//$('#AppInfo').addClass('hidden')
		$('#AppInfo').toggleClass('hidden')
	})
	//
	// searching/filtering apps
	function search(q) {
		var items = document.querySelectorAll('#AppsResult button')
		for (var i = 0; i < items.length; i++) {
			if (items[i].innerHTML.toLowerCase().indexOf(q) == -1)
				items[i].classList.add('hidden')
			else
				items[i].classList.remove('hidden')
			items[i].classList.remove('selected')
		}
		$('#AppInfo').addClass('fadeOut')
	}
	Search.addEventListener('keyup', function() {
		search(this.value.toLowerCase())
	})
	//
	// click on app buttons (edit app)
	$('#AppsResult').on('click', 'button', function() {
		$('#AppsResult button').removeClass('selected')
		$(this).addClass('selected')
		//
		// populate app-info...
		var btnApp = $(this)
		if ($('#AppInfo').hasClass('hidden') || $('#AppInfo').hasClass('fadeOut')) {
			$('#AppInfo h1').html(btnApp.attr('data-name'))
			$('#AppInfo .dir   span').html(btnApp.attr('data-dir'))
			$('#AppInfo .nodes span').html(btnApp.attr('data-nodes'))
			$('#AppInfo .edges span').html(btnApp.attr('data-edges'))
			$('#AppInfo .size  span').html(btnApp.attr('data-size'))
			$('#AppInfo').removeClass('hidden').removeClass('fadeOut')
		} else {
			$('#AppInfo').addClass('fadeOut')
			setTimeout(function() {
				$('#AppInfo h1').html(btnApp.attr('data-name'))
				$('#AppInfo .dir   span').html(btnApp.attr('data-dir'))
				$('#AppInfo .nodes span').html(btnApp.attr('data-nodes'))
				$('#AppInfo .edges span').html(btnApp.attr('data-edges'))
				$('#AppInfo .size  span').html(btnApp.attr('data-size'))
				$('#AppInfo').removeClass('fadeOut')
			}, 250)
		}
		//...
	})
	//
	$('#BtnMenuNewApp').click(function() {
		$('#AppsResult button').removeClass('selected')
		Search.value = ''
		search('')
		//
		$('body').removeClass('show-admin-app-details')
		$('body').addClass('show-admin-app-form')
		$('#AppInfo').addClass('hidden')
	})
	//
	//
	$('#AppInfo button.open').click(function() {
		var appName = $('#AppInfo h1').html()
		$('#app-menu b').html(appName)
		$('#app-menu button').removeClass('selected')
		//
		$('#AppInfo').addClass('hidden')
		$('body').removeClass('admin')
		$('.dialog').addClass('hidden')
		//
		App.openApp(appName)
	})
	//
	$('#AppInfo button.delete').click(function() {
		alert('not implemented yet')
	})
	//
}

