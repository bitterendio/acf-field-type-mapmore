(function($){
	
	
	function initialize_field( $el ) {
		
		//$el.doStuff();
		
	}
	
	
	if( typeof acf.add_action !== 'undefined' ) {
	
		/*
		*  ready append (ACF5)
		*
		*  These are 2 events which are fired during the page load
		*  ready = on page load similar to $(document).ready()
		*  append = on new DOM elements appended via repeater field
		*
		*  @type	event
		*  @date	20/07/13
		*
		*  @param	$el (jQuery selection) the jQuery element which contains the ACF fields
		*  @return	n/a
		*/
		
		acf.add_action('ready append', function( $el ){
			
			// search $el for fields of type 'mapmore'
			acf.get_fields({ type : 'mapmore'}, $el).each(function(){
				
				initialize_field( $(this) );
				
			});
			
		});
		
		
	} else {
		
		
		/*
		*  acf/setup_fields (ACF4)
		*
		*  This event is triggered when ACF adds any new elements to the DOM. 
		*
		*  @type	function
		*  @since	1.0.0
		*  @date	01/01/12
		*
		*  @param	event		e: an event object. This can be ignored
		*  @param	Element		postbox: An element which contains the new HTML
		*
		*  @return	n/a
		*/
		
		$(document).on('acf/setup_fields', function(e, postbox){
			
			$(postbox).find('.field[data-field_type="mapmore"]').each(function(){
				
				initialize_field( $(this) );
				
			});
		
		});
	
	
	}

})(jQuery);




// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// Create the defaults once
		var mapMore = "mapMore",
			defaults = {
				map: null,
				contextmenuClass: "mapmore-contextmenu",
				fieldname: null,
				defaultCircleRadius: 200000,
				menu: [
					{
						label: "Add Marker",
						function: "addMarker"
					},
					{
						label: "Add Circle",
						function: "addCircle"
					}
				],
				draggable: true,
				single: true,
				editable: true,
				drawingManager: true,
				defaultStrokeColor: 	'#FF0000',
				defaultStrokeOpacity: 	0.8,
				defaultStrokeWeight: 	2,
				defaultFillColor: 		'#FF0000',
				defaultFillOpacity: 	0.35,
				markerOptions: 			[],
				defaultMarker: 			null,
			};

		// The actual plugin constructor
		function MapMore ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = mapMore;
			this.init();
		}

		// Avoid MapMore.prototype conflicts
		$.extend( MapMore.prototype, {
			init: function() {

				this.map = this.settings.map;
				this.mapDiv = this.map.getDiv();
				this.locations = JSON.parse(this.settings.locations);
				this.mapObjects = [];

				this.addEventListeners();

				this.setLocations();

				this.activateIconSelect();

				if ( this.settings.drawingManager && this.settings.editable )
					this.setDrawingManager();

			},

			activateIconSelect: function() {

				var self = this;

				$('[data-acf-field-mapmore-icon]').click(function(){

					$('[data-acf-field-mapmore-icon]').removeClass('active');

					$(this).addClass('active');

					self.settings.defaultMarker = $(this).data('acf-field-mapmore-icon');

				});

			},

			addEventListeners: function() {

				var self = this;

				// Display context menu on right click
				google.maps.event.addListener(
			        self.map,
			        "rightclick",
			        function( event ) {
					    // Store last clicked position
						self.lastClickedPosition = event;

						// Show context menu
			            self.contextmenu(event.latLng, event.pixel);
			        }
			    );

				// Close context menus on click
			    google.maps.event.addListener(
			        self.map,
			        "click",
			        function( event ) {
			            self.closeContextmenus();
			        }
			    );

			    // Close context menus on zoom change
			    google.maps.event.addListener(
			        self.map,
			        "zoom_changed",
			        function( event ) {
			            self.closeContextmenus();
			        }
			    );

			    // Close context menus on drag
			    google.maps.event.addListener(
			        self.map,
			        "drag",
			        function( event ) {
			            self.closeContextmenus();
			        }
			    );

				// clear map
				google.maps.event.addDomListener(
					document.getElementById('mapmore-clear-map'),
					'click',
					function (event) {

						self.clearLocations();
						self.storeLocations();

						var $input = jQuery('input[name="' + self.settings.fieldname + '"]');

						$input.val('');

						self.locations = [];

					}
				);

				// clear marker selection
				google.maps.event.addDomListener(
					document.getElementById('mapmore-clear-marker'),
					'click',
					function (event) {

						$('[data-acf-field-mapmore-icon]').removeClass('active');

						self.settings.defaultMarker = null;

					}
				);

			},

			setDrawingManager: function() {

				var self = this;

				var drawingManager = new google.maps.drawing.DrawingManager({
					//drawingMode: google.maps.drawing.OverlayType.MARKER,
					drawingControl: true,
					drawingControlOptions: {
						position: google.maps.ControlPosition.TOP_CENTER,
						drawingModes: [
							google.maps.drawing.OverlayType.MARKER,
							google.maps.drawing.OverlayType.CIRCLE,
							google.maps.drawing.OverlayType.POLYGON,
							google.maps.drawing.OverlayType.POLYLINE,
							google.maps.drawing.OverlayType.RECTANGLE
						]
					},
					markerOptions: {
						//icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
					},
					circleOptions: {
						strokeColor: 	this.settings.defaultStrokeColor,
						strokeOpacity: 	this.settings.defaultStrokeOpacity,
						strokeWeight: 	this.settings.defaultStrokeWeight,
						fillColor: 		this.settings.defaultFillColor,
						fillOpacity: 	this.settings.defaultFillOpacity,
						editable: 		true,
						zIndex: 		1
					},
					polygonOptions: {
						strokeColor: 	this.settings.defaultStrokeColor,
						strokeOpacity: 	this.settings.defaultStrokeOpacity,
						strokeWeight: 	this.settings.defaultStrokeWeight,
						fillColor: 		this.settings.defaultFillColor,
						fillOpacity: 	this.settings.defaultFillOpacity,
						editable: 		true,
						zIndex: 		1
					},
					polylineOptions: {
						strokeColor: 	this.settings.defaultStrokeColor,
					    strokeOpacity: 	this.settings.defaultStrokeOpacity,
					    strokeWeight: 	this.settings.defaultStrokeWeight,
					    editable: 		true,
					    zIndex: 		1
					},
					rectangleOptions: {
						strokeColor: 	this.settings.defaultStrokeColor,
						strokeOpacity: 	this.settings.defaultStrokeOpacity,
						strokeWeight: 	this.settings.defaultStrokeWeight,
						fillColor: 		this.settings.defaultFillColor,
						fillOpacity: 	this.settings.defaultFillOpacity,
						editable: 		true,
						zIndex: 		1
					}
				});
				drawingManager.setMap(this.map);

				google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {

					switch( event.type ) {

						case google.maps.drawing.OverlayType.CIRCLE:

							var locationObject = {
						        	lat: 				event.overlay.center.lat(),
						        	lng: 				event.overlay.center.lng(),
						        	type: 				'circle',
						        	radius: 			event.overlay.getRadius()
						    	};

						break;

						case google.maps.drawing.OverlayType.MARKER:
							/*
							
							@wip
							if ( self.settings.defaultMarker !== null ) {

								var icon = {
							        url: self.settings.defaultMarker,
							        anchor: new google.maps.Point(25,50),
							        scaledSize: new google.maps.Size(50,50)
							    };

							}
							*/

							var locationObject = {
						        	lat: 				event.overlay.position.lat(),
						        	lng: 				event.overlay.position.lng(),
						        	type: 				'marker'
						    	};

						break;

						case google.maps.drawing.OverlayType.POLYGON:

							var locationObject = {
						        	path: 				event.overlay.getPath().getArray(),
						        	type: 				'polygon'
						    	};

						break;

						case google.maps.drawing.OverlayType.POLYLINE:

							var locationObject = {
						        	path: 				event.overlay.getPath().getArray(),
						        	type: 				'polyline'
						    	};

						break;

						case google.maps.drawing.OverlayType.RECTANGLE:

							var locationObject = {
						        	bounds: 			event.overlay.getBounds(),
						        	type: 				'rectangle'
						    	};

						break;

					}

					if ( self.settings.single ) {
						self.locations = [
							locationObject
				    	];
				    } else {
				    	self.locations.push(locationObject);
				    }

				    if ( self.settings.single )
				    	self.clearLocations();

				    // Delete the drawn shape from map, keep only the one in .locations
				    event.overlay.setMap(null);

				    self.setLocations();

				    self.storeLocations();

				});


			},

			getContextmenuHtml: function() {

				var html = '<ul class="' + this.settings.contextmenuClass + '">'

				for ( var key in this.settings.menu ) {

					var item = this.settings.menu[key];

					html += '<li>'
							+ '<a href="#" data-function="' + item['function'] + '">'
								+ item['label'] 
							+ '</a>'
						+ '</li>';

				}

				html += '</ul>';

				return html;

			},

			closeContextmenus: function() {

				jQuery(this.mapDiv).find('.' + this.settings.contextmenuClass).remove();

			},

			displayContextmenu: function() {

				jQuery(this.mapDiv).find('.' + this.settings.contextmenuClass).css({
					'visibility' : 'visible'
				});

			},

			activateContextMenu: function(path, vertext) {

				var self = this;

				jQuery(this.mapDiv).find('.' + this.settings.contextmenuClass + ' a').click(function(){

					event.preventDefault();

					var func = $(this).data('function');

					if ( typeof self[func] == 'undefined' ) {
						alert('Function ' + func + ' is not implemented.');
						return false;
					} else {
						self[func](self.lastClickedPosition);

						self.closeContextmenus();
					}

				});

			},

			addMarker: function(position) {

				var self = this,
					locationObject = {
			        	lat: 				position.latLng.lat(),
			        	lng: 				position.latLng.lng(),
			        	type: 				'marker'
			    	};


				if ( this.settings.single ) {
					this.locations = [
						locationObject
			    	];
			    } else {
			    	this.locations.push(locationObject);
			    }

			    if ( this.settings.single )
			    	this.clearLocations();

			    this.setLocations();

			    this.storeLocations();

			},

			addCircle: function(position) {

				var self = this,
					locationObject = {
			        	lat: 				position.latLng.lat(),
			        	lng: 				position.latLng.lng(),
			        	type: 				'circle',
			        	radius: 			self.settings.defaultCircleRadius
			    	};

				if ( this.settings.single ) {
					this.locations = [
						locationObject
			    	];
			    } else {
			    	this.locations.push(locationObject);
			    }

			    if ( this.settings.single )
			    	this.clearLocations();

			    this.setLocations();

			    this.storeLocations();

			},

			clearLocations: function() {

				var self = this;

				for ( var key in self.mapObjects ) {

					var mapObject = self.mapObjects[key];

					mapObject.setMap(null);

				}

			},

			storeLocations: function() {

				var $input = jQuery('input[name="' + this.settings.fieldname + '"]');

				$input.val( JSON.stringify( this.locations ) );

			},

			setLocations: function() {

				var self = this;

				for ( var key in this.locations ) {

					var location = this.locations[key];

					switch ( location.type ) {

						case 'marker':


							var markerLatLng = {
								lat: location.lat, 
								lng: location.lng
							};

							var mapObjectConfig = {
								position: 	markerLatLng,
								map: 		self.map,
								draggable: 	self.settings.draggable,
    							animation: 	google.maps.Animation.DROP
							};

							if ( self.settings.defaultMarker !== null ) {

								mapObjectConfig['icon'] = self.settings.defaultMarker;

							}

							var mapObject = new google.maps.Marker(mapObjectConfig);

							self.mapObjects.push(mapObject);

							google.maps.event.addListener(mapObject, 'dragend', function(event) {

								self.locations[key]['lat'] = event.latLng.lat();
								self.locations[key]['lng'] = event.latLng.lng();

								self.storeLocations();

							});

						break;

						case 'circle':

							var markerLatLng = {
								lat: location.lat, 
								lng: location.lng
							};

							var mapObject = new google.maps.Circle({
								strokeColor: 	this.settings.defaultStrokeColor,
								strokeOpacity: 	this.settings.defaultStrokeOpacity,
								strokeWeight: 	this.settings.defaultStrokeWeight,
								fillColor: 		this.settings.defaultFillColor,
								fillOpacity: 	this.settings.defaultFillOpacity,
								map: 			self.map,
								center: 		markerLatLng,
								radius: 		location.radius,
								editable: 		self.settings.editable
							});

							self.mapObjects.push(mapObject);

							google.maps.event.addListener(mapObject, 'radius_changed', function() {

								self.locations[key]['radius']	= mapObject.getRadius();

								self.storeLocations();

							});

							google.maps.event.addListener(mapObject, 'center_changed', function(event) {

								self.locations[key]['lat'] = mapObject.getCenter().lat();
								self.locations[key]['lng'] = mapObject.getCenter().lng();

								self.storeLocations();

							});

						break;

						case 'polygon':

							var mapObject = new google.maps.Polygon({
								path: 			location['path'],
								strokeColor: 	this.settings.defaultStrokeColor,
								strokeOpacity: 	this.settings.defaultStrokeOpacity,
								strokeWeight: 	this.settings.defaultStrokeWeight,
								fillColor: 		this.settings.defaultFillColor,
								fillOpacity: 	this.settings.defaultFillOpacity,
								map: 			self.map,
								editable: 		self.settings.editable
							});

							self.mapObjects.push(mapObject);

							google.maps.event.addListener(mapObject.getPath(), 'set_at', function(event) {

								self.locations[key]['path'] = mapObject.getPath().getArray();

								self.storeLocations();

							});

							google.maps.event.addListener(mapObject.getPath(), 'insert_at', function() {

								self.locations[key]['path'] = mapObject.getPath().getArray();

								self.storeLocations();

							});

							google.maps.event.addListener(mapObject, 'rightclick', function(event) {

							    // Check if click was on a vertex control point
							    if (typeof event.vertex === 'undefined') {
							    	return;
							    }

							    mapObject.getPath().removeAt(event.vertex);

							    self.locations[key]['path'] = mapObject.getPath().getArray();

								self.storeLocations();

							});

						break;

						case 'polyline':

							var mapObject = new google.maps.Polyline({
								path: 			location['path'],
								strokeColor: 	this.settings.defaultStrokeColor,
								strokeOpacity: 	this.settings.defaultStrokeOpacity,
								strokeWeight: 	this.settings.defaultStrokeWeight,
								map: 			self.map,
								editable: 		self.settings.editable
							});

							self.mapObjects.push(mapObject);

							google.maps.event.addListener(mapObject.getPath(), 'set_at', function(event) {

								self.locations[key]['path'] = mapObject.getPath().getArray();

								self.storeLocations();

							});

							google.maps.event.addListener(mapObject.getPath(), 'insert_at', function() {

								self.locations[key]['path'] = mapObject.getPath().getArray();

								self.storeLocations();

							});

							google.maps.event.addListener(mapObject, 'rightclick', function(event) {

							    // Check if click was on a vertex control point
							    if (typeof event.vertex === 'undefined') {
							    	return;
							    }

							    mapObject.getPath().removeAt(event.vertex);

							    self.locations[key]['path'] = mapObject.getPath().getArray();

								self.storeLocations();

							});

						break;

						case 'rectangle':

							var mapObject = new google.maps.Rectangle({
								bounds: 		location['bounds'],
								strokeColor: 	this.settings.defaultStrokeColor,
								strokeOpacity: 	this.settings.defaultStrokeOpacity,
								strokeWeight: 	this.settings.defaultStrokeWeight,
								fillColor: 		this.settings.defaultFillColor,
								fillOpacity: 	this.settings.defaultFillOpacity,
								map: 			self.map,
								editable: 		self.settings.editable
							});

							self.mapObjects.push(mapObject);

							google.maps.event.addListener(mapObject, 'bounds_changed', function(event) {

								self.locations[key]['bounds'] = mapObject.getBounds();

								self.storeLocations();

							});

						break;

					}

				}

			},

			contextmenu: function(latLng, pixel) {

				var self = this,
					projection,
					contextmenuDir;

				projection = self.map.getProjection();

				self.closeContextmenus();

				jQuery(self.mapDiv).append( self.getContextmenuHtml() );

				// Figure out position of context menu
				self.setContextmenuXY(latLng, pixel);

				// Activate buttons in context menu
				self.activateContextMenu();

				// Enable visibility of context menu
				self.displayContextmenu();
			},

			setContextmenuXY: function(latLng, pixel) {

				var self = this;

				var mapWidth 	= jQuery(self.mapDiv).width(),
					mapHeight 	= jQuery(self.mapDiv).height(),
					menuWidth 	= jQuery('.' + this.settings.contextmenuClass).width(),
					menuHeight 	= jQuery('.' + this.settings.contextmenuClass).height();

				var x = pixel.x,
					y = pixel.y;

			    if((mapWidth - x) < menuWidth)		//if to close to the map border, decrease x position
			    	x = x - menuWidth;
			    if((mapHeight - y) < menuHeight)	//if to close to the map border, decrease y position
			     	y = y - menuHeight;

			    jQuery('.' + this.settings.contextmenuClass).css('left',x);
			    jQuery('.' + this.settings.contextmenuClass).css('top',	y);

			},


			getCanvasXY: function(latLng) {

				var self = this;

				var scale = Math.pow(2, self.map.getZoom());
			 	var nw = new google.maps.LatLng(
			 		self.map.getBounds().getNorthEast().lat(),
			 		self.map.getBounds().getSouthWest().lng()
			 		);
			 	var worldCoordinateNW = self.map.getProjection().fromLatLngToPoint(nw);
			 	var worldCoordinate = self.map.getProjection().fromLatLngToPoint(latLng);
			 	var caurrentLatLngOffset = new google.maps.Point(
			 		Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
			 		Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
			 		);
			 	return caurrentLatLngOffset;

			}
		} );

		// A really lightweight MapMore wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ mapMore ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "mapmore_" + mapMore ) ) {
					$.data( this, "mapmore_" +
						mapMore, new MapMore( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );