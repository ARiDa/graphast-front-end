
var App = {};

App.poiCategories      = {}
App.poiCategories[6]   = {name: 'Hotel',       icon: 'hotel'}
App.poiCategories[13]  = {name: 'Police',      icon: 'police'}
App.poiCategories[22]  = {name: 'University',  icon: 'university'}
App.poiCategories[23]  = {name: 'Bar',         icon: 'bar'}
App.poiCategories[25]  = {name: 'Cafe',        icon: 'cafe'}
App.poiCategories[29]  = {name: 'Restaurant',  icon: 'restaurant'}
App.poiCategories[33]  = {name: 'Hospital',    icon: 'hospital'}
App.poiCategories[34]  = {name: 'Pharmacy',    icon: 'pharmacy'}
App.poiCategories[46]  = {name: 'Bank',        icon: 'bank'}
App.poiCategories[105] = {name: 'Supermarket', icon: 'supermarket'}
App.poiCategories[162] = {name: 'Fuel',        icon: 'fuel'}


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


