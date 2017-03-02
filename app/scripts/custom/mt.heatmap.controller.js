/**
 * MTHeatmapCtrl - controller
 */
function MTHeatmapCtrl($rootScope, $scope, $location, AuthenticationService, CommonsService, $http) {

    var vm = this;
    $scope.mapData = null;
    $scope.KEY = null;

    $scope.initFrame = function() {
        KEY = $location.search().floormap;
        fromDate = $location.search().fromDate;
        toDate = $location.search().toDate;
        dayOfWeek = $location.search().dayOfWeek;
        timezone = $location.search().timezone;
        entityId = $location.search().entityId;
        entityKind = $location.search().entityKind;
        token = $rootScope.globals.currentUser.token

        var mapData = indoormap.loadAndParseURL(config.baseUrl, token, KEY);
        $('#map').css('background-image', 'url(http://api.allshoppings.mobi/img/' + mapData.imageId + ')');
        $('#floor_map_iframe').css('height', mapData.mapHeight + 'px');
        $('#floor_map_iframe').css('width', mapData.mapWidth + 'px');
        $('#map').css('height', mapData.mapHeight + 'px');
        $('#map').css('width', mapData.mapWidth + 'px');

        if (!mapData.corrected) {
            mapData = indoormap.correct(mapData);
        }

        indoormap.init();
        indoormap.draw(mapData, $('.mapContainer')[0]);
        if (indoormap.queryString()['noHeatMap'] != 'true') {
            $('#save').css('display', 'none');
            if( KEY == 'mundoe_p1') {
                indoormap.drawLines(config.baseUrl, token, mapData, KEY, $('.mapContainer')[0], entityId, fromDate, toDate, dayOfWeek, timezone, 0, 20);
            } else {
                indoormap.drawLines(config.baseUrl, token, mapData, KEY, $('.mapContainer')[0], entityId, fromDate, toDate, dayOfWeek, timezone, 0, 20);
            }
        }
    
        $scope.mapData = mapData;
        $scope.KEY = KEY;

        $('#save').click(function(e) {
            e.preventDefault();
            indoormap.save($scope.mapData, $scope.KEY);
        });

        console.log('frame initialized');
    };

    $scope.initHeatmap = function() {
        var dToDate = new Date(new Date().getTime() - config.oneDay);
        var dFromDate = new Date(dToDate.getTime() - config.oneMonth);

        $scope.heatmapClass = 'col-lg-6';
        $scope.textClass = 'col-lg-6';
        $scope.headerClass = 'col-lg-12';
        $scope.fullscreen = false;

        $scope.toDate = dToDate.format("yyyy-mm-dd", null);
        $('#toDate').val($scope.toDate);
        $scope.fromDate = dFromDate.format("yyyy-mm-dd", null);
        $('#fromDate').val($scope.fromDate);
        $scope.shoppingId = '740547b3-5c3a-492c-a2f8-bc88345fcc5d';

        var globals = AuthenticationService.getCredentials();
        var credentials = globals.currentUser;
        $scope.brandId = credentials.identifier;

        $scope.updateHeatmap();

    }

    $scope.updateHeatmap = function() {
        vm.updateHeatmapParams();
        vm.filterHeatmap($scope.heatmapParams.token, $scope.heatmapParams.entityId, 
            $scope.heatmapParams.entityKind, $scope.heatmapParams.fromDate, 
            $scope.heatmapParams.toDate, $scope.heatmapParams.dayOfWeek, 
            $scope.heatmapParams.timezone);
    }

    this.filterHeatmap = function(token, entityId, entityKind, fromDate, toDate, dayOfWeek, timezone) {
        vm.updateHeatmapParent('#heatmapParent', token, config.dashUrl, entityId, entityKind, fromDate, toDate, dayOfWeek, timezone);
    }
    
    this.updateHeatmapParams = function() {
        $scope.heatmapParams = {
            BASE_URL: config.dashUrl,
            entityId: $scope.shoppingId,
            entityKind: 0,
            fromDate: $('#fromDate').val(),
            toDate: $('#toDate').val(),
            dayOfWeek: null,
            timezone: null,
            token: AuthenticationService.getCredentials().currentUser.token
        }
    }

    $scope.changeHeatMap = function(id, mapIdentifier) {
        var params = $scope.heatmapParams;

        $(id).children('a').each(function(i) {
            $(this).removeClass('btActive');
        });
        $('#' + mapIdentifier).addClass('btActive');
        currentActiveMap = mapIdentifier;

        $('#floor_map_iframe')[0].src = '#/mtheatmap_frame' 
            + '?floormap=' + mapIdentifier 
            + '&entityId=' + params.entityId 
            + '&fromDate=' + params.fromDate 
            + '&toDate=' + params.toDate
            + '&dayOfWeek=' + params.dayOfWeek
            // + '&noHeatMap=true'
            + '&timezone=' + params.timezone;

        document.getElementById('floor_map_iframe').contentWindow.reload();

    }

    this.updateHeatmapParent = function(id, token, baseUrl, entityId, entityKind, fromDate, toDate, dayOfWeek, timezone) {
        $.getJSON(
            baseUrl 
            + '/dashoard/floormapData' 
            + '?authToken=' + token
            + '&entityId=' + entityId
            + '&entityKind=' + entityKind, 
            function(data) {

            floormaps = data;
            var tab = '';
            for (var i = 0; i < floormaps.data.length; i++) {
                var map = floormaps.data[i];
                if (i != 0) tab += '  |  ';
                tab += '<a  href="javascript:null"' + (i == 0 ? 'class="btActive"' : '') 
                    + ' style="color: #666;" id="' + map.identifier + '" onclick=\'angular.element(document.getElementById("HeatmapView")).scope().changeHeatMap("' 
                    + id + '", "' + map.identifier + '")\'>' + map.floor + '</a>';
            }

            tab += '<div style="float:right;">';
            tab += '<a href="javascript:null" onclick="document.getElementById(\'floor_map_iframe\').contentWindow.toggleMap();"><span class="fa fa-map-o"></span></a>';
            tab += '&nbsp;';
            tab += '<a href="javascript:null" onclick="document.getElementById(\'floor_map_iframe\').contentWindow.prev();"><span class="fa fa-arrow-circle-o-left"></span></a>';
            tab += '&nbsp;';
            tab += '<a href="javascript:null" onclick="document.getElementById(\'floor_map_iframe\').contentWindow.next();"><span class="fa fa-arrow-circle-o-right"></span></a>';
            tab += '&nbsp;';
            tab += '<a href="javascript:null" onclick="document.getElementById(\'floor_map_iframe\').contentWindow.zoomin();"><span class="fa fa-search-plus"></span></a>';
            tab += '&nbsp;';
            tab += '<a href="javascript:null" onclick="document.getElementById(\'floor_map_iframe\').contentWindow.zoomout();"><span class="fa fa-search-minus"></span></a>';
            tab += '&nbsp;';
            tab += '<a href="javascript:null" class="fullscreen"><span class="fa fa-arrows-alt"></span></a>';
            tab += '</div>';

            var map = floormaps.data[0];
            tab += '<br/>';
            tab += '<div id="heatmap_container" style="height: 600px; overflow: auto; -webkit-overflow-scrolling: touch;">';
            tab += '<iframe id="floor_map_iframe" class="floor_map_iframe" scrolling="no" style="border: 0px; min-height: 500px; min-width: 100%;" src="#/mtheatmap_frame' 
                + '?floormap=' + map.identifier 
                + '&entityId=' + entityId 
                + '&fromDate=' + fromDate 
                + '&toDate=' + toDate 
                + '&dayOfWeek=' + dayOfWeek 
                // + '&noHeatMap=true'
                + '&timezone=' + timezone 
                + '"></iframe>';
            tab += '<div>';

            $(id).html(tab);

            $('.fullscreen').click(function(e) {
                if( $scope.fullscreen ) {
                    $scope.heatmapClass = 'col-lg-6';
                    $scope.textClass = 'col-lg-6';
                    $scope.headerClass = 'col-lg-12';
                    $('#heatmap_container').css('height','600px');
                    $scope.fullscreen = false;
                } else {
                    $scope.heatmapClass = 'col-lg-12';
                    $scope.headerClass = 'hidden';
                    $scope.textClass = 'hidden';
                    $('#heatmap_container').css('height','700px');
                    $scope.fullscreen = true;
                }
                CommonsService.safeApply($scope);
            });

        });
    };

    return vm;
};

angular
    .module('bdb')
    .controller('MTHeatmapCtrl', MTHeatmapCtrl);