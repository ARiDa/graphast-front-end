
var App = {};

POI_CATEGORIES      = {}
POI_CATEGORIES[6]   = {name: 'Hotel',       icon: 'lodging'}
POI_CATEGORIES[13]  = {name: 'Police',      icon: 'police'}
POI_CATEGORIES[22]  = {name: 'University',  icon: 'college'}
POI_CATEGORIES[23]  = {name: 'Bar',         icon: 'bar'}
POI_CATEGORIES[25]  = {name: 'Cafe',        icon: 'cafe'}
POI_CATEGORIES[29]  = {name: 'Restaurant',  icon: 'restaurant'}
POI_CATEGORIES[33]  = {name: 'Hospital',    icon: 'hospital'}
POI_CATEGORIES[34]  = {name: 'Pharmacy',    icon: 'pharmacy'}
POI_CATEGORIES[46]  = {name: 'Bank',        icon: 'bank'}
POI_CATEGORIES[105] = {name: 'Supermarket', icon: 'grocery'}
POI_CATEGORIES[162] = {name: 'Fuel',        icon: 'fuel'}
;

// var MARKER_ICONS = ["cafe", "restaurant", "bar", "bank", "cinema", "hospital", "swimming", "theatre", "parking", "airport", "shop"];

(function($){
	var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

	App = {
	
		init: function() {
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
			$.getJSON('http://demo.graphast.org:8080/graphast-ws/admin/load/' + name, function() {
				GraphastMap.cleanMap();
				GraphastMap.centerMapBasedOnTheGraph();
			}, function(err) {
				alert('error loading app graph ' + name)
			})
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


