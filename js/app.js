
var App = {};

(function($){
	var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

	App = {
	
		getShortestPath: function(po, pd) {
			GraphastMap.getShortestPath(po,pd);
		}
	}
})($)



window.onload = function() {
	// load map
	mapInit()
	// load admin screen
	adminInit()
	// ...
	//
	var latlngOrigin = { latitude: 47.607957, longitude: -122.33315 };
	var latlngDest   = { latitude: 47.624446, longitude: -122.347527};
	App.getShortestPath(latlngOrigin, latlngDest)

	
}


