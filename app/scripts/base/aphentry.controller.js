/**
 * APHEntryCtrl - controller
 */
 function APHEntryCtrl($rootScope, $scope, AuthenticationService, CommonsService, $rootScope, $http, $stateParams) {

    var vm = this;

    var globals = AuthenticationService.getCredentials();
    var credentials = globals.currentUser;

    $scope.init = function() {
        if( $stateParams.identifier !== undefined ) {
            $scope.identifier = decodeURIComponent($stateParams.identifier);
        } else {
            $scope.identifier = document.getElementById('identifierParam').value;
        }

        $scope.buildGraphics();
    }

    $scope.buildGraphics = function() {
        $scope.updateArtificialRSSI('artificialrssi', config.baseUrl, $scope.identifier);
    }

    $scope.updateArtificialRSSI = function(id, baseUrl, identifier) {
        $.getJSON(
            baseUrl 
            + '/dashboard/aphentryData'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&identifier=' + encodeURIComponent(identifier)
            + '&original=false',
            function(data) {
                data.series[1].color = 'blue';
                for( var i = 2; i < data.series.length; i++ ) {
                    if( data.series[i].checkinType == 3 ) {
                        data.series[i].color = 'gray';
                    }
                    else {
                        data.series[i].color = 'green';
                    }
                }

                console.log(data.apdevice);

                // Create the chart
                Highcharts.stockChart(id, {

                    rangeSelector: {
                        buttons: [{
                            type: 'hour',
                            count: 1,
                            text: '1h'
                        }, {
                            type: 'all',
                            text: 'Todo'
                        }],
                        inputEnabled: false, // it supports only days
                        selected: 1 // all
                    },

                    chart: {
                        type: 'stockChart',
                        height: 800,
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'RSSI Interpolado'
                    },
                    xAxis: {
                        categories: data.categories
                    },

                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'RSSI Original'
                        },
                        height: '20%',
                        offset: 0,
                        lineWidth: 2
                    }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'RSSI Interpolado'
                        },
                        top: '25%',
                        height: '20%',
                        offset: 0,
                        lineWidth: 2
                    }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'Paseante'
                        },
                        top: '50%',
                        height: '20%',
                        offset: 0,
                        lineWidth: 2,
                        plotLines: [{
                            value: data.apdevice.peasantPowerThreshold,
                            color: 'green',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: 'Potencia de Paseante'
                            }
                        }]
                    }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'Visita'
                        },
                        top: '75%',
                        height: '20%',
                        offset: 0,
                        lineWidth: 2,
                        plotLines: [{
                            value: data.apdevice.visitPowerThreshold,
                            color: 'green',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: 'Potencia de Visitante'
                            }
                        }]
                    }],

                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
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

    return vm;
};

angular
.module('bdb')
.controller('APHEntryCtrl', APHEntryCtrl);