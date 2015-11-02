
var App = {};

POI_CATEGORIES      = {}
POI_CATEGORIES[6]   = {name: 'Hotel',       icon: 'hotel'}
POI_CATEGORIES[13]  = {name: 'Police',      icon: 'police'}
POI_CATEGORIES[22]  = {name: 'University',  icon: 'university'}
POI_CATEGORIES[23]  = {name: 'Bar',         icon: 'bar'}
POI_CATEGORIES[25]  = {name: 'Cafe',        icon: 'cafe'}
POI_CATEGORIES[29]  = {name: 'Restaurant',  icon: 'restaurant'}
POI_CATEGORIES[33]  = {name: 'Hospital',    icon: 'hospital'}
POI_CATEGORIES[34]  = {name: 'Pharmacy',    icon: 'pharmacy'}
POI_CATEGORIES[46]  = {name: 'Bank',        icon: 'bank'}
POI_CATEGORIES[105] = {name: 'Supermarket', icon: 'supermarket'}
POI_CATEGORIES[162] = {name: 'Fuel',        icon: 'fuel'}
;

(function($){
	var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

	App = {
	
		init: function() {

			var that = this;

			$("#dijkstra-button").click(function(){
				var time = getClockTime();
				var label = "Dijkstra";
				GraphastMap.getShortestPath(label, time);
			});

			$("#a-start-button").click(function(){
				var time = getClockTime();
				var label = "A-Start";
				GraphastMap.getShortestPathAStart(label);
			});

			$("#clean-map-button").click(function(){
				GraphastMap.cleanMap();
			});
			
		},

		formatLabel: function(method, time) {
			if (time) {
				return method + " at " + time.hours + ":" + time.minutes;
			}

			return method
		},

		openApp: function(name) {
			alert('opening ... ' + name)
		}

	}
})($)



window.onload = function() {
	document.body.classList.remove('loading')
	//
	// load map
	mapInit();
	// load admin screen
	adminInit();

	createClock();
	createAppMenu();
	createDialogOSR();
	createDialogShortestPath();

	App.init();
	GraphastMap.init();
	// ...
	//

	
}


