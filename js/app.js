
var App = {};

(function($){
	var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

	App = {
	
		init: function() {

			var that = this;

			$("#dijstra-button").click(function(){
				var time = getClockTime();
				time.weekday = 0;
				var label = that.formatLabel("Dijstra", time);
				GraphastMap.getShortestPath(label, time);
			});

			$("#a-start-button").click(function(){
				var time = getClockTime();
				time.weekday = 0;
				var label = that.formatLabel("A-Start");
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
	// load map
	mapInit();
	// load admin screen
	adminInit();

	createClock();

	App.init();
	GraphastMap.init();
	// ...
	//

	
}


