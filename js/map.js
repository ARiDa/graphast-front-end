var GraphastMap = {};

function mapInit() {

    var ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';
    var MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN;

    L.mapbox.accessToken = ACCESS_TOKEN;

    var map = L.mapbox.map('Map', 'mapbox.light', {zoomControl: false})
    new L.Control.Zoom({position: 'bottomleft'}).addTo(map)

    // var colors = "#ffffb2 #fecc5c #fd8d3c #f03b20 #bd0026".split(" ");
    var colors = "#99d8c9 #66c2a4 #41ae76 #238b45 #006d2c #00441b".split(" ");
    var speed  = [1, 10, 5, 2];

    GraphastMap = {
    	addPath: function(path) {
           var origin = path.geometry[0]; 
           
           // var marker = this.addMarker(origin);
           var line = L.polyline(path.geometry);
           var markers = [];

            map.fitBounds(line.getBounds());

           for (var i=0; i < path.geometry.length-1; i++) {
                var j = i+1;
                
                var geoOrigin = path.geometry[i];
                var geoDest = path.geometry[j];

                var polyline = L.polyline([geoOrigin, geoDest], {color: colors[Math.floor((Math.random() * 5) + 0)]}).addTo(map);

           }

            var durationTime = _.reduce(path.path, function(memo, p){ return memo + p.distance}, 0);
            var durationlabel = L.divIcon({className: '', html: '<div class="travelduration">'+durationTime+' meters</strong>'});

            var middlepos=path.geometry[Math.round(path.geometry.length/2)];

            L.marker([middlepos[0],middlepos[1]], {icon: durationlabel})
             .addTo(map);



           var j = 1;
           var totalTimePerPoint = 10000/path.geometry.length;

           window.setTimeout(function(){$('path').css('stroke-dashoffset',0)},10);

            tick();

           function tick() {
                    var animatedMarker = L.animatedMarker(line.getLatLngs(), {
                    distance: _.map(path.geometry, function(d) { return Math.floor((Math.random() * 200) + 1000)}),
                    // ms
                    interval: _.map(path.geometry, function(d) { return Math.floor((Math.random() * 2) + 10)*50}),
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'bus',
                        'marker-color': '#30a07A'
                    }),
                    autoStart: true,
                    onEnd: function() {
                        $(this._shadow).fadeOut();
                        $(this._icon).fadeOut(3000, function(){
                          map.removeLayer(this);
                        });
                        tick();
                    }
            }).addTo(map);

            // map.addLayer(animatedMarker);
            // animatedMarker.start();
           }
        },
    	addPoint: {},
        addMarker: function(arrayLatLng) {
            var marker = L.marker(arrayLatLng, {
                icon: L.mapbox.marker.icon({
                    'marker-size': 'large',
                    'marker-symbol': 'bus',
                    'marker-color': '#30a07A'
                })
            });
            marker.addTo(map);

            return marker;
        }
    }

}




