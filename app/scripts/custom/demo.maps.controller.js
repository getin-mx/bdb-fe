/**
 * DemoMapsCtrl - controller
 */
function DemoMapsCtrl($scope, $http, CommonsService, AuthenticationService) {

    var vm = this;
    $scope.venue = 'Sportium Arboledas';

    $scope.refresh = function() {
        $scope.loadingRefresh = true;
        $scope.updateMap('2016-04', '2016-05', '2016-08');
    }

    $scope.updateMap = function(period, period2, period3) {

        map = new GMaps({
            div: '#map',
            lat: 0,
            lng: 0,
            width: "100%",
            height: "550px"
        });

        lat = 0;
        lon = 0;
        if ($scope.venue == 'Sportium Arboledas') {
            lat = 19.5471315;
            lon = -99.2024959;
        } else if ($scope.venue == 'Sportium Coyoacan') {
            lat = 19.3278346;
            lon = -99.1494134;
        } else if ($scope.venue == 'Sportium Cuautitlan') {
            lat = 19.6391546;
            lon = -99.2251587;
        } else if ($scope.venue == 'Sportium Del VAlle') {
            lat = 19.3737203;
            lon = -99.1655293;
        } else if ($scope.venue == 'Sportium Desierto') {
            lat = 19.3427192;
            lon = -99.2265813;
        } else if ($scope.venue == 'Sportium Lomas Verdes') {
            lat = 19.4952773;
            lon = -99.2490495;
        } else if ($scope.venue == 'Sportium San Angel') {
            lat = 19.3451124;
            lon = -99.1900544;
        } else if ($scope.venue == 'Sportium Santa Fe') {
            lat = 19.3772541;
            lon = -99.2575977;
        } else if ($scope.venue == 'Sportium Satelite') {
            lat = 19.5079268;
            lon = -99.2222704;
        }

        map.setZoom(11);
        map.setCenter(lat, lon, null);

        var url = 'http://104.130.48.96/ArcGIS/rest/services/Capas/ServicioGetInZDYN/MapServer';
        var dynamap = new gmaps.ags.MapOverlay(url);
        dynamap.setMap(map.map);
        map.removeMarkers();

        $http.get(CommonsService.getDashUrl('/dashoard/externalGeo') + '&period=' + encodeURI(period) + '&venue=' + encodeURI($scope.venue))
            .then(
                $scope.fillMap1, 
                $http.get(CommonsService.getDashUrl('/dashoard/externalGeo') + '&period=' + encodeURI(period2) + '&venue=' + encodeURI($scope.venue))
                    .then(
                        $scope.fillMap2,
                        $http.get(CommonsService.getDashUrl('/dashoard/externalGeo') + '&period=' + encodeURI(period3) + '&venue=' + encodeURI($scope.venue))
                            .then($scope.fillMap3)));
    }

    $scope.fillMap1 = function(dat) {
            var data = dat.data;
            lat = 0;
            lon = 0;
            if ($scope.venue == 'Sportium Arboledas') {
                lat = 19.5471315;
                lon = -99.2024959;
            } else if ($scope.venue == 'Sportium Coyoacan') {
                lat = 19.3278346;
                lon = -99.1494134;
            } else if ($scope.venue == 'Sportium Cuautitlan') {
                lat = 19.6391546;
                lon = -99.2251587;
            } else if ($scope.venue == 'Sportium Del VAlle') {
                lat = 19.3737203;
                lon = -99.1655293;
            } else if ($scope.venue == 'Sportium Desierto') {
                lat = 19.3427192;
                lon = -99.2265813;
            } else if ($scope.venue == 'Sportium Lomas Verdes') {
                lat = 19.4952773;
                lon = -99.2490495;
            } else if ($scope.venue == 'Sportium San Angel') {
                lat = 19.3451124;
                lon = -99.1900544;
            } else if ($scope.venue == 'Sportium Santa Fe') {
                lat = 19.3772541;
                lon = -99.2575977;
            } else if ($scope.venue == 'Sportium Satelite') {
                lat = 19.5079268;
                lon = -99.2222704;
            }

            var markers_data = [];

            var icon = '/styles/img/bullet.gif';
            markers_data.push({
                lat: lat,
                lng: lon,
                title: $scope.venue,
                infoWindow: {
                    content: '<p><strong>' + $scope.venue + '</p>'
                },
                icon: {
                    size: new google.maps.Size(10, 10),
                    url: icon
                }
            });

            // for (i = 0; i < data.length; i++) {
            //     var item = data[i];
            //     var conns = item.connections / 20;
            //     if( conns > 2000 ) conns = 2000;
            //     if( conns < 100 ) conns = 100;
            //     map.drawCircle({
            //         lat: item.lat,
            //         lng: item.lon,
            //         fillColor: '#ffff00',
            //         fillOpacity: 0.8,
            //         strokeColor: '#ffff00',
            //         strokeWeight: 1,
            //         radius: conns
            //     });
            // }

            map.addMarkers(markers_data);
    }

    $scope.fillMap2 = function(dat) {

            var data = dat.data;
            for (i = 0; i < data.length; i++) {
                var item = data[i];
                var conns = item.connections / 20;
                if( conns > 2000 ) conns = 2000;
                if( conns < 100 ) conns = 100;
                map.drawCircle({
                    lat: item.lat,
                    lng: item.lon,
                    fillColor: '#00ff00',
                    fillOpacity: 0.8,
                    strokeColor: '#00ff00',
                    strokeWeight: 1,
                    radius: conns
                });
            }

            $scope.loadingRefresh = false;

    }

    $scope.fillMap3 = function(dat) {

            var data = dat.data;
            for (i = 0; i < data.length; i++) {
                var item = data[i];
                var conns = item.connections / 5;
                if( conns > 2000 ) conns = 2000;
                if( conns < 100 ) conns = 100;
                map.drawCircle({
                    lat: item.lat,
                    lng: item.lon,
                    fillColor: '#0000ff',
                    fillOpacity: 0.8,
                    strokeColor: '#0000ff',
                    strokeWeight: 1,
                    radius: conns
                });
            }

            $scope.loadingRefresh = false;

    }

    return vm;
};

angular
    .module('bdb')
    .controller('DemoMapsCtrl', DemoMapsCtrl);