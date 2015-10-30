var GraphastMap = {};

function mapInit() {
    var BOUNDS_URL                = "http://demo.graphast.org:8080/graphast-ws/admin/bbox";
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
                'stroke-width': 10,
                className: "route"
            };
        }
    }


    function highlightFeature(e) {
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
        destination: { latitude: 47.624446, longitude: -122.347527},
        origin: { latitude: 47.607957, longitude: -122.33315 },
        originMarker: undefined,
        destinationMarker: undefined,
        pathLayer: [],
        bbLayer: undefined,
        animatedMarker: [],
        labelMarker: [],
        pathSettings: [],

        init: function() {
        	this.createLegend();
            this.addOriginDestinationMarker(this.origin, this.destination);
            this.centerMapBasedOnTheGraph();
        },

        updateMapPosition: function(bbox) {
            var bounds = [[bbox.minLatitude, bbox.minLongitude], [bbox.maxLatitude, bbox.maxLongitude]];
            
            // create an orange rectangle
            
            if (this.bbLayer) map.removeLayer(this.bbLayer)

            var rect = L.polygon([
                [bbox.minLatitude, bbox.minLongitude],
                [bbox.minLatitude, bbox.maxLongitude],
                [bbox.maxLatitude, bbox.maxLongitude],
                [bbox.maxLatitude, bbox.minLongitude],
                [bbox.minLatitude, bbox.minLongitude]
                ]);
            this.bbLayer = L.geoJson(rect.toGeoJSON(),
                {
                    style: function(feature){
                        return {
                          className: "bbox"
                        };
                    }
                }).addTo(map);

            map.fitBounds(bounds);


        },

        centerMapBasedOnTheGraph: function() {
            var that = this;
            $.get(BOUNDS_URL, function(bounds){
                that.updateMapPosition(bounds);
            });
        },

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

        formatCost: function(path) {
			return (path.totalCost / 1000 / 60).toFixed(1) + " min";
        },

        formatDistance: function(path) {
			return (path.totalDistance / 1000 / 1000 ).toFixed(1) + " km";
        },

        fitBounds: function(geom){
            map.fitBounds(geom.getBounds(),{'padding':[100,100]});
        },

        mapSpeed: function(speed) {
        	if (speed <= 4) return 1000;
        	if (speed <= 10) return 5000;
        	
        	return 8000;
        },

        computeSpeedVector: function(path) {
        	var geometry     = path.geometry;
            var instructions = path.path;

            var that = this;

            return _.map(instructions, function(inst){
            	var cost = inst.cost;
            	var distance = inst.distance;
            	var speed = distance / cost;
            	return that.mapSpeed(speed);
            });
        },

        addPath: function(path, label, timeInfo) {

            path.path.reverse();

            var costFormatted = this.formatCost(path);
            var distanceFormatted = this.formatDistance(path);

            var features = this.createPolylines(path);
            var polyline = this.createPolyline(path);
            var points   = this.createPoints(path);

            var speedVector = this.computeSpeedVector(path);

            var color = this.getColor();
            var layer = L.geoJson(
                features, {
                    style: style(color),
                    onEachFeature: onEachFeature
                }).addTo(map);

            layer._layerIdx = this.pathLayer.length;

            this.pathLayer.push(layer);

            var info = {
                cost: costFormatted, 
                distance: distanceFormatted,
                date: (timeInfo) ? timeInfo.year+"/"+timeInfo.month+"/"+timeInfo.day : "",
                timeInfo: (timeInfo) ? timeInfo.hours+":"+timeInfo.minutes : ""
            }

            this.updateLegend(label, color, timeInfo, info);

            this.fitBounds(polyline);

            var durationlabel = L.divIcon({className: '', html: '<div class="travelduration" style="color:'+color+';border-color:'+color+';">'+costFormatted+'</strong>'});

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
                    interval: 5000,
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'car',
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

        updateLegend: function(label, color, timeInfo, info) {

            var jDoc = $("#routes");
            if (jDoc.length == 0) {
                this.createLegend();
                jDoc = $("#routes");
            }
            var id = this.createLabelID(label, timeInfo);

            if ( !this.labelExists(label, timeInfo) ) {
                var html = '<tr id="'+id+'">' +
                			'<td><i  style="background:'+color+'"></i></td>'+
                			'<td>' + label + '</td>' +
                            '<td>' + info.date + '</td>' +
                            '<td>' + info.timeInfo + '</td>' +
                			'<td>' + info.cost + '</td>' +
                			'<td>' + info.distance + '</td> ' +
                			'<td></td> ' +
                			'</tr>';
                jDoc.append(html);
            } else {
                jDoc.find("#"+id).css('background', color)
            }

        },

        createLabelID: function(label, timeInfo){
            var l = label.toLowerCase().replace(/ /g, '-');
            if (timeInfo && timeInfo.year)
                l = l + timeInfo.year+""+timeInfo.month+""+timeInfo.day+""+timeInfo.hours+""+timeInfo.minutes;

            return l;
        },

        labelExists: function(label, timeInfo) {
            var id = this.createLabelID(label, timeInfo);

            return  $("#"+id).length > 0;
        },

        createLegend: function() {
            var legend = L.control({position: 'topright'});

            var html = '<thead><tr><td></td>'+
			'<td>Algorithm</td>' +
            '<td>Date</td> ' +
            '<td>Time</td> ' +
			'<td>ETA</td>' +
			'<td>Distance</td> ' +
			'<td></td> ' +
			'</tr></thead>';

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend')
                    div.innerHTML += '<h3>Routes</h3><table id="routes">'+html+'</table>';

                return div;
            };

            legend.addTo(map);
        },

        cleanLegend: function() {
        	$(".info.legend tbody").empty();
        },

        getShortestPath: function(label, timeInfo) {
            var method = "dijstra";
            this._getShortestPath(SHORTEST_PATH_URL, method, label, timeInfo);
        },

        getShortestPathAStart: function(label, timeInfo) {
            var method = "a-star";
            this._getShortestPath(SHORTEST_A_STAR_PATH_URL, method, label, timeInfo);
        },

        runPathSettings: function() {
            var that = this;
            
            _.each(this.pathSettings, function(p) {
                if (p.method == "dijstra") {
                    that.getShortestPath(p.label, p.timeInfo);
                    return
                }
                if (p.method == "a-star") {
                    that.getShortestPathAStart(p.label, p.timeInfo);
                }
            })
        },

        _getShortestPath: function(url, method, label, timeInfo) {
            
            if (this.labelExists(label, timeInfo)) {
                return;
            }

            if (_.where(this.pathSettings, {label: label, timeInfo: timeInfo}).length == 0 ){
                this.pathSettings.push({
                    method: method, 
                    timeInfo: timeInfo, 
                    label: label
                });
            }
            
            var po = this.origin,
                pd = this.destination;

            
            var url = url + po.latitude + "/" + po.longitude + "/" + pd.latitude + "/" + pd.longitude + "/";

            if ( timeInfo && timeInfo.weekday >= 0 && timeInfo.hours >=0 && timeInfo.minutes >=0 ) {
                url = url + timeInfo.weekday + "/" + timeInfo.hours + "/" + timeInfo.minutes + "/";
            }

            var that = this;
            $.get(url, function(data){
                that.addPath(data, label, timeInfo);
            })
        },

        addOriginMarker: function(latlng) {
            this.cleanOrigin();
            var that = this;
            return this.addMarker(latlng, '#30a07A', function(e) {
                that.origin = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
            });
        },

        addDestinationMarker: function(latlng) {
            this.cleanDestination();
            var that = this;
            return this.addMarker( latlng, '#D84027', function(e) {
                that.destination = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
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
            this.cleanLabels();
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

        cleanLabels: function() {
            this.cleanLegend();
        },

        cleanMap: function() {
            this.cleanPath();
            this.pathSettings = [];
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
            marker.on('dragend', function(e){
                callbackDragEnd(e);
                that.runPathSettings();
            });

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




