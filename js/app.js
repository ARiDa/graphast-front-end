
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
				App.updateAppDialogs();
				GraphastMap.cleanMap();
				GraphastMap.centerMapBasedOnTheGraph();
			}).error(function(err) {
				alert('error loading app graph ' + name)
			})
		},

		updateAppDialogs: function() {
			$.getJSON('http://demo.graphast.org:8080/graphast-ws/graph/query-services', function(data) {
				//
				var knn      = data.indexOf('knn') >= 0
				var dijkstra = data.indexOf('dijkstra') >= 0
				var astar    = data.indexOf('a*') >= 0
				var osr      = data.indexOf('osr') >= 0
				var knn = data.indexOf('knn') >= 0
				//
				$('#app-menu button.shortest-path').hide()
				$('#app-menu button.knn').hide()
				$('#app-menu button.osr').hide()
				//
				$('.dialog algorithms i.dijkstra').show()
				$('.dialog algorithms i.astar').show()
				//
				$('.dialog algorithms i.dijkstra').removeClass('selected')
				$('.dialog algorithms i.astar').removeClass('selected')
				//
				if (dijkstra || astar)
					$('#app-menu button.shortest-path').show()
				if (osr)
					$('#app-menu button.osr').show()
				if (knn)
					$('#app-menu button.knn').show()
				//
				if (dijkstra && !astar) {
					$('.dialog algorithms i.dijkstra').addClass('selected')
					$('.dialog algorithms i.astar').hide()
				}
				if (astar && !dijkstra) {
					$('.dialog algorithms i.astar').addClass('selected')
					$('.dialog algorithms i.dijkstra').hide()
				}
			}).error(function(err) {
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
	App.updateAppDialogs();
	GraphastMap.init();
	// ...
	//
	createLogin();
}


