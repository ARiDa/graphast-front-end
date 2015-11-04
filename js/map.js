var GraphastMap = {};

function mapInit() {
    var BOUNDS_URL                = "http://demo.graphast.org:8080/graphast-ws/graph/bbox";
    
    var SHORTEST_PATH_URL         = "http://demo.graphast.org:8080/graphast-ws/shortestpath/";

    // http://demo.graphast.org:8080/graphast-ws/osr/43.726669/7.417574/43.749366/7.436328/8/0/6,161/
    var OSR_URL                   = "http://demo.graphast.org:8080/graphast-ws/osr/";
    
    var SHORTEST_A_STAR_PATH_URL  = "http://demo.graphast.org:8080/graphast-ws/shortestpath/a*/";
    
    var ACCESS_TOKEN              = 'pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

    L.mapbox.accessToken = ACCESS_TOKEN;

    var map = L.mapbox.map('Map', 'mapbox.light', {zoomControl: false})
    new L.Control.Zoom({position: 'bottomright'}).addTo(map)

    // var colors = "#ffffb2 #fecc5c #fd8d3c #f03b20 #bd0026".split(" ");
    var colors = "#393b79 #3182bd #b5cf6b #637939 #d62728 #e7ba52 #843c39 #d6616b #e7969c #a55194".split(" ");

    

    function style(color, id) {
        return function(feature) {
            return {
                color: color,
                'stroke-width': 10,
                className: "route "+id
            };
        }
    }


    function highlightFeature(e) {
        var layer = e.target;
        console.log(e);
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
        poisMarkers: [],
        pathSettings: [],
        maxCost: 0,

        init: function() {

        	this.createLegend();
            this.centerMapBasedOnTheGraph();
            
        },

        centroid: function(bbox) {
            var avgLat = (bbox.minLatitude + bbox.maxLatitude) / 2;
            var avgLng = (bbox.minLongitude + bbox.maxLongitude) / 2;
            var l = (bbox.maxLongitude - bbox.minLongitude) / 16;

            this.origin = {latitude: avgLat, longitude: Math.max(avgLng - l, bbox.minLongitude)};
            this.destination = {latitude: avgLat , longitude: Math.min(avgLng + l, bbox.maxLongitude) };

            this.addOriginDestinationMarker(this.origin, this.destination);
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

        showCityName: function(city) {
             
        },

        centerMapBasedOnTheGraph: function() {
            var that = this;
            $.get(BOUNDS_URL, function(bounds){
                that.updateMapPosition(bounds);
                that.centroid(bounds);
                that.showCityName();
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
            this.cleanOrigin();
            this.cleanDestination();

            this.originMarker      = this.addOriginMarker(L.latLng(origin.latitude, origin.longitude));
            this.destinationMarker = this.addDestinationMarker(L.latLng(destination.latitude, destination.longitude));


            this.originMarker.addTo(map);
            this.destinationMarker.addTo(map);
        },

        formatCost: function(path, timeInfo) {
			return (path.totalCost / 1000 / 60).toFixed(0) + " min";
        },

        formatETA: function(path, timeInfo) {
            var d  = new Date(timeInfo.year, timeInfo.month, timeInfo.day, timeInfo.hours, timeInfo.minutes, 0, 0);
            var tt = (path.totalCost / 1000 / 60).toFixed(0)

            var eta = new Date(d.getTime() + tt*60000);
            return eta.getHours() + ":" + eta.getMinutes();
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

        n: function(n){
            return n > 9 ? "" + n : "0" + n;
        },

        

        checkOverlap: function(id) {
            var idDuration = "duration-"+id
            var rect = document.getElementById(idDuration).getBoundingClientRect();
            var els = $(".travelduration").not("#"+idDuration);

            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                var id2 = $(el).attr("id");
                var rect2 = document.getElementById(id2).getBoundingClientRect();
                if ( (rect2.left >= rect.left && rect2.left <= rect.right) || (rect2.right >= rect.left && rect2.right <= rect.right) ) {
                    if ( (rect2.bottom >= rect.top && rect2.bottom <= rect.bottom) || (rect2.top >= rect.top && rect2.top <= rect.bottom) ) {            
                        return true;
                    }
                }
            }

            els = $(".poi-marker");

            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                var cls = $(el).attr("class");
                var rect2 = document.getElementsByClassName(cls)[0].getBoundingClientRect();
                if ( (rect2.left >= rect.left && rect2.left <= rect.right) || (rect2.right >= rect.left && rect2.right <= rect.right) ) {
                    if ( (rect2.bottom >= rect.top && rect2.bottom <= rect.bottom) || (rect2.top >= rect.top && rect2.top <= rect.bottom) ) {            
                        return true;
                    }
                }
            }

            return false;
        },

        addDurationLabel: function(id, polyline, color, costFormatted) {
            var durationlabel = L.divIcon({className: '', html: '<div id="duration-'+id+'" class="travelduration" style="color:'+color+';border-color:'+color+';">'+costFormatted+'</strong>'});

            var middlepos=polyline._latlngs[Math.round(polyline._latlngs.length/2)];
            var m = L.marker(middlepos, {icon: durationlabel}).addTo(map);
            var i = 0;
            var aux = this.checkOverlap(id);

            while (aux == true && i < polyline._latlngs.length) {
                map.removeLayer(m);
                middlepos = polyline._latlngs[i];
                m = L.marker(middlepos, {icon: durationlabel}).addTo(map);
                aux = this.checkOverlap(id);

                i++;
            }

            this.labelMarker.push(m);
        },

        addPath: function(path, label, timeInfo) {

            // path.path.reverse();

            var costFormatted = this.formatCost(path);
            var ETA = this.formatETA(path, timeInfo);
            var distanceFormatted = this.formatDistance(path);

            var features = this.createPolylines(path);
            var polyline = this.createPolyline(path);
            var points   = this.createPoints(path);

            if (this.maxCost < path.totalCost/1000) {
                this.maxCost = path.totalCost/1000;
            }

            var speedVector = this.computeSpeedVector(path);

            var id = this.createLabelID(label, timeInfo);

            var color = this.getColor();
            var layer = L.geoJson(
                features, {
                    style: style(color, id),
                    onEachFeature: onEachFeature
                }).addTo(map);

            layer._layerIdx = this.pathLayer.length;

            this.pathLayer.push(layer);

            this.addDurationLabel(id, polyline, color, costFormatted);

            var info = {
                cost: ETA, 
                distance: distanceFormatted,
                date: (timeInfo) ? this.n(timeInfo.day)+"-"+this.n(timeInfo.month)+"-"+timeInfo.year : "",
                timeInfo: (timeInfo) ? this.n(timeInfo.hours)+":"+this.n(timeInfo.minutes) : ""
            }

            this.updateLegend(label, color, timeInfo, info);

            this.fitBounds(polyline);





            // var j = 1;
            // var totalTimePerPoint = 10000/path.geometry.length;

            window.setTimeout(function(){$('path').css('stroke-dashoffset',0)},10);

            tick(this);
            function tick(e) {
                
                var f1 = d3.scale.linear().domain([0, 50]).range([20000, 50000]);
                var f2 = d3.scale
                            .linear()
                            .domain([10, 3600000*24])
                            .range([0.5, 1.0]);

                var animatedMarker = L.animatedMarker(polyline.getLatLngs(), {
                    distance: 300,
                    // ms
                    interval: (f2(path.totalCost)-1 + 0.5)*200 + 50,
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

                $(animatedMarker._icon).addClass("animated-marker " + "animated-"+id);

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
                var html = $('<tr id="'+id+'">' +
                			'<td><i  style="background:'+color+'"></i></td>'+
                			'<td>' + label + '</td>' +
                            '<td>' + info.date + '</td>' +
                            '<td>' + info.timeInfo + '</td>' +
                			'<td>' + info.cost + '</td>' +
                			'<td>' + info.distance + '</td> ' +
                			'<td></td> ' +
                			'</tr>');

                html.on('mouseover', function(e){
                    // console.log($(".route").not( "."+id ));
                    $(".route").not( "."+id ).css("stroke-opacity", "0.0");
                    $(".travelduration").not( "#duration-"+id).hide();
                    $(".animated-marker").not( ".animated-"+id).hide();
                    $(".poi-marker").not(".poi-"+id).hide();
                })
                html.on('mouseout', function(e){
                    $(".route").not( "."+id ).css("stroke-opacity", "1.0");
                    $(".travelduration").not("#duration-"+id).show();
                    $(".animated-marker").not(".animated-"+id).show();
                    $(".poi-marker").not(".poi-"+id).show();
                })

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
            var legend = L.control({position: 'bottomleft'});

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

        getOSR: function(label, timeInfo, categories) {
            var that = this;

            var po = this.origin,
                pd = this.destination;

            var url = OSR_URL + [po.latitude,po.longitude,pd.latitude,pd.longitude,timeInfo.hours, timeInfo.minutes].join("/");

            url  = url + "/" + categories.join(",") + "/"



            if (this.labelExists(label, timeInfo)) {
                return;
            }

            if (_.where(this.pathSettings, {label: label, timeInfo: timeInfo}).length == 0 ){
                this.pathSettings.push({
                    method: "osr", 
                    timeInfo: timeInfo, 
                    label: label,
                    categories: categories
                });
            }

            var id = this.createLabelID(label, timeInfo);

            $.get(url, function(data) {
                if (data) {
                    that.addListOfPois(data.listOfPoIs, id);
                    that.addPath(data, label, timeInfo);                    
                }

            })
        },

        addPoi: function(poi, id) {
            var color = GraphastMap.getColor();
            var i = (POI_CATEGORIES[poi.poiCategory.id]) ? POI_CATEGORIES[poi.poiCategory.id].icon : "marker";
            var icon = L.mapbox.marker.icon({ 
                'marker-size': 'large', 
                'marker-color': color, 
                'marker-symbol': i,
                'marker-fill': "rgba(255,255,255, 0.3)"
            })

            var marker = L.marker([poi.latitude, poi.longitude], {
                icon: icon
            })
            .bindPopup(poi.label)
            .addTo(map);

            $(marker._icon).addClass("poi-marker poi-"+id);

            return marker;
        },

        addListOfPois: function(pois, id) {
            var that = this;
            _.each(pois, function(p) { that.poisMarkers.push( that.addPoi(p, id) ) });
        },

        getShortestPath: function(label, timeInfo) {
            var method = "dijkstra";
            this._getShortestPath(SHORTEST_PATH_URL, method, label, timeInfo);
        },

        getShortestPathAStart: function(label, timeInfo) {
            var method = "a-star";
            this._getShortestPath(SHORTEST_A_STAR_PATH_URL, method, label, timeInfo);
        },

        runPathSettings: function() {
            var that = this;
            
            _.each(this.pathSettings, function(p) {
                if (p.method == "dijkstra") {
                    that.getShortestPath(p.label, p.timeInfo);
                    return
                }
                if (p.method == "a-star") {
                    that.getShortestPathAStart(p.label, p.timeInfo);
                    return
                }
                if (p.method == "osr") {
                    that.getOSR(p.label, p.timeInfo, p.categories);
                    return
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

            
            var url = url + parseFloat(po.latitude) + "/" + parseFloat(po.longitude) + "/" + parseFloat(pd.latitude) + "/" + parseFloat(pd.longitude) + "/";

            if ( timeInfo && timeInfo.weekday >= 0 && timeInfo.hours >=0 && timeInfo.minutes >=0 ) {
                url = url + timeInfo.weekday + "/" + timeInfo.hours + "/" + timeInfo.minutes + "/";
            }

            var that = this;
            $.get(url, function(data){
                if (data) {
                    that.addPath(data, label, timeInfo);    
                }
                
            })
        },

        addOriginMarker: function(latlng) {
            this.cleanOrigin();
            var that = this;
            var icon = L.mapbox.marker.icon({ 
                'marker-size': 'large', 
                'marker-color': '#30a07A', 
                'marker-symbol': "pitch", 
                'marker-fill': "#b36"
            });

            var aux = $('input[name="origin"]');
            if (aux.length > 0) {
                aux.val(that.origin.latitude.toFixed(6)+","+that.origin.longitude.toFixed(6));
            }

            return this.addMarker(latlng, '#30a07A', function(e) {
                that.origin = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
                var aux = $('input[name="origin"]');
                if (aux.length > 0) {
                    aux.val(that.origin.latitude.toFixed(6)+","+that.origin.longitude.toFixed(6));
                }

            }, icon);
        },

        addDestinationMarker: function(latlng) {
            this.cleanDestination();
            var that = this;
            var icon = L.mapbox.marker.icon({ 
                'marker-size': 'large', 
                'marker-color': '#D84027', 
                'marker-symbol': "embassy",
                'marker-fill': "rgba(255,255,255, 0.3)"
            });

            var aux = $('input[name="destination"]');
            if (aux.length > 0) {
                aux.val(that.destination.latitude.toFixed(6)+","+that.destination.longitude.toFixed(6));
            }

            return this.addMarker( latlng, '#D84027', function(e) {
                that.destination = {latitude: e.target._latlng.lat, longitude: e.target._latlng.lng};
                var aux = $('input[name="destination"]');
                if (aux.length > 0) {
                    aux.val(that.destination.latitude.toFixed(6)+","+that.destination.longitude.toFixed(6));
                }
            }, icon);
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
            this.cleanPoisMarkers();
            this.pathSettings = [];
        },

        cleanPoisMarkers: function() {
            _.each(this.poisMarkers, function(p) { map.removeLayer(p)});
            this.poisMarkers = [];
        },

        addMarker: function(arrayLatLng, color, callbackDragEnd, icon) {
            var that = this;

            var markerIcon =   icon || L.mapbox.marker.icon({'marker-size': 'large', 'marker-color': color })

            var marker = L.marker(arrayLatLng, {
                draggable: true,
                icon: markerIcon
            });

            marker.on('dragstart', function() {
                that.cleanPath();
                that.cleanPoisMarkers();
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

                var points  = geometry.slice(startGeom, endGeom+1);
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
            
            var aux = _.reduce(polylines, function(memo, num){ 
                return memo + num.geometry.coordinates.length; 
            }, 0) - (instructions.length - 1);
            if( geometry.length != aux ) {
                console.warn("Wrong geometry: "+ geometry.length + " (Geometries) != " + aux + " (LineStrings)");
            }
            
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




