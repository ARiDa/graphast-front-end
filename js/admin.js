
function adminInit() {
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
	Search.addEventListener('keyup', function() {
		var q = this.value.toLowerCase()
		var items = document.querySelectorAll('#AppsResult button')
		for (var i = 0; i < items.length; i++) {
			if (items[i].innerHTML.toLowerCase().indexOf(q) == -1)
				items[i].classList.add('hidden')
			else
				items[i].classList.remove('hidden')
			items[i].classList.remove('selected')
		}
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



	// setInterval(function() {
	// 	document.body.classList.toggle('admin')
	// }, 3000)
}

