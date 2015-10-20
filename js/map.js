
function mapInit() {

    var ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';
    var MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN;

    L.mapbox.accessToken = ACCESS_TOKEN;

    var map = L.mapbox.map('Map', 'mapbox.outdoors', {zoomControl: false})
    new L.Control.Zoom({position: 'bottomleft'}).addTo(map)
    map.setView([-11.505, -41.09], 4)
    

    var marker = L.marker([-11.505, -41.09], {
        icon: L.mapbox.marker.icon({
        	'marker-size': 'large',
           	'marker-symbol': 'bus',
          	'marker-color': '#f86767'
        })
    });

    var t = -41.09;
    var t2 = -11.505
    window.setInterval(function() {
        // Making a lissajous curve just for fun.
        // Create your own animated path here.
        marker.setLatLng(L.latLng(
            t2 * 1.1,
            t  * 1.1));
        t  += 0.25;
        t2 += 0.25;
    }, 1000);

    marker.addTo(map);

    // Add a new line to the map with no points.
    var polyline = L.polyline([]).addTo(map);

    // Keep a tally of how many points we've added to the map.
    var pointsAdded = 0;

    // Start drawing the polyline.
    add();

    function add() {

        // `addLatLng` takes a new latLng coordinate and puts it at the end of the
        // line. You optionally pull points from your data or generate them. Here
        // we make a sine wave with some math.
        polyline.addLatLng(
            L.latLng(
                Math.cos(pointsAdded / 20) * -10,
                pointsAdded*0.25 - 70));

        // Pan the map along with where the line is being added.
        // map.setView([0, pointsAdded], 3);

        // Continue to draw and pan the map by calling `add()`
        // until `pointsAdded` reaches 360.
        if (++pointsAdded < 360) window.setTimeout(add, 100);
    }

    var GraphastMap = {
    	addPath: {},
    	addPoint: {}
    }

}




