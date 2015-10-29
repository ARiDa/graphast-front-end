
function createClock() {
	var today = new Date()
	var lastClick = +new Date(1990,1,1)
	window.datetime  = {
		    day: today.getDate(),
		  month: today.getMonth(),
		   year: today.getFullYear(),
		  hours: today.getHours(),
		minutes: today.getMinutes()
	}
	//
	function update() {
		var hours = datetime.hours
		if (hours > 11)
			hours -= 12
		var minutes = datetime.minutes
		//
		var hRot = (360 * hours)   / 12
		var mRot = (360 * minutes) / 60
		ClockHour  .style.transform = 'rotateZ('+hRot+'deg)'
		ClockMinute.style.transform = 'rotateZ('+mRot+'deg)'
		ClockPeriod.innerHTML = datetime.hours < 12 ? 'AM' : 'PM'
	}
	//
	Clock.addEventListener('click', function(e) {
		if (e.target.nodeName !== 'B')
			return false
		var number = +e.target.innerHTML
		var now = +new Date()
		if (now - lastClick < 3000) { // 3 seconds
			datetime.minutes = number * 5 // 12 * 5 = 60
			now = +new Date(1990,1,1)
		} else
			datetime.hours = datetime.hours > 11 ? (number+12) : number
		lastClick = now
		update()
	})
	//
	ClockPeriod.addEventListener('mousedown', function(e) {
		if (datetime.hours > 11)
			datetime.hours -= 12
		else
			datetime.hours += 12
		update()
	})
	//
	update()
}

function getClockTime() {
	return datetime
}


