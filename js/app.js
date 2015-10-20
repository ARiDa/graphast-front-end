
var App = {};

(function($){
	var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

	App = {
	
		getShortestPath: function(latlngOrigin, latlngDest) {
			var url = SHORTEST_PATH_URL + latlngOrigin[0] + "/" + latlngOrigin[1] + "/" + latlngDest[0] + "/" + latlngOrigin[1];
			$.get(url, function(data){
				data.geometry = addGeometry(data.path.length);
				console.log(data);
				GraphastMap.addPath(data);
			})
		}
	}
})($)

function addGeometry(n) {
	var start = [10, 20];
	var res = [];
	var momentum = [3, 3];

	for (var i = 0; i < 300; i++) {
	    start[0] += momentum[0];
	    start[1] += momentum[1];
	    if (start[1] > 60 || start[1] < -60) momentum[1] *= -1;
	    if (start[0] > 170 || start[0] < -170) momentum[0] *= -1;
	    res.push(start.slice());
	}

	return res;
}

window.onload = function() {
	// load map
	mapInit()
	// load admin screen
	adminInit()
	// ...
	var latlngOrigin = [43.7294668047756,7.413772473047058]
	var latlngDest = [43.73079058671274,7.415815422292399]
	App.getShortestPath(latlngOrigin, latlngDest)

	
}


