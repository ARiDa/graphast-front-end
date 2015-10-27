var GraphastMap = {};

function mapInit() {
    var SHORTEST_PATH_URL         = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";
    var SHORTEST_A_STAR_PATH_URL  = "http://demo.graphast.org:8080/graphast-ws/shortestpath/a*/";
    var ACCESS_TOKEN              = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

    L.mapbox.accessToken = ACCESS_TOKEN;

    var map = L.mapbox.map('Map', 'mapbox.light', {zoomControl: false})
    new L.Control.Zoom({position: 'bottomleft'}).addTo(map)

    // var colors = "#ffffb2 #fecc5c #fd8d3c #f03b20 #bd0026".split(" ");
    var colors = "#fb9a99 #fdbf6f #ff7f00 #cab2d6 #e31a1c".split(" ");

    function style(color) {
        return function(feature) {
            return {
                color: color,
                'stroke-width': 10
            };
        }
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
        pathLayer: [],
        animatedMarker: [],
        labelMarker: [],


        getColor: function(d) {
            return colors[this.pathLayer.length];
            return d > 3000 ? '#800026' :
                d > 2000  ? '#BD0026' :
                    d > 1000  ? '#E31A1C' :
                        d > 500  ? '#FC4E2A' :
                            d > 300   ? '#FD8D3C' :
                                d > 200   ? '#FEB24C' :
                                    d > 100   ? '#FED976' :
                                        '#FFEDA0';
        },

        addOriginDestinationMarker: function(origin, destination) {
            this.originMarker      = this.addOriginMarker(L.latLng(origin.latitude, origin.longitude));
            this.destinationMarker = this.addDestinationMarker(L.latLng(destination.latitude, destination.longitude));

            this.originMarker.addTo(map);
            this.destinationMarker.addTo(map);
        },

        fitBounds: function(geom){
            map.fitBounds(geom.getBounds(),{'padding':[100,100]});
        },

        addPath: function(path, label) {
//            this.cleanPath();
            // this.cleanMap();
            path.path.reverse();

            path.totalDistance = (path.totalCost/1000/1000).toFixed(1);
            var features = this.createPolylines(path);
            var polyline = this.createPolyline(path);
            var points   = this.createPoints(path);

            var color = this.getColor();
            console.log(label + "-" + color);
            var layer = L.geoJson(
                features, {
                    style: style(color),
                    onEachFeature: onEachFeature
                }).addTo(map);

            layer._layerIdx = this.pathLayer.length;

            this.pathLayer.push(layer);

            this.updateLegend(label, color);

//            L.geoJson(points, {
//                 onEachFeature: function(feature, layer){
//                     // var layer = e.t
//                     console.log(feature);
//                     layer.bindPopup(feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0],
//                         {closeOnClick: false});
//                 }
//            }).addTo(map);

            this.fitBounds(polyline);

            var durationlabel = L.divIcon({className: '', html: '<div class="travelduration" style="color:'+color+';border-color:'+color+';">'+path.totalDistance+' km</strong>'});

            var middlepos=polyline._latlngs[Math.round(polyline._latlngs.length/2)];
            this.labelMarker.push(L.marker(middlepos, {icon: durationlabel})
                .addTo(map));

            // var j = 1;
            // var totalTimePerPoint = 10000/path.geometry.length;

            window.setTimeout(function(){$('path').css('stroke-dashoffset',0)},10);

            tick(this);
            function tick(e) {
                var animatedMarker = L.animatedMarker(polyline.getLatLngs(), {
                    distance: 20000,
                    // ms
                    interval: 1000*5,
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'bus',
                        'marker-color': color
                    }),
                    autoStart: true,
                    clickable: false,
                    zIndexOffset: 100,
                    onEnd: function() {
                        $(this._shadow).fadeOut();
                        $(this._icon).fadeOut(3000, function(){
//                            tick(e);
                        });
                    }
                }).addTo(map);

                // map.addLayer(animatedMarker);
                // animatedMarker.start();
                animatedMarker.on('click', function(t){
                    this.start();
                });

                e.animatedMarker.push(animatedMarker);
            }
        },

        addPoint: {},

        updateLegend: function(label, color) {

            var jDoc = $("div.info.legend");
            if (jDoc.length == 0) {
                this.createLegend();
                jDoc = $("div.info.legend");
            }
            var id = label.replace(/ /g, '-');

            if (jDoc.find("#"+id).length == 0) {
                var html = '<i id="'+id+'" style="background:'+color+'"></i> ' + label + '<br><br>';
                jDoc.append(html);
            } else {
                jDoc.find("#"+id).css('background', color)
            }

        },

        createLegend: function() {
            var legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend')
//                    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//                    labels = [];
//
//                // loop through our density intervals and generate a label with a colored square for each interval
//                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML += 'Routes <br><br>';
//                }

                return div;
            };

            legend.addTo(map);
        },

        getShortestPath: function(po, pd, weekday, hour, minutes) {
            var url = SHORTEST_PATH_URL + po.latitude + "/" + po.longitude + "/"
                + pd.latitude + "/" + pd.longitude + "/";

            if ( weekday && hour && minutes ) {
                url + weekday + "/" + hour + "/" + minutes + "/";
            }

            var that = this;
            this.destination = pd;
            this.origin = po;
            $.get(url, function(data){
                that.addOriginDestinationMarker(po,pd);
                that.addPath(data, "Dijkstra");
            })
        },

        getShortestPathAStart: function(po, pd, weekday, hour, minutes) {
            var url = SHORTEST_A_STAR_PATH_URL + po.latitude + "/" + po.longitude + "/"
                + pd.latitude + "/" + pd.longitude + "/";

            if ( weekday && hour && minutes ) {
                url + weekday + "/" + hour + "/" + minutes + "/";
            }

            var that = this;
            this.destination = pd;
            this.origin = po;
            $.get(url, function(data){
                that.addOriginDestinationMarker(po,pd);
                that.addPath(data, "A Star");
            })
        },

        addOriginMarker: function(latlng) {
            this.cleanOrigin();
            var that = this;
            return this.addMarker(latlng, '#30a07A', function(e) {
                var origin = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
                that.getShortestPath(origin, that.destination);
                that.getShortestPathAStart(origin, that.destination);
            });
        },

        addDestinationMarker: function(latlng) {
            this.cleanDestination();
            var that = this;
            return this.addMarker( latlng, '#D84027', function(e) {
                var destination = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
                that.getShortestPath(that.origin, destination);
                that.getShortestPathAStart(that.origin, destination);
            });
        },

        cleanPath: function() {
            this.cleanAnimatedMarker();
            // if (this.pathLayer) map.removeLayer(this.pathLayer);
            _.each(this.pathLayer, function(p){ map.removeLayer(p); })
            this.pathLayer = [];
            _.each(this.labelMarker, function(p){ map.removeLayer(p); })
            this.labelMarker = [];
            this.cleanAnimatedMarker();
        },

        cleanAnimatedMarker: function() {
            _.each(this.animatedMarker, function(p){ map.removeLayer(p); })
            this.animatedMarker = [];
        },

        cleanOrigin: function() {
            if (this.originMarker) map.removeLayer(this.originMarker);
        },

        cleanDestination: function() {
            if (this.destinationMarker) map.removeLayer(this.destinationMarker);
        },

        cleanMap: function() {
            this.cleanPath();
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
            var instructions = path.path;

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
            var instructions = path.path;

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
            var instructions = path.path;

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




