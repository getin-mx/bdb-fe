/**
 * APDVisitsCtrl - controller
 */
 function APDVisitsCtrl($rootScope, $scope, AuthenticationService, CommonsService, $rootScope, $http, DTOptionsBuilder, DTColumnBuilder, ModalService) {

    var vm = this;

    $scope.loadedClientData = false;
    $scope.classUser = 'hidden';
    $scope.classAdmin = 'hidden';
    $scope.visitsOnly = false;
    $scope.retailCalendar = config.retailCalendar;
    $scope.retailCalendarDate = null;
    $scope.zoneAble = 'hidden';
    $scope.showRevenue = false;
    $scope.periodType = 'D';
    $scope.pagination = 0;
    $scope.stores = [];
    $scope.brands = [];
    $scope.storeId = undefined;
    $scope.info = {
      conversionVisits: 0.0,
      conversionTickets: 0.0
    };

    vm.updateOfflineDevices = function(id, baseUrl, brandId){

      var dfd = $.Deferred();

      url = baseUrl
      + '/offlineDevice'
      + '?authToken=' + $rootScope.globals.currentUser.token
      + '&brandId=' + brandId
      + '&timestamp=' + CommonsService.getTimestamp();

      var fundone = function(){
        console.log("done with Deferred execution");
      }
      $.getJSON(url,
        function(data){
          dfd.resolve(data['APDevices']);
        });

        return dfd.promise();
    };

    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(vm.updateOfflineDevices('.offline_devices', config.pyServiceUrl, "modatelas_mx")).withPaginationType('full_numbers');
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('description').withTitle('Tienda'),
        DTColumnBuilder.newColumn('hostname').withTitle('Hostname'),
        DTColumnBuilder.newColumn('lastUpdate').withTitle('Última fecha')
    ];

    vm.dtInstance = {};

    $scope.formatter1 = new Intl.NumberFormat('en-US');
    $scope.formatter2 = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    $scope.formatter3 = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2, /* this might not be necessary */
      maximumFractionDigits: 2 /* this might not be necessary */
    });


    $scope.selectedBrand = undefined;
    $scope.brandId = undefined;

    var globals = AuthenticationService.getCredentials();
    var credentials = globals.currentUser;

    $scope.storeLabel = '';

    $scope.dateChange = function() {
        alert("date changed");
    }

    this.generateGeneralInfo = function() {

        $http.get(CommonsService.getUrl('/dashboard/generalData')
            + '&entityId=' + $scope.brandId
            + '&subentityId=' + $scope.storeId.identifier
            + '&entityKind=1'
            + '&fromStringDate=' + $scope.fromDate
            + '&toStringDate=' + $scope.toDate
            + '&onlyExternalIds=true'
            + '&format=json'
            + '&timestamp=' + CommonsService.getTimestamp())
            .then(function(data) {

              $scope.info = {
                peasants: $scope.formatter1.format(data.data.peasants),
                revenue: $scope.formatter2.format(data.data.revenue),
                visits: $scope.formatter1.format(data.data.visits),
                tickets: $scope.formatter1.format(data.data.tickets),
                avgVisits: $scope.formatter1.format(data.data.avgVisits),
                avgTickets: $scope.formatter2.format(data.data.avgTickets),
                permanenceMedian: $scope.formatter1.format(data.data.permanenceMedian) + ' mins',
                lowerDate: data.data.lowerDate,
                higherDate: data.data.higherDate,
                conversionVisits: Math.round((data.data.visits / data.data.peasants) * 100),
                conversionTickets: Math.round((data.data.tickets / data.data.visits) * 100)
              };

            // $scope.generateConversionGauges();

            $('#lower-days-table>tbody>tr').each(function(index, elem){$(elem).remove();});

            //get the footable object
            var table = $('#lower-days-table').data('footable');

            var newRow = '';
            for(var i = 0; i < data.data.performance.length; i++) {
                var obj = data.data.performance[i];
              var row = '<tr>'
                  + ((i < 3) ? '<td><center><i class="fa fa-level-up"></i></center></td>' : '<td><center><i class="fa fa-level-down"></i></center></td>')
                      + '<td><center>' + obj.date + '</center></td>'
                      + '<td><center>' + obj.day + '</center></td>'
                      + '<td><center>' + $scope.formatter1.format(obj.visits) + '</center></td>'
                      + '<td><center>' + $scope.formatter3.format(obj.conversion) + '</center></td>'
                      + '<td><center>' + $scope.formatter2.format(obj.avgTicket) + '</center></td>'
                      + '</tr>';

                newRow += row;
            }

            table.appendRow(newRow);

            });
    };

    $scope.findRetailCalendarDate = function() {
        var d = new Date(new Date().getTime() - config.oneWeek).format("yyyy-mm-dd");
        for( var i = 0; i < $scope.retailCalendar.length; i++ ) {
            if($scope.retailCalendar[i].fromDate <= d && $scope.retailCalendar[i].toDate >= d)
                $scope.retailCalendarDate = $scope.retailCalendar[i];
        }
        $scope.retailCalendarChange();

        $('.datelistener').each(function() {
            var elem = $(this);

            // Save current value of element
            elem.data('oldVal', elem.val());

            // Look for changes in the value
            elem.bind("propertychange change click keyup input paste blur focus", function(event){
                // If value has changed...
                if (elem.data('oldVal') != elem.val()) {
                    // Updated stored value
                    elem.data('oldVal', elem.val());

                    var fd = $('#fromDate').val();
                    var td = $('#toDate').val();

                    $scope.retailCalendarDate = null;
                    for( var i = 0; i < $scope.retailCalendar.length; i++ ) {
                        if($scope.retailCalendar[i].fromDate == fd && $scope.retailCalendar[i].toDate == td)
                            $scope.retailCalendarDate = $scope.retailCalendar[i];
                    }
                }
            });
       });
    }

    $scope.retailCalendarChange = function() {
        if($scope.retailCalendarDate != null ) {
            $scope.toDate = $scope.retailCalendarDate.toDate;
            $('#toDate').val($scope.toDate);
            $scope.fromDate = $scope.retailCalendarDate.fromDate;
            $('#fromDate').val($scope.fromDate);
        }
    }

    $scope.storeTypeChange = function() {
        $scope.loadingSubmit = true;
        $scope.storeType = $('#storeType').val();
        $http.get(CommonsService.getUrl('/dashboard/assignedStoreList')
            + '&entityId=' + $scope.brandId
            + '&storeType=' + $scope.storeType
            + '&entityKind=1&onlyExternalIds=true')
        .then(function(data) {
            /*id = '#store';
            $(id).empty();
            $(id).append($('<option>', {
                value: '',
                text: 'Todas'
            }));
            for( var i = 0; i < data.data.data.length; i++ ) {
                $(id).append($('<option>', {
                    value: data.data.data[i].identifier,
                    text: data.data.data[i].name
                }));
            }
            $scope.loadingSubmit = false;*/
        });
    }

    $scope.initAPDVisits = function(visitsOnly) {

        Highcharts.setOptions({ colors: ["#7cb5ec", "#434348", "#DEC63B", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]});


        if( visitsOnly == true ) $scope.visitsOnly = true;
        else $scope.visitsOnly = false;

        if(globals.currentUser.role == 1) {
            $('#exportDetails').css('display','block');
            $scope.classUser = 'hidden';
            $scope.classAdmin = '';
            $scope.detailsExportable = '';
        } else {
            $('#exportDetails').css('display','none');
            $scope.classUser = 'hidden';
            $scope.classAdmin = 'hidden';
            $scope.detailsExportable = 'hidden';
        }

        $scope.findRetailCalendarDate();

        $http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
        .then($scope.initAPDVisitsPhase2);
    }

    $scope.initAPDVisitsPhase2 = function(data) {

        var result = data.data.data;
        $scope.brands = result;
        $scope.selectedBrand = $scope.brands[0];
        $scope.brandId = $scope.selectedBrand.identifier;

        if( result.length == 1 ) {
            $('#brandSelectorContainer').css('display','none');
        } else {
            $('#brandSelectorContainer').css('display','block');
        }

        // $scope.brandId = selected;
        // $('#brandId').val(selected);

        // Please change this!
        var revenueStores = new Array(
          'aditivo_mx',
          '98coastav_mx',
          'botanicus_mx',
          'tonymoly_mx',
          'areasmexico_mx',
          'liverpoolboutiques_mx',
          'cafe_balcarce_ar',
          'ecobutik_mx',
          'fullsand_mx',
          'sallybeauty_mx',
          'delicafe_mx',
          'prada_mx',
          'grupopavel_mx',
          'atelier_mx',
          'mt_sport_mx',
          'sbarro_mx',
          'aditivo_franquicias_mx',
          'sunglasshut_ar'
        );
        if( revenueStores.includes( $scope.brandId ) )
            $scope.showRevenue = true;
        else
            $scope.showRevenue = false;

        $scope.updateStoreLabel();
        $scope.updateStoreList('#store', config.baseUrl, $scope.brandId);
        $scope.upadtePagination('#pags');
        //Removed store type
    }

    $scope.updateBrand = function() {
        $scope.loadingSubmit = true;
        $scope.brandId = $scope.selectedBrand.identifier;

        // Please change this!
        var revenueStores = new Array(
          'aditivo_mx',
          '98coastav_mx',
          'botanicus_mx',
          'tonymoly_mx',
          'areasmexico_mx',
          'liverpoolboutiques_mx',
          'cafe_balcarce_ar',
          'ecobutik_mx',
          'fullsand_mx',
          'sallybeauty_mx',
          'delicafe_mx',
          'prada_mx',
          'grupopavel_mx',
          'atelier_mx',
          'mt_sport_mx',
          'sbarro_mx',
          'aditivo_franquicias_mx'
        );
        if( revenueStores.includes( $scope.brandId ) )
            $scope.showRevenue = true;
        else
            $scope.showRevenue = false;

        $scope.updateStoreLabel();
        $scope.updateStoreList('#store', config.baseUrl, $scope.brandId);
        $scope.upadtePagination('#pags');
        $scope.loadingSubmit = false;
    }

    $scope.updateStoreLabel = function() {
        $http.get(CommonsService.getUrl('/dashboard/config')
            + '&entityId=' + $scope.brandId
            + '&entityKind=1')
        .then($scope.postUpdateStoreLabel);
    }

    $scope.postUpdateStoreLabel = function(data) {


      var visitsComments = data.data.visitsComments.split("\n");

        try {
            $scope.storeLabel = data.data.storeLabel;
            if( $scope.storeLabel === undefined || $scope.storeLabel == null )
                $scope.storeLabel = 'Tienda';
        } catch( e ) {
            $scope.storeLabel = 'Tienda';
        }
        try {
            $scope.visitsComments = visitsComments;
        } catch( e ) {
        }

        if ($scope.visitsComments != '' && $scope.visitsComments !== undefined && $scope.classAdmin == 'hidden') {
            $scope.classUser = '';
        }
    }

    $scope.updateComments = function() {
        $scope.loadingSubmit = true;

        $scope.dashboard = {
            entityId: $scope.brandId,
            entityKind: 1,
            visitsComments: $scope.visitsComments
        }

        $http.post((CommonsService.getUrl('/dashboard/config')), $scope.dashboard)
        .then(function(data) {

            if( data.status = 200 && data.data.error_code === undefined ) {
                alert("Los comentarios fueron salvados con éxito");

                ModalService.showModal({
                  templateUrl: "views/modal_alert.html",
                  controller: function($scope, close) {
                    //
                    this.title = "Success";
                    this.body = "Los comentarios fueron salvados con éxito";
                    this.primary = "Ok";
                    this.action = function(){
                      console.log("did stuff");
                    };
                  },controllerAs: "alerta"
                }).then(function(modal) {
                  modal.element.modal();
                  modal.close.then(function($scope, result) {
                    console.log(result);
                  });
                });

                $scope.loadingSubmit = false;

            } else {
                alert("Los comentarios no pudieron salvarse");
            }
        });
    }

    $scope.exportAPDVisits = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        var url =  config.baseUrl + '/dashboard/brandExport'
        + '?authToken=' + $rootScope.globals.currentUser.token
        + '&brandId=' + $scope.brandId
        + '&storeId=' + $scope.storeId.identifier
        + '&fromStringDate=' + $scope.fromDate
        + '&toStringDate=' + $scope.toDate

        window.open(url);
    }

    $scope.exportReport = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        var url =  config.baseUrl + '/dashboard/reportExport'
        + '?authToken=' + $rootScope.globals.currentUser.token
        + '&brandId=' + $scope.brandId
        + '&storeId=' + $scope.storeId.identifier
        + '&fromStringDate=' + $scope.fromDate
        + '&toStringDate=' + $scope.toDate

        window.open(url);
    }

    $scope.exportDetails = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        var url =  config.baseUrl + '/dashboard/visitDetailExport'
        + '?authToken=' + $rootScope.globals.currentUser.token
        + '&brandId=' + $scope.brandId
        + '&storeId=' + $scope.storeId.identifier
        + '&fromStringDate=' + $scope.fromDate
        + '&toStringDate=' + $scope.toDate

        window.open(url);
    }

    $scope.updateAPDVisits = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();
        $scope.storeType = $('#storeType').val();

        $('#brand-table').data( "page-size",  $scope.pagination);

        vm.filterAPDVisits($scope.brandId, $scope.storeId.identifier, $scope.fromDate, $scope.toDate, $scope.storeType);
    }

    $scope.updateGraphs = function(periodType) {
        $scope.periodType = periodType;

        $('#btnGraphDaily').removeClass('active');
        $('#btnGraphWeekly').removeClass('active');
        $('#btnGraphMonthly').removeClass('active');

        if( periodType == 'D' ) {
            $('#btnGraphDaily').addClass('active');
        } else if( periodType == 'W' ) {
            $('#btnGraphWeekly').addClass('active');
        } else if( periodType == 'M' ) {
            $('#btnGraphMonthly').addClass('active');
        }

        $('#visits_by_date').html('');
        vm.updateVisitsByDateChart('#visits_by_date', config.baseUrl, $scope.fromDate, $scope.toDate, $scope.brandId, $scope.storeId, $scope.zoneId, $scope.periodType);
    }

    this.filterAPDVisits = function(brandId, storeId, fromDate, toDate, storeType) {

        $('#visits_by_date').html('');
        $('#visits_by_hour').html('');
        $('#repetitions').html('');
        $('#permanence_by_hour').html('');
        $('#heatmap_traffic_by_hour').html('');
        $('#heatmap_occupation_by_hour').html('');
        $('#heatmap_permanence_by_hour').html('');

        vm.generateGeneralInfo();

        vm.updateVisitsByDateChart('#visits_by_date', config.baseUrl, fromDate, toDate, brandId, storeId,
            $scope.zoneId, $scope.periodType, storeType);
        vm.updateVisitsByHourChart('#visits_by_hour', config.baseUrl, fromDate, toDate, brandId, storeId, $scope.zoneId,
            storeType);
        if( brandId == 'grupopavel_mx') {
            vm.updateRepetitionsChart('#repetitions', config.baseUrl, fromDate, toDate, brandId, storeId, $scope.zoneId,
                storeType);
        }
        vm.updatePermanenceByHourChart('#permanence_by_hour', config.baseUrl, fromDate, toDate, brandId, storeId,
            $scope.zoneId, storeType);
        vm.updateHeatmapTraffic('#heatmap_traffic_by_hour', config.baseUrl, fromDate, toDate, brandId, storeId,
            $scope.zoneId, storeType);
        vm.updateHeatmapPermanence('#heatmap_permanence_by_hour', config.baseUrl, fromDate, toDate, brandId, storeId,
            $scope.zoneId, storeType);
        vm.updateHeatmapOccupation('#heatmap_occupation_by_hour', config.baseUrl, fromDate, toDate, brandId, storeId,
            $scope.zoneId, storeType);
        //vm.updateOfflineDevices('.offline_devices', config.pyServiceUrl, brandId, storeId);

        $scope.loadedClientData = true;
    }

    $scope.updateZoneList = function(id, entityId) {
        $http.get(CommonsService.getUrl('/dashboard/innerZoneList')
            + '&entityId=' + entityId
            + '&entityKind=1')
        .then(function(data) {
            $(id).empty();
            $(id).append($('<option>', {
                value: '',
                text: 'Todas'
            }));

            for( var i = 0; i < data.data.data.length; i++ ) {
                $(id).append($('<option>', {
                    value: data.data.data[i].identifier,
                    text: data.data.data[i].name
                }));
            }
        });
    }

    $scope.updateStoreList = function(id, baseUrl, entityId) {
        if( $scope.brandId == 'volaris_mx' || $scope.brandId == 'bestbuy_mx') {
            $scope.zoneAble = '';
        } else {
            $scope.zoneAble = 'hidden';
        }
        $scope.updateZoneList('#zone', $scope.brandId);

        $http.get(CommonsService.getUrl('/dashboard/assignedStoreList')
            + '&entityId=' + $scope.brandId
            + '&entityKind=1&onlyExternalIds=true')
        .then($scope.postUpdateStoreList);
    }

    $scope.postUpdateStoreList = function(data) {
        id = '#store';
        $(id).empty();

        var result = data.data.data;
        $scope.stores = result;
        $scope.storeId = $scope.stores[0];

    }

    $scope.upadtePagination = function(id) {
      $(id).empty();

      var values = [10, 20, 50, 100];
      for (var i = 0; i < values.length; i++) {
        $(id).append($('<option>', {
            value: values[i],
            text: values[i]
        }));
      }

    }

    $scope.updateStoreType = function(id) {
        $(id).empty();

        var values = [0, 1, 2, 3, 4, 5, 6, 7];
        var text = ['Todas', 'Calle', 'Centro Comercial', 'CETRAM', 'Kiosko', 'Dentro de una tienda departamental',
                'Dentro de una tienda de autoservicios', 'Aeropuerto'];
        for(var i = 0; i < values.length; i++) {
            $(id).append($('<option>', {
                value: values[i],
                text: text[i]
            }));
        }
    }

    this.updateVisitsByDateChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, periodType,
        storeType) {
        // TODO remove storeType ???
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashboard/timelineData'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_visits,'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&eraseBlanks=false'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            if( $scope.showRevenue == true )
                url = baseUrl
                + '/dashboard/timelineData'
                + '?authToken=' + $rootScope.globals.currentUser.token
                + '&entityId=' + eid
                + '&entityKind=' + kind
                + '&subentityId=' + seid
                + '&elementId=apd_visitor'
                + '&subIdOrder=visitor_total_revenue,visitor_total_peasents,visitor_total_visits,visitor_total_tickets,visitor_total_items'
                + '&fromStringDate=' + fromDate
                + '&toStringDate=' + toDate
                + '&eraseBlanks=false'
                + '&timestamp=' + CommonsService.getTimestamp();
            else
                url = baseUrl
                + '/dashboard/timelineData'
                + '?authToken=' + $rootScope.globals.currentUser.token
                + '&entityId=' + eid
                + '&entityKind=' + kind
                + '&subentityId=' + seid
                + '&elementId=apd_visitor'
                + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_tickets,visitor_total_items'
                + '&fromStringDate=' + fromDate
                + '&toStringDate=' + toDate
                + '&eraseBlanks=false'
                + '&timestamp=' + CommonsService.getTimestamp();


        $.getJSON( url,
            function(data) {
                // Disable extra options by default
                // TODO the story type matters?

                var display = [];
                var iterator = 0;

                for( var iterator; iterator < data.series.length; iterator++){
                  if("name" in data.series[iterator]){
                    display.push(data.series[iterator]);
                  }
                }

                var from = 2;
                if( $scope.visitsOnly == true ) from = 1;
                if( $scope.showRevenue == true ) {
                    from = 3;
                    data.series[0].color = 'rgba(26, 179, 148, 0.5)';
                    // data.series[0].color = "#1ab394";
                }
                for( var i = from; i < data.series.length; i++){
                    data.series[i].visible = false;
                }

                $(id).highcharts({
                    chart: {
                        zoomType: 'xy',
                        marginLeft: 60,
                        marginRight: 60,
                        marginTop: 60,
                        marginBottom: 60
                    },
                    title: {
                        text: 'Tráfico por Día'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: [{
                        type: 'linear',
                        title: {
                            text: 'Tráfico por Día'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },{ // Secondary yAxis
                        title: {
                            text: 'Ventas'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }],
                        opposite: true
                    }],
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: display
                });
            });
    };
    this.updateVisitsByHourChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, storeType) {
        // TODO use storeType
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashboard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_visits,'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashboard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_hourly_tickets'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();


        $.getJSON( url,
            function(data) {
                var display = [];
                // Disable extra options by default
                var from = 2;
                var iterator = 0;

                for( var iterator; iterator < data.series.length; iterator++){
                  if("name" in data.series[iterator]){
                    display.push(data.series[iterator]);
                  }
                }

                if( $scope.visitsOnly == true ) from = 1;
                for( var i = from; i < display.length; i++)
                    display[i].visible = false;


                $(id).highcharts({
                    chart: {
                        marginLeft: 80,
                        marginRight: 20,
                        marginTop: 60,
                        marginBottom: 60
                    },
                    title: {
                        y: 20,
                        text: 'Tráfico por Hora'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        type: 'linear',
                        title: {
                            text: 'Tráfico por Hora'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: display
                });
            });
    };

    this.updatePermanenceByHourChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, storeType) {
        // TODO use storeType
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashboard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&subIdOrder=permanence_hourly_visits,'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

        else
            url = baseUrl
            + '/dashboard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&subIdOrder=permanence_hourly_peasents,permanence_hourly_visits'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

        $.getJSON( url,
            function(data) {
                // Disable extra options by default
                if( $scope.visitsOnly == true ) {
                    for( var i = 1; i < data.series.length; i++)
                        data.series[i].visible = false;
                } else {
                    data.series[0].visible = false;
                    for( var i = 2; i < data.series.length; i++)
                        data.series[i].visible = false;
                }

                $(id).highcharts({
                    chart: {
                        marginLeft: 60,
                        marginRight: 20,
                        marginTop: 60,
                        marginBottom: 60
                    },
                    title: {
                        text: 'Permanencia'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: {
                            text: 'Permanencia en Minutos'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ':00 Minutos'
                    },
                    legend: {
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data.series
                });
            });
    };
    this.updateHeatmapTraffic = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, storeType) {
        // TODO use storeType
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashboard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&elementSubId=visitor_total_visits'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=false'
            + '&toMinutes=false'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashboard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&elementSubId=visitor_total_visits,visitor_total_peasents,visitor_hourly_tickets'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=false'
            + '&toMinutes=false'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

        $.getJSON(url,
            function(data) {

                var p = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    for (var z = 0; z < ob.length ; z++){
                      if (ob[z] === null) {
                        ob[z] = 0;
                      }
                    }

                    var p1 = p[ob[0]];
                    if( p1 === null || p1 === undefined )  {
                        p1 = new Array();
                        p[ob[0]] = p1;
                    }
                    var val = ob[3];
                    p1[ob[1]] = val;
                }

                var q = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    for (var z = 0; z < ob.length ; z++){
                      if (ob[z] === null) {
                        ob[z] = 0;
                      }
                    }
                    var q1 = q[ob[0]];
                    if( q1 === null || q1 === undefined )  {
                        q1 = new Array();
                        q[ob[0]] = q1;
                    }
                    var val = ob[4];
                    q1[ob[1]] = val;
                }

                $(id).highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 50,
                        marginRight: 100,
                        height: 500
                    },
                    title: {
                        text: 'Visitas por Hora'
                    },
                    xAxis: {
                        categories: data.xCategories
                    },
                    yAxis: {
                        categories: data.yCategories,
                        title: 'Horarios'
                    },
                    colorAxis: {
                        min: 0,
                        minColor: '#BBDEFB',
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#0D47A1'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 50,
                        symbolHeight: 320
                    },
                    tooltip: {
                        formatter: function() {
                            if( $scope.visitsOnly == true || vo == true ) {
                                return this.point.value + ' <strong>Visitantes</strong>';
                            } else {
                                return this.point.value + ' <strong>Visitantes</strong> <br/>' + p[this.point.x][this.point.y] + ' <strong>Paseantes</strong> <br/>' + q[this.point.x][this.point.y] + ' <strong>Tickets</strong>';
                            }
                        }
                    },
                    series: [{
                        borderWidth: 1,
                        borderColor: '#EEE',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };


    this.updateHeatmapPermanence = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, storeType) {
        // TODO use storeType
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashboard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashboard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits,permanence_hourly_peasents'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

        $.getJSON(url,
            function(data) {

                var p = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    var p1 = p[ob[0]];
                    if( p1 === null || p1 === undefined )  {
                        p1 = new Array();
                        p[ob[0]] = p1;
                    }
                    var val = ob[3];
                    p1[ob[1]] = val;
                }

                $(id).highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 50,
                        marginRight: 100,
                        height: 500
                    },
                    title: {
                        text: 'Permanencia por Hora'
                    },
                    xAxis: {
                        categories: data.xCategories
                    },
                    yAxis: {
                        categories: data.yCategories,
                        title: 'Horarios'
                    },
                    colorAxis: {
                        min: 0,
                        minColor: '#BBDEFB',
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#0D47A1'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 50,
                        symbolHeight: 320
                    },
                    tooltip: {
                        formatter: function() {
                            if( $scope.visitsOnly == true || vo == true ) {
                                return '<strong>Visitantes: </strong>' + this.point.value + ' minutos';
                            } else {
                                return '<strong>Visitantes: </strong>' + this.point.value + ' minutos <br/> <strong>Paseantes: </strong>' + p[this.point.x][this.point.y]    + ' minutos';
                            }
                        }
                    },
                    series: [{
                        borderWidth: 1,
                        borderColor: '#EEE',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };


    // this.renderIcons = function() {
    //       // Move icon
    //       if (!this.series[0].icon) {
    //           this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
    //               .attr({
    //                   'stroke': '#303030',
    //                   'stroke-linecap': 'round',
    //                   'stroke-linejoin': 'round',
    //                   'stroke-width': 2,
    //                   'zIndex': 10
    //               })
    //               .add(this.series[2].group);
    //       }
    //       this.series[0].icon.translate(
    //           this.chartWidth / 2 - 10,
    //           this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
    //               (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
    //       );
    //
    //       // Exercise icon
    //       if (!this.series[1].icon) {
    //           this.series[1].icon = this.renderer.path(
    //               ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8,
    //                   'M', 8, -8, 'L', 16, 0, 8, 8]
    //               )
    //               .attr({
    //                   'stroke': '#ffffff',
    //                   'stroke-linecap': 'round',
    //                   'stroke-linejoin': 'round',
    //                   'stroke-width': 2,
    //                   'zIndex': 10
    //               })
    //               .add(this.series[2].group);
    //       }
    //       this.series[1].icon.translate(
    //           this.chartWidth / 2 - 10,
    //           this.plotHeight / 2 - this.series[1].points[0].shapeArgs.innerR -
    //               (this.series[1].points[0].shapeArgs.r - this.series[1].points[0].shapeArgs.innerR) / 2
    //       );
    //
    //       // Stand icon
    //       if (!this.series[2].icon) {
    //           this.series[2].icon = this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
    //               .attr({
    //                   'stroke': '#303030',
    //                   'stroke-linecap': 'round',
    //                   'stroke-linejoin': 'round',
    //                   'stroke-width': 2,
    //                   'zIndex': 10
    //               })
    //               .add(this.series[2].group);
    //       }
    //
    //       this.series[2].icon.translate(
    //           this.chartWidth / 2 - 10,
    //           this.plotHeight / 2 - this.series[2].points[0].shapeArgs.innerR -
    //               (this.series[2].points[0].shapeArgs.r - this.series[2].points[0].shapeArgs.innerR) / 2
    //       );
    //   }
    // this.updateNewGauges = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, storeType) {
    //   Highcharts.chart('.new_gauge', {
    //     chart: {
    //         type: 'solidgauge',
    //         height: '110%',
    //         events: {
    //             render: this.renderIcons
    //         }
    //     },
    //
    //     title: {
    //         text: 'Activity',
    //         style: {
    //             fontSize: '24px'
    //         }
    //     },
    //
    //     tooltip: {
    //         borderWidth: 0,
    //         backgroundColor: 'none',
    //         shadow: false,
    //         style: {
    //             fontSize: '16px'
    //         },
    //         pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
    //         positioner: function (labelWidth) {
    //             return {
    //                 x: (this.chart.chartWidth - labelWidth) / 2,
    //                 y: (this.chart.plotHeight / 2) + 15
    //             };
    //         }
    //     },
    //
    //     pane: {
    //         startAngle: 0,
    //         endAngle: 360,
    //         background: [{ // Track for Move
    //             outerRadius: '112%',
    //             innerRadius: '88%',
    //             backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
    //                 .setOpacity(0.3)
    //                 .get(),
    //             borderWidth: 0
    //         }, { // Track for Exercise
    //             outerRadius: '87%',
    //             innerRadius: '63%',
    //             backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
    //                 .setOpacity(0.3)
    //                 .get(),
    //             borderWidth: 0
    //         }, { // Track for Stand
    //             outerRadius: '62%',
    //             innerRadius: '38%',
    //             backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2])
    //                 .setOpacity(0.3)
    //                 .get(),
    //             borderWidth: 0
    //         }]
    //     },
    //
    //     yAxis: {
    //         min: 0,
    //         max: 100,
    //         lineWidth: 0,
    //         tickPositions: []
    //     },
    //
    //     plotOptions: {
    //         solidgauge: {
    //             dataLabels: {
    //                 enabled: false
    //             },
    //             linecap: 'round',
    //             stickyTracking: false,
    //             rounded: true
    //         }
    //     },
    //
    //     series: [{
    //         name: 'Move',
    //         data: [{
    //             color: Highcharts.getOptions().colors[0],
    //             radius: '112%',
    //             innerRadius: '88%',
    //             y: 80
    //         }]
    //     }, {
    //         name: 'Exercise',
    //         data: [{
    //             color: Highcharts.getOptions().colors[1],
    //             radius: '87%',
    //             innerRadius: '63%',
    //             y: 65
    //         }]
    //     }, {
    //         name: 'Stand',
    //         data: [{
    //             color: Highcharts.getOptions().colors[2],
    //             radius: '62%',
    //             innerRadius: '38%',
    //             y: 50
    //         }]
    //     }]
    // });
    // }

    this.updateHeatmapOccupation = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, storeType) {
        // TODO use store type
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashboard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_occupation'
            + '&elementSubId=occupation_hourly_visits'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashboard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_occupation,apd_visitor'
            + '&elementSubId=occupation_hourly_visits,occupation_hourly_peasants,visitor_hourly_tickets'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

        $.getJSON(url,
            function(data) {

                var p = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    var p1 = p[ob[0]];
                    if( p1 === null || p1 === undefined )  {
                        p1 = new Array();
                        p[ob[0]] = p1;
                    }
                    var val = ob[3];
                    p1[ob[1]] = val;
                }

                var q = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    var q1 = q[ob[0]];
                    if( q1 === null || q1 === undefined )  {
                        q1 = new Array();
                        q[ob[0]] = q1;
                    }
                    var val = ob[4];
                    q1[ob[1]] = val;
                }

                $(id).highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 70,
                        marginRight: 120,
                        height: 500
                    },
                    title: {
                        text: 'Ocupación por Hora'
                    },
                    xAxis: {
                        categories: data.xCategories
                    },
                    yAxis: {
                        categories: data.yCategories,
                        title: 'Horarios'
                    },
                    colorAxis: {
                        min: 0,
                        minColor: '#BBDEFB',
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#0D47A1'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 50,
                        symbolHeight: 320
                    },
                    tooltip: {
                        formatter: function() {
                            if( $scope.visitsOnly == true || vo == true ) {
                                return this.point.value + ' <strong>Visitantes</strong>';
                            } else {
                                return this.point.value + ' <strong>Visitantes</strong> <br/>' + p[this.point.x][this.point.y] + ' <strong>Paseantes</strong> <br/>' + q[this.point.x][this.point.y] + ' <strong>Tickets</strong>';
                            }
                        }
                    },
                    series: [{
                        borderWidth: 1,
                        borderColor: '#EEE',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#2196F3'
                        }
                    }]
                });
            });
    };
    this.updateBrandPerformanceTable = function(id, baseUrl, fromDate, toDate, entityId, storeType) {
        // TODO use store type
        $http.get(CommonsService.getUrl('/dashboard/brandTableData')
            + '&entityId=' + entityId
            + '&entityKind=1'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&onlyExternalIds=true'
            + '&format=json'
            + '&timestamp=' + CommonsService.getTimestamp())
            .then($scope.fillBrandTable);
    };

    $scope.fillBrandTable = function(data) {
        $('#brand-table>tbody>tr').each(function(index, elem){$(elem).remove();});

        //get the footable object
        var table = $('#brand-table').data('footable');

        var newRow = '';
        for(var i = 0; i < data.data.data.length; i++) {
            var obj = data.data.data[i];
            newRow += $scope.fillBrandRecord(obj, false);
        }

        table.appendRow(newRow);
        $('#brand-table>tfoot>tr').each(function(index, elem){
            if( index == 0 ) $(elem).remove();
        });
        $('#brand-table>tfoot').prepend($scope.fillBrandRecord(data.data.totals, true));

        $('#brand-count').html('&nbsp;(' + data.data.recordCount + ')');
    }

    $scope.fillBrandRecord = function(obj, bold) {

        var formatter1 = new Intl.NumberFormat('en-US');
        var formatter2 = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2 /* this might not be necessary */
        });
        var formatter3 = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2, /* this might not be necessary */
            maximumFractionDigits: 2 /* this might not be necessary */
        });

        var b1 = bold == true ? "<b>" : "";
        var b2 = bold == true ? "</b>" : "";

        var row = '<tr>'
                + '<td data-value="' + obj.title + '">' + b1 + obj.title + b2 + '</td>'
                + '<td data-value="' + obj.peasants + '"><center>'  + b1 + formatter1.format(obj.peasants) + b2 + '</center></td>'
                + '<td data-value="' + obj.visitors + '"><center>'  + b1 +  formatter1.format(obj.visitors) + b2 + '</center></td>'
                + '<td data-value="' + obj.tickets + '"><center>'  + b1 +  formatter1.format(obj.tickets) + b2 + '</center></td>'
                + '<td data-value="' + obj.items + '"><center>'  + b1 +  formatter1.format(obj.items) + b2 + '</center></td>'
                + '<td data-value="' + obj.revenue + '"><center>'  + b1 +  formatter2.format(obj.revenue) + b2 + '</center></td>'
                + '<td data-value="' + obj.visitsConversion + '"><center>'  + b1 + formatter3.format(obj.visitsConversion) + '%' + b2 + '</center></td>'
                + '<td data-value="' + obj.ticketsConversion + '"><center>'  + b1 + formatter3.format(obj.ticketsConversion) + '%' + b2 + '</center></td>'
                + '<td data-value="' + obj.higherDay + '"><center>'  + b1 + obj.higherDay + b2 + '</center></td>'
                + '<td data-value="' + obj.lowerDay + '"><center>'  + b1 + obj.lowerDay + b2 + '</center></td>'
                + '<td data-value="' + obj.averagePermanence + '"><center>'  + b1 + formatter1.format(obj.averagePermanence) + ' mins' + b2 + '</center></td>'
                + '</tr>';
        return row;
    }


    this.backup_updateBrandPerformanceTable = function(id, baseUrl, fromDate, toDate, entityId, sotreType) {
        $.getJSON(
            baseUrl
            + '/dashboard/brandTableData'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + entityId
            + '&entityKind=1'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&onlyExternalIds=true'
            + '&timestamp=' + CommonsService.getTimestamp(),
            function(data) {
                var tab = '';
                tab = '<table class="table table-striped" style="text-align: center;" >';
                tab += '<tr style="font-weight:bold;">';
                tab += '<td style="text-align: left; border-right: 1px solid gray;">' + $scope.storeLabel + '</td>';
                if( $scope.visitsOnly == false )
                    tab += '<td>Paseantes</td>';                    // 1
                tab += '<td>Visitantes</td>';                       // 2
                if( $scope.visitsOnly == false ) {
                    tab += '<td>Tickets</td>';                      // 3
                    if( entityId != 'volaris_mx' ) {
                        tab += '<td>Ventas</td>';                   // 4
                    }
                    tab += '<td>Visitantes/Paseantes</td>';         // 5
                    tab += '<td>Tickets/Visitantes</td>';           // 6
                }
                tab += '<td>Día más Alto</td>';                     // 7
                tab += '<td>Día más Bajo</td>';                     // 8
                tab += '<td>Permanencia Promedio</td>';             // 9
                tab += '</tr>';
                tab += '<tbody>';
                for (var i = 1; i < data.length - 1; i++) {
                    tab += '<tr>';
                    tab += '<td style="text-align: left; border-right: 1px solid gray;">' + data[i][0] + '</td>';
                    for (var x = 1; x < data[i].length; x++) {
                        if ( $scope.visitsOnly == false ) {
                            if ( x == 0 || x == 4 || x == 6 || x == 8 ) {
                                if( $scope.visitsOnly == false || (x != 4 && x != 6) ) {
                                    tab += '<td style="border-right: 1px solid gray;">' + data[i][x] + '</td>';
                                }
                            } else {
                                if( $scope.visitsOnly == false || (x != 1 && x != 4) ) {
                                    tab += '<td>' + data[i][x] + '</td>';
                                }
                            }
                        }else{
                            if (x == 0 || x == 3 || x == 5 || x == 7) {
                                if( $scope.visitsOnly == false || (x != 3 && x != 5) ) {
                                    tab += '<td style="border-right: 1px solid gray;">' + data[i][x] + '</td>';
                                }
                            } else {
                                if( $scope.visitsOnly == false || (x != 1 && x != 4 && x != 6) ) {
                                    tab += '<td>' + data[i][x] + '</td>';
                                }
                            }
                        }
                    }// end for
                    tab += '</tr>';
                }
                tab += '<tr style="font-weight:bold;">';
                tab += '<td style="text-align: left; border-right: 1px solid gray;">' + data[data.length - 1][0] + '</td>';
                for (var x = 1; x < data[data.length - 1].length; x++) {
                    if ($scope.visitsOnly == false ) {
                        if (x == 0 || x == 4 || x == 6 || x == 8) {
                            if( $scope.visitsOnly == false || (x != 4 && x != 6)) {
                                tab += '<td style="border-right: 1px solid gray;">' + data[data.length - 1][x] + '</td>';
                            }
                        } else {
                            if( $scope.visitsOnly == false || (x != 1 && x != 4)) {
                                tab += '<td>' + data[data.length - 1][x] + '</td>';
                            }
                        }
                    }else {
                        if (x == 0 || x == 3 || x == 5 || x == 7) {
                            if( $scope.visitsOnly == false || (x != 3 && x != 5)) {
                                tab += '<td style="border-right: 1px solid gray;">' + data[data.length - 1][x] + '</td>';
                            }
                        } else {
                            if( $scope.visitsOnly == false || (x != 1 && x != 4 && x != 6)) {
                                tab += '<td>' + data[data.length - 1][x] + '</td>';
                            }
                        }
                    }
                }
                tab += '</tr></tbody></table>';

                tab += '</tbody>';
                tab += '</table>';
                $(id).html(tab);
            });
    };

    return vm;
};


angular
.module('bdb')
.controller('APDVisitsCtrl', APDVisitsCtrl);
