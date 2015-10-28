
var App = {};

(function($){
	var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

	App = {
	
		init: function() {
			$("#dijstra-button").click(function(){
				GraphastMap.getShortestPath();
			});

			$("#a-start-button").click(function(){
				GraphastMap.getShortestPathAStart();
			});

			$("#clean-map-button").click(function(){
				GraphastMap.cleanMap();
			});
			
		}
	}
})($)



window.onload = function() {
	// load map
	mapInit();
	// load admin screen
	adminInit();

	App.init();
	GraphastMap.init();
	// ...
	//

	
}


