var GraphastMap = {};

function mapInit() {
    var SHORTEST_PATH_URL = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";
    var ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';
    var MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN;

    L.mapbox.accessToken = ACCESS_TOKEN;

    var map = L.mapbox.map('Map', 'mapbox.light', {zoomControl: false})
    new L.Control.Zoom({position: 'bottomleft'}).addTo(map)

    // var colors = "#ffffb2 #fecc5c #fd8d3c #f03b20 #bd0026".split(" ");
    var colors = "#99d8c9 #66c2a4 #41ae76 #238b45 #006d2c #00441b".split(" ");
    var speed  = [1, 10, 5, 2];

    function style(feature) {
        
        return {
            color: getColor(feature.properties.speed),
            'stroke-width': 10
        };
    }

    function getColor(d) {
        return '#30a07A';
        return d > 3000 ? '#800026' :
               d > 2000  ? '#BD0026' :
               d > 1000  ? '#E31A1C' :
               d > 500  ? '#FC4E2A' :
               d > 300   ? '#FD8D3C' :
               d > 200   ? '#FEB24C' :
               d > 100   ? '#FED976' :
                          '#FFEDA0';
    }

    function highlightFeature(e) {
        console.log("adada");
        var layer = e.target;

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    function onEachFeature(feature, layer) {
        (function(layer, properties) {
            layer.on('mouseover', highlightFeature);
        })(layer, feature.properties);
    }

    GraphastMap = {
        destination: {},
        origin: {},
        originMarker: undefined,
        destinationMarker: undefined,
        pathLayer: undefined,
        animatedMarker: undefined,
        labelMarker: undefined,

    	addPath: function(origin, destination, path) {
            this.cleanPath();
            path.instructions.reverse();
            path.totalDistance = (path.totalCost/1000/1000).toFixed(1);
            var features = this.createPolylines(path);
            var polyline = this.createPolyline(path);
            var points = this.createPoints(path);

           this.originMarker      = this.addOriginMarker(L.latLng(origin.latitude, origin.longitude));
           this.destinationMarker = this.addDestinationMarker(L.latLng(destination.latitude, destination.longitude));
            
            this.originMarker.addTo(map);
            this.destinationMarker.addTo(map);

            this.pathLayer = L.geoJson(
                features, {
                    style, style,
                    onEachFeature: onEachFeature
            }).addTo(map);

            // L.geoJson(points, {
            //     onEachFeature: function(feature, layer){
            //         // var layer = e.t
            //         console.log(feature);
            //         layer.bindPopup(feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0],
            //             {closeOnClick: false});
            //     }
            // }).addTo(map);

            map.fitBounds(polyline.getBounds());

            var durationlabel = L.divIcon({className: '', html: '<div class="travelduration">'+path.totalDistance+' km</strong>'});

            var middlepos=polyline._latlngs[Math.round(polyline._latlngs.length/2)];
            this.labelMarker = L.marker(middlepos, {icon: durationlabel})
             .addTo(map);

           // var j = 1;
           // var totalTimePerPoint = 10000/path.geometry.length;

           window.setTimeout(function(){$('path').css('stroke-dashoffset',0)},10);

            tick(this);
           function tick(e) {
                    e.animatedMarker = L.animatedMarker(polyline.getLatLngs(), {
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
                          // map.removeLayer(this);
                        });
                    }
            }).addTo(map);

            // map.addLayer(animatedMarker);
            // animatedMarker.start();
           }
        },
    	addPoint: {},

        getShortestPath: function(po, pd) {
            var url = SHORTEST_PATH_URL + po.latitude + "/" + po.longitude + "/" 
                                        + pd.latitude + "/" + pd.longitude + "/";
            var that = this;
            this.destination = pd;
            this.origin = po;
            $.get(url, function(data){
                that.addPath(po, pd, data);
            })
        },

        addOriginMarker: function(latlng) {
            this.cleanOrigin();
            var that = this;
            return this.addMarker(latlng, '#30a07A', function(e) {
                var origin = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
                that.getShortestPath(origin, that.destination);
            });
        },

        addDestinationMarker: function(latlng) {
            this.cleanDestination();
            var that = this;
            return this.addMarker( latlng, '#D84027', function(e) {
                var destination = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
                that.getShortestPath(that.origin, destination);
            });
        },

        cleanPath: function() {
            if (this.animatedMarker) map.removeLayer(this.animatedMarker);
            if (this.pathLayer) map.removeLayer(this.pathLayer);
            if (this.labelMarker) map.removeLayer(this.labelMarker);
        },

        cleanOrigin: function() {
            if (this.originMarker) map.removeLayer(this.originMarker);
        },

        cleanDestination: function() {
            if (this.destinationMarker) map.removeLayer(this.destinationMarker);
        },

        addMarker: function(arrayLatLng, color, callbackDragEnd) {
            var that = this;
            var marker = L.marker(arrayLatLng, {
                    draggable: true,
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-color': color
                    })
                });

            marker.on('dragstart', function() {
                that.cleanPath();
            })
            marker.on('dragend', callbackDragEnd);

            return marker;
        },
        createPolylines: function(path) {
            var geometry     = path.geometry;
            var instructions = path.instructions;

            var polylines = _.map(instructions, function(inst){
                var startGeom = inst.startGeometry;
                var endGeom   = inst.endGeometry;

                var points  = geometry.slice(startGeom, endGeom + 1);
                var linestring = _.map(points, function(point) {
                    return [point.longitude, point.latitude];
                });
                
                var properties = inst;
                properties.speed = (inst.distance/1000) / (inst.cost/1000/60/60);
                
                return {
                    type: "Feature",
                    properties: properties,
                    geometry: {
                        type: "LineString",
                        coordinates: linestring
                    }
                }
            });

            return { type: "FeatureCollection", features: polylines }
        },

        createPoints: function(path) {
            var geometry   = path.geometry;
            var instructions = path.instructions;

            var features = [];

            _.each(instructions, function(inst){
                var startGeom = inst.startGeometry;
                var endGeom   = inst.endGeometry;
                var points  = geometry.slice(startGeom, endGeom + 1);
                _.each(points, function(point) {
                    features.push({
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Point",
                            coordinates: [point.longitude, point.latitude]
                        }
                    });
                });
            }); 

            return { type: "FeatureCollection", features: features }
        },

        createPolyline: function(path) {
            var geometry   = path.geometry;
            var instructions = path.instructions;

            var polyline = [];

            _.each(instructions, function(inst){
                var startGeom = inst.startGeometry;
                var endGeom   = inst.endGeometry;
                var points  = geometry.slice(startGeom, endGeom + 1);
                _.each(points, function(point) {
                    polyline.push(L.latLng(point.latitude, point.longitude));
                });
            });

            return L.polyline(polyline, {color: colors[Math.floor((Math.random() * 5) + 0)]});
        }
    }

}




