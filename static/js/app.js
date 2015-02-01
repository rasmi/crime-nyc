var server_url = 'http://localhost:5000/api/'

angular.module('nyc-crime', ['nvd3', 'uiGmapgoogle-maps'])
.factory('_', ['$window', function($window){
	return $window._;
}])
.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
	GoogleMapApi.configure({
		libraries: 'visualization',
		visualRefresh: true
	});
}])
.controller('homeCtrl', ['$scope', '$http', '$timeout', '_', 'uiGmapGoogleMapApi', function($scope, $http, $timeout, _, GoogleMapApi) {
	$scope.crimestats = []

	GoogleMapApi.then(function(maps) {

	$scope.labels = {
		'burglary': 'BURGLARY',
		'felony_assault': 'FELONY ASSAULT',
		'grand_larceny': 'GRAND LARCENY',
		'grand_larceny_motor': 'GRAND LARCENY OF MOTOR VEHICLE',
		'rape': 'RAPE',
		'robbery': 'ROBBERY',
		'murder': 'MURDER'
	}
	$scope.labelsInverse = {
		'BURGLARY': 'burglary',
		'FELONY ASSAULT': 'felony_assault',
		'GRAND LARCENY': 'grand_larceny',
		'GRAND LARCENY OF MOTOR VEHICLE': 'grand_larceny_motor',
		'RAPE': 'rape',
		'ROBBERY': 'robbery',
		'MURDER': 'murder'
	}
	$scope.crimekeys = _.keys($scope.labels);
	$scope.enabledLayers = _.zipObject($scope.crimekeys, _.range($scope.crimekeys.length).map(function() {return true}));

	$scope.map = {
		center: {
			latitude: 40.78,
			longitude: -73.97
		},
		zoom: 12,
		burglaryLayerCallback: function (layer) {
			$scope.prepareLayer('coordinates_burglary.json', colorbrewer['Purples']['9'], layer);
		},
		felony_assaultLayerCallback: function (layer) {
			$scope.prepareLayer('coordinates_felony_assault.json', colorbrewer['Blues']['9'], layer);
		},
		grand_larcenyLayerCallback: function (layer) {
			$scope.prepareLayer('coordinates_grand_larceny.json', colorbrewer['Greens']['9'], layer);
		},
		grand_larceny_motorLayerCallback: function (layer) {
			$scope.prepareLayer('coordinates_grand_larceny_motor.json', colorbrewer['Oranges']['9'], layer);
		},
		murderLayerCallback: function (layer) {
			$scope.prepareLayer('coordinates_murder.json', colorbrewer['Reds']['9'], layer);
		},
		rapeLayerCallback: function (layer) {
			$scope.prepareLayer('coordinates_rape.json', colorbrewer['Greys']['9'], layer);
		},
		robberyLayerCallback: function (layer) {
			$scope.prepareLayer('coordinates_robbery.json', colorbrewer['RdPu']['9'], layer);
		},

		options: {
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			//TODO: Try custom styles with better contrast instead of satellite view.
			/*styles: [{
				featureType: 'landscape',
				elementType: 'geometry',
				stylers: [
					
					{ hue: '#ffff00' },
					{ gamma: 1.4 },
					{ saturation: 82 },
					{ lightness: 96 }
					
					{invert_lightness: true}
				]
			}]*/
		}
	};

	$scope.chartoptions = {
		"chart": {
			"type": "multiBarChart",
			"height": 710,
			//"height": 800,
			"stacked": true,
			"showControls": false,
			"xAxis": {
				"axisLabel": "Month",
				"tickFormat": function(d) {
					return d3.format('d')(d);
				}
			},
			"yAxis": {
				"axisLabel": "Convictions",
				"tickFormat": function(d) {
					return d3.format('d')(d);
				}
			},
			"transitionDuration": 0,
			"callback": function() {
				//TODO: Get onClick to work for labels and not just circles.
				d3.selectAll('.nv-legend').selectAll('.nv-series circle').on('click', function() {
					setTimeout(function() {
						var enabled = _.zipObject($scope.crimekeys, _.range($scope.crimekeys.length).map(function() {return true}));
						disabled = []
						d3.selectAll('.nv-legend').selectAll('.disabled').each(function(d) {disabled.push(d.key)});
						_.forEach(disabled, function(crimetype) {
							enabled[$scope.labelsInverse[crimetype]] = false;
						});
						$scope.$apply(function() {
							$scope.enabledLayers = enabled;
						})
					}, 10);
				});
			}
		}
	}

	$scope.getCrimeData = function() {
		$http.get('crimes')
			.success(function(response) {
				$scope.crimestats = response.data;
			});

	}
	$scope.getCrimeData();

	$scope.prepareLayer = function(filename, colors, layer) {
		$http.get('static/data/' + filename)
			.success(function(coords) {
				var latlngdata = []
				_.forEach(coords, function(coordinate) {
					latlngdata.push(new google.maps.LatLng(coordinate[1], coordinate[0]));
				});
				var heatArray = new google.maps.MVCArray(latlngdata);
				layer.setData(heatArray);
				colors.unshift('rgba(255, 0, 0, 0.0)');
				layer.set('gradient', colors);
				//Adjust opacity to get the blending of layers done right.
				layer.set('opacity', .7);
			});
	}

	});
}]);