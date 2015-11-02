
var App = {};

App.POIs = {}
App.POIs[6]   = {name: 'Hotel',       icon: ''}
App.POIs[13]  = {name: 'Police',      icon: ''}
App.POIs[22]  = {name: 'University',  icon: ''}
App.POIs[23]  = {name: 'Bar',         icon: ''}
App.POIs[25]  = {name: 'Cafe',        icon: 'cafe'}
App.POIs[29]  = {name: 'Restaurant',  icon: 'restaurant'}
App.POIs[33]  = {name: 'Hospital',    icon: ''}
App.POIs[34]  = {name: 'Pharmacy',    icon: ''}
App.POIs[46]  = {name: 'Bank',        icon: ''}
App.POIs[105] = {name: 'Supermarket', icon: ''}
App.POIs[162] = {name: 'Fuel',        icon: ''}
;

//var MARKER_ICONS = ["cafe", "restaurant", "bar", "bank", "cinema", "hospital", "swimming", "theatre", "parking", "airport", "shop"];


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


