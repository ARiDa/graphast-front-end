
var App = {};

(function($){
	var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

	App = {
	
		init: function() {

			var that = this;

			$("#dijstra-button").click(function(){
				console.log(GraphastMap.pathSettings);
				var time = getClockTime();
				console.log(time);
				var label = "Dikjstra";
				GraphastMap.getShortestPath(label, time);
			});

			$("#a-start-button").click(function(){
				var time = getClockTime().copy();
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

	App.init();
	GraphastMap.init();
	// ...
	//

	
}


