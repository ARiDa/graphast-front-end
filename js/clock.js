
function createClock() {
	//
	function update(hours, minutes) {
		if (hours > 11)
			hours -= 12
		var h = (360 * hours)   / 12
		var m = (360 * minutes) / 60
		ClockHour  .style.transform = 'rotateZ('+h+'deg)'
		ClockMinute.style.transform = 'rotateZ('+m+'deg)'
	}
	//
	Clock.addEventListener('click', function(e) {
		var h = parseInt(Math.random()*24)
		var m = parseInt(Math.random()*60)
		m = m + (5 - m % 5)
		update(h,m)
		Clock.setAttribute('hours', h)
		Clock.setAttribute('minutes', m)
	})
	//
}

function getClockTime() {
	var h = +Clock.getAttribute('hours')
	var m = +Clock.getAttribute('minutes')
	return {hours: h, minutes: m}
}


