
function adminInit() {
	// load apps from server
	$.getJSON('http://demo.graphast.org:8080/graphast-ws/admin/apps', function(apps) {
		var html = ''
		for (var i = 0; i < apps.length; i++) {
			var  a = apps[i]
			html += '<button data-id="' + a.appName + '">'
			html += a.appName
			html += '<b>' + (a.size / 1024 / 1024).toFixed(2) + ' MB</b>'
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
	}
	Search.addEventListener('keyup', function() {
		search(this.value.toLowerCase())
	})
	//
	// click on app buttons (edit app)
	AppsResult.addEventListener('click', function(e) {
		var btn = e.target
		if (btn.tagName == 'DIV')
			return
		if (btn.tagName == 'SPAN')
			btn = btn.parentNode
		if (btn.tagName == 'B')
			btn = btn.parentNode
		if (btn.tagName != 'BUTTON')
			return // click in invalid element
		var items = document.querySelectorAll('#AppsResult button')
		for (var i = 0; i < items.length; i++)
			items[i].classList.remove('selected')
		btn.classList.add('selected')
	})
	//
	BtnMenuNewApp.addEventListener('click', function() {
		var items = document.querySelectorAll('#AppsResult button')
		for (var i = 0; i < items.length; i++)
			items[i].classList.remove('selected')
		Search.value = ''
		search('')
	})


	// setInterval(function() {
	// 	document.body.classList.toggle('admin')
	// }, 3000)
}

