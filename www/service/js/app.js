function GeneralSettingsController($scope,$http) {
    $scope.hostname = '';

    $scope.submitForm = function(isValid) {
        console.log(isValid);
    };
}

function SecuritySettingsController($scope,$http) {
    $scope.password = '';
}

function MapSettingsController($scope,$http,leafletData) {
    $scope.map_updates = "private";
    $scope.name = "";
    $scope.street = "";
    $scope.zipcode = "";
    $scope.city = "";
    $scope.country = "Deutschland";
    $scope.router_pos_gen_interfaces = 'true';
    $scope.router_pos_gen_routes = 'true';
    $scope.router_pos_interfaces = 'mesh';

    jQuery(document).ready(function(){
        jQuery('#mapselector').modal('setting', {
            onShow: function() {
                leafletData.getMap().then(function(map){
                    map.invalidateSize();
                });
            }
        });
    });


    angular.extend($scope, {
        location: {
            lat: 50.92882435261489,
            lng: 11.584664583206175,
            zoom: 18
        },
        events: {
            markers: {
                enable: ['dragend'],
                logic: 'emit'
            }
        },
        markers: {
            routerloc: {
                lat: 50.92882435261489,
                lng: 11.584664583206175,
                focus: true,
                draggable: true
            }
        }
    });

    $scope.$on('leafletDirectiveMarker.dragend', function(event,args){
        angular.extend($scope, {
            location: {
                lat: args.model.lat,
                lng: args.model.lng,
                zoom: event.targetScope.center.zoom
            },
            markers: {
                routerloc: {
                    lat: args.model.lat,
                    lng: args.model.lng,
                    focus: true,
                    draggable: true
                }
            }
        });
    });

    $scope.GeoFromBrowser = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            angular.extend($scope, {
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 18
                },
                markers: {
                    routerloc: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        focus: true,
                        draggable: true
                    }
                }
            });
        });
    };

    $scope.GeoFromAddress = function() {
        var query = $scope.street + ", " + $scope.zipcode + " " + $scope.city + ", " + $scope.country;
        var query_url = "https://nominatim.openstreetmap.org/search.php?format=json&q=" + query
        $http({
            method: 'GET',
            url: query_url
        }).then(function(response){
            if (response.data.length > 0) {
                var loc = response.data[0];
                angular.extend($scope, {
                    location: {
                        lat: parseFloat(loc.lat),
                        lng: parseFloat(loc.lon),
                        zoom: 18
                    },
                    markers: {
                        routerloc: {
                            lat: parseFloat(loc.lat),
                            lng: parseFloat(loc.lon),
                            focus: true,
                            draggable: true
                        }
                    }
                });
            } else {
                alert("Konnte keine Geokoordination zu der Adresse finden.");
            }
        });

    }
}

(function (angular) {
    'use strict';
    angular.module('SettingsApp',['leaflet-directive'])
        .controller('GeneralSettingsController',['$scope','$http',GeneralSettingsController])
        .controller('SecuritySettingsController',['$scope','$http',SecuritySettingsController])
        .controller('MapSettingsController',['$scope','$http','leafletData',MapSettingsController]);
})(window.angular);

$(document).ready(function(){
    $('#mapselector')
        .modal('attach events', '#geofrommap')
    ;
});
