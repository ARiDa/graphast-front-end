
function adminInit() {
	BtnMenuClose.addEventListener('click', function() {
		document.body.classList.toggle('admin')
		window['isAdmin'] = document.body.classList.contains('admin')
		//
		if (isAdmin)
			;// ...
	})
	// setInterval(function() {
	// 	document.body.classList.toggle('admin')
	// }, 3000)
}

