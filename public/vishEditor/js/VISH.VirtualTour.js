VISH.VirtualTour = (function(V,$,undefined){

	var initialized = false;

	var virtualTours;
	// myVT = virtualTours['virtualTourId']

	//Loading GoogleMaps library asynchronously
	var gMlLoaded = false;
	var gMlLoading = false;

	//Keep last increase param to manage resizing
	var lastIncrease;


	var init = function(){
		if(!initialized){
			initialized = true;
			virtualTours = new Array();
			_loadEvents();
		}
	};

	var _loadEvents = function(){
		V.EventsNotifier.registerCallback(V.Constant.Event.onSubslideClosed, function(params){
			var subslideId = params.slideId;
			var slideset =$($("#" + subslideId).parent());
			if($(slideset).attr("type")==V.Constant.VTOUR){
				var vTourId = $(slideset).attr("id");
				_onCloseSubslide(vTourId);
			}
		});
	};

	var _onCloseSubslide = function(vTourId){
		var canvas = $("#"+vTourId).find(".map_canvas");
		$(canvas).removeClass("temp_hidden");
	};

	/*
	* vtJSON is a JSON slide of VirtualTour type
	*/
	var draw = function(vtJSON){
		if((!gMlLoaded)&&(!gMlLoading)){
			//Load GM library
			gMlLoading = true;
			V.Utils.Loader.loadGoogleLibrary("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=places",function(){
				gMlLoading = false;
				gMlLoaded = true;

				//Notify event
				var el = document;
				var evt = document.createEvent('Event');
				evt.initEvent('googleMapsLibraryLoadedinVV', true, true);
				el.dispatchEvent(evt);
			});
		}

		if(!gMlLoaded){
			//Wait for GMap library to load
			$(document).on('googleMapsLibraryLoadedinVV', function(){
				draw(vtJSON);
			});
			return;
		}

		//VT must be a slide of Virtual tour type
		if(vtJSON.type!==V.Constant.VTOUR){
			return;
		}

		if(typeof virtualTours[vtJSON.id] != "undefined"){
			//Already drawed
			return;
		}

		//Start draw Virtual Tour

		//Store Virtual Tour
		virtualTours[vtJSON.id] = jQuery.extend({}, vtJSON);

		//Draw canvas
		var canvasId = V.Utils.getId(vtJSON.id + "_canvas");
		var canvas =  $("<div id='"+canvasId+"' class='map_canvas' style='height:"+"100%"+"; width:"+"100%"+"'></div>");
		var vtDOM = $("#"+vtJSON.id);
		$(vtDOM).append(canvas);
		V.Utils.addTempShown(vtDOM);

		//Draw map
		var center = new google.maps.LatLng(vtJSON.center.lat, vtJSON.center.lng);
		var myOptions = {
			zoom: parseInt(vtJSON.zoom),
			center: center,
			mapTypeId: vtJSON.mapType
		};
		var map = new google.maps.Map(document.getElementById(canvasId), myOptions);
		//Store map
		virtualTours[vtJSON.id].map = map;

		//Add markers
		$(vtJSON.pois).each(function(index,poi){
			_addMarkerToCoordinates(canvasId,map,poi.lat,poi.lng,poi.slide_id);
		});

		//Map events
		google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
			//this part runs when the mapobject is created and rendered
			V.Utils.removeTempShown(vtDOM);
			google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
				//this part runs when the mapobject shown for the first time
			});
		});

		google.maps.event.addDomListener(map, 'idle', function() {
		});
		google.maps.event.addDomListener(window, 'resize', function() {
		});
	};

	var onEnterSlideset = function(slideset){
		var vtId = $(slideset).attr("id");
		var canvas = $("#"+vtId).find(".map_canvas");
		$(canvas).show();
	};

	var onLeaveSlideset = function(slideset){
		var vtId = $(slideset).attr("id");
		var canvas = $("#"+vtId).find(".map_canvas");
		$(canvas).hide();
	};

	var _addMarkerToCoordinates = function(canvasId,map,lat,lng,slide_id){
		return _addMarkerToPosition(canvasId,map,new google.maps.LatLng(lat,lng),slide_id);
	};

	var _addMarkerToPosition = function(canvasId,map,myLatlng,slide_id){
		var pinImage = new google.maps.MarkerImage(V.ImagesPath + "vicons/marker.png",
		new google.maps.Size(25, 40),
		new google.maps.Point(0,0),
		new google.maps.Point(10, 34));

		var marker = new google.maps.Marker({
			position: myLatlng, 
			map: map,
			draggable: false,
			icon: pinImage,
			title:"("+myLatlng.lat().toFixed(3)+","+myLatlng.lng().toFixed(3)+")"
		});

		google.maps.event.addListener(marker, 'click', function(event){
			setTimeout(function(){
				var canvasDOM = $("#"+canvasId);
				var subslideDOM = $("#"+slide_id);
				if($(subslideDOM).hasClass("show_in_smartcard")){
					$(canvasDOM).addClass("temp_hidden");
				}
			},1500);
			V.Slides.openSubslide(slide_id,true);
		});

		return marker;
	};


	var afterSetupSize = function(increase){
		// if(typeof lastIncrease == "undefined"){
		// 	lastIncrease = increase;
		// 	return;
		// }

		// var increaseDiff = increase - lastIncrease;

		// for(key in virtualTours){
		// 	var vt = virtualTours[key];
		// 	var newZoom = _getZoomForIncreaseDiff(vt.map.zoom,increaseDiff);
		// 	if(newZoom !== vt.map.zoom){
		// 		vt.map.setZoom(newZoom);
		// 		lastIncrease = increase;
		// 	}
		// }
	};

	var _getZoomForIncreaseDiff = function(zoom, increaseDiff){
		//+-1 zoom for each 30%
		var absIncreaseDiff = Math.floor(Math.abs(increaseDiff)/0.3);

		if(increaseDiff > 0){
			var newZoom = zoom + absIncreaseDiff;
		} else {
			var newZoom = zoom - absIncreaseDiff;
		}
		//Zoom always between 1 and 20
		return Math.max(Math.min(newZoom,20),1);
	};


	return {
		init				: init,
		draw				: draw,
		onEnterSlideset		: onEnterSlideset,
		onLeaveSlideset		: onLeaveSlideset,
		afterSetupSize		: afterSetupSize
	};

}) (VISH, jQuery);