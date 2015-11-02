
function createClock() {
	var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	var calendar = $('#Calendar').jqxCalendar({width: 180, height: 180})
	//
	var today = new Date()
	var lastClick = +new Date(1990,1,1)
	window.datetime = {
		    day: today.getDate(),
		  month: today.getMonth() + 1,
		   year: today.getFullYear(),
		  hours: today.getHours(),
		weekday: today.getDay(),
		minutes: today.getMinutes()
	}
	//
	function getdate() {
		datetime.weekday = (new Date(datetime.year, datetime.month - 1, datetime.day, datetime.hours, datetime.minutes)).getDay()
		var s = ''
		s += (datetime.day < 10 ? '0' : '') + datetime.day
		s += '-'
		s += (datetime.month < 10 ? '0' : '') + datetime.month
		s += '-'
		s += datetime.year
		return '<b>' + weekdays[datetime.weekday] + '</b>' + s
	}
	//
	function update() {
		var hours = datetime.hours
		if (hours > 11)
			hours -= 12
		var minutes = datetime.minutes
		//
		var mRot = (360 * minutes) / 60
		var hRot = (360 * hours)   / 12 + mRot/15
		ClockHour  .style.transform = 'rotateZ('+hRot+'deg)'
		ClockMinute.style.transform = 'rotateZ('+mRot+'deg)'
		ClockPeriod.innerHTML = datetime.hours < 12 ? 'AM' : 'PM'
		ClockDate.innerHTML   = getdate()
	}
	//
	ClockDate.addEventListener('click', function() {
		document.body.classList.add('show-calendar')
	})
	//
	Clock.addEventListener('click', function(e) {
		if (e.target.nodeName !== 'B' || e.target.innerHTML.length > 2)
			return false
		var number = +e.target.innerHTML
		var now = +new Date()
		if (now - lastClick < 5000) { // 5 seconds
			datetime.minutes = (number * 5) % 60 // 12 * 5 = 60
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
	// click on same date
	Calendar.addEventListener('click', function(e) {
		if (e.target.getAttribute('role') == 'gridcell')
			document.body.classList.remove('show-calendar')
	})
	// click on other date
	calendar.on('change', function(e) {
		document.body.classList.remove('show-calendar')
		datetime.day     = calendar.val().getDate()
		datetime.month   = calendar.val().getMonth() + 1
		datetime.year    = calendar.val().getFullYear()
		datetime.weekday = calendar.val().getDay()
		update()
	})
	//
	update()
}

function getClockTime() {
	return { hours: datetime.hours,
			 day: datetime.day,
			 year: datetime.year,
			 weekday: datetime.weekday,
			 month: datetime.month,
			 minutes: datetime.minutes,
			 weekday: datetime.weekday
			}
}


