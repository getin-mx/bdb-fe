/**
 * DashboardCtrl - controller
 */
 function DashboardCtrl($rootScope, $scope, $http, $stateParams, $location, CommonsService, AuthenticationService, SweetAlert, $timeout, $filter) {

 	var vm = this;

	// List variables
  $scope.loadedClientData = false;
	$scope.brands = null;
	$scope.brand = null;

	$scope.stores = null;
	$scope.storeId = null;

	$scope.periodType = null;
	$scope.periodTypes = null;

	$scope.retailCalendar = config.retailCalendar;
	$scope.retailCalendarDate = null;

	$scope.monthCalendar = config.monthCalendar;
	$scope.monthCalendarDate = null;

	$scope.quarterCalendar = config.quarterCalendar;
	$scope.quarterCalendarDate = null;

	$scope.annualCalendar = config.annualCalendar;
	$scope.annualCalendarDate = null;

	$scope.storeType = null;
	$scope.storeTypes = null;

  $scope.storeLabel = '';
  $scope.info = {
    conversionVisits: 0.0,
    conversionTickets: 0.0
  };

	// Global variables
	var globals = AuthenticationService.getCredentials();
	var credentials = globals.currentUser;

  var filterResponseByName = function(evalArray, options = []) {
    var newArray = [];
    newArray = evalArray.filter(function(dataset) {
      if(options.includes(dataset["name"])){
        return dataset;
      }
    });
    return newArray;
  };

	$scope.formatter1 = new Intl.NumberFormat('en-US');
	$scope.formatter2 = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	$scope.formatter3 = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2, /* this might not be necessary */
		maximumFractionDigits: 2 /* this might not be necessary */
	});

	// Class variables
	$scope.rangeVisible = 'hidden';
	$scope.weekVisible = 'hidden';
	$scope.monthVisible = 'hidden';
	$scope.quarterVisible = 'hidden';
	$scope.annualVisible = 'hidden';


	// Init Dashboard
	$scope.initDashboard = function() {
		$scope.setPeriodTypes();
		$scope.setStoreTypes();
		$scope.setAvailableStores();
	}

	// Updates the dashboard to new information
	$scope.updateDashboard = function() {
    $scope.loadedClientData = true;
		$scope.generateGeneralInfo();
		$scope.generateVisitsByHourChart();
		$scope.generateTrafficByHourHeatmap();
		$scope.generateOccupationHeatmap();
		$scope.generatePermanenceEntryHeatmap();
		$scope.generatePermanenceExitHeatmap();
		$scope.generateBrandPerformanceTable();
    $scope.generateConversionGauges();
    $scope.generateVisitsGraph();
	}

  $scope.generateVisitsGraph = function() {
    $('#visits_by_date').html('');
    $scope.updateVisitsByDateChart('#visits_by_date', config.baseUrl, $scope.fromDate, $scope.toDate,
      $scope.brandId, $scope.storeId, $scope.zoneId, $scope.periodType);
  }

  $scope.updateVisitsByDateChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, periodType) {
      var url = null;
      var eid;
      var seid;
      var kind;
      var vo = false;

      // if( zoneId === undefined || zoneId == '') {
      //     eid = entityId;
      //     seid = subEntityId;
      //     kind = 1;
      //     vo = false;
      // } else {
      //     eid = zoneId;
      //     seid = zoneId;
      //     kind = 20;
      //     vo = true;
      // }

      if( $scope.zoneId === undefined || $scope.zoneId == '') {
        eid = $scope.brand.id;
        seid = $scope.store.id;
        kind = 1;
        vo = false;
      } else {
        eid = $scope.zoneId;
        seid = $scope.zoneId;
        kind = 20;
        vo = true;
      }

      $scope.updateGraphs = function(periodType) {
          $scope.periodType = periodType;

          $('#btnGraphDaily').removeClass('active');
          $('#btnGraphWeekly').removeClass('active');
          $('#btnGraphMonthly').removeClass('active');
          $('#btnGraphYearly').removeClass('active');

          if( periodType == 'D' ) {
              $('#btnGraphDaily').addClass('active');
          } else if( periodType == 'W' ) {
              $('#btnGraphWeekly').addClass('active');
          } else if( periodType == 'M' ) {
              $('#btnGraphMonthly').addClass('active');
          } else if( periodType == 'Y' ) {
              $('#btnGraphYearly').addClass('active');
          }

          $('#visits_by_date').html('');
          $scope.updateVisitsByDateChart('#visits_by_date', config.baseUrl, $scope.fromDate, $scope.toDate,
            $scope.brandId, $scope.storeId, $scope.zoneId, $scope.periodType);
      }

      $scope.showRevenue = true;

      if( $scope.visitsOnly == true || vo == true )
          url = baseUrl
          + '/dashboard/timelineData'
          + '?authToken=' + $rootScope.globals.currentUser.token
          + '&entityId=' + eid
          + '&entityKind=' + kind
          + '&subentityId=' + seid
          + '&elementId=apd_visitor'
          + '&subIdOrder=visitor_total_visits,'
          + 'visitor_total_visits_ios,visitor_total_visits_android'
          + '&fromStringDate=' + fromDate
          + '&toStringDate=' + toDate
          + '&periodType=' + periodType
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
              + '&subIdOrder=visitor_total_revenue,visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
              + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android,visitor_total_tickets,visitor_total_items'
              + '&fromStringDate=' + fromDate
              + '&toStringDate=' + toDate
              + '&periodType=' + periodType
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
              + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
              + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android,visitor_total_tickets,visitor_total_items'
              + '&fromStringDate=' + fromDate
              + '&toStringDate=' + toDate
              + '&periodType=' + periodType
              + '&eraseBlanks=false'
              + '&timestamp=' + CommonsService.getTimestamp();


      $.getJSON( url,
          function(data) {
              // Disable extra options by default
              const subarray = filterResponseByName(data.series, ["Revenue", "Paseantes", "Visitas", "Tickets", "Items Vendidos"]
            );
              var from = 2;
              if( $scope.visitsOnly == true ) from = 1;
              if( $scope.showRevenue == true ) {
                  from = 3;
                  subarray[0].color = 'rgba(26, 179, 148, 0.5)';
                  // data.series[0].color = "#1ab394";
              }
              //restrict to first 3 results
              // for( var i = from; i < data.series.length; i++){
              //     subarray[i].visible = false;
              // }

              $(id).highcharts({
                  chart: {
                      zoomType: 'xy',
                      marginLeft: 200,
                      marginRight: 200
                  },
                  title: {
                      text: ''
                  },
                  xAxis: {
                      categories: data.categories
                  },
                  yAxis: [{
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
                      layout: 'vertical',
                      align: 'right',
                      verticalAlign: 'middle',
                      borderWidth: 0
                  },
                  plotOptions: {
                      line: {
                          dataLabels: {
                              enabled: false
                          },
                          enableMouseTracking: false
                      }
                  },
                  series: subarray
              });
          });
  };

  $scope.generateConversionGauges = function() {
    $('.conversion_tickets').highcharts({
        chart: {
          type: 'solidgauge',
        },
        title: null,
        pane: {
          center: ['70%', '50%'],
          size: '70%',
          startAngle: -90,
          endAngle: 90,
          background: {
              backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
          }
        },
        tooltip: {
          enabled: false
        },
        // the value axis
        yAxis: {
          min: 0,
          max: 100,
          stops: [
            [0.1, '#1ab394'], // green
            [0.5, '#1ab394'], // yellow
            [0.9, '#1ab394'] // red
          ],
          lineWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          labels: {
              y: 16
          }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Tickets',
            data: [$scope.info.conversionTickets],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:24px;color:grey;' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span><br/>' +
                       '</div>'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }],
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 70,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
     });

  $('.conversion_visits').highcharts({
      chart: {
        type: 'solidgauge',
      },
      title: null,
      pane: {
        center: ['70%', '50%'],
        size: '70%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },
      // the value axis
      yAxis: {
        min: 0,
        max: 100,
        stops: [
          [0.1, '#1ab394'], // green
          [0.5, '#1ab394'], // yellow
          [0.9, '#1ab394'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
            y: 16
        }
      },
      credits: {
          enabled: false
      },
      series: [{
          name: 'Conversion Visits',
          data: [$scope.info.conversionVisits],
          dataLabels: {
              format: '<div style="text-align:center"><span style="font-size:26px;color:grey;' +
                  ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span><br/>' +
                     '</div>'
          },
          tooltip: {
              valueSuffix: ' km/h'
          }
      }],
      plotOptions: {
          solidgauge: {
              dataLabels: {
                  y: 70,
                  borderWidth: 0,
                  useHTML: true
              }
          }
      }
   });
  };

	// Visits by hour
	$scope.generateVisitsByHourChart = function() {
		var params = null;

		var eid;
		var seid;
		var kind;
		var vo = false;

		if( $scope.zoneId === undefined || $scope.zoneId == '') {
			eid = $scope.brand.id;
			seid = $scope.store.id;
			kind = 1;
			vo = false;
		} else {
			eid = $scope.zoneId;
			seid = $scope.zoneId;
			kind = 20;
			vo = true;
		}

		if( $scope.visitsOnly == true || vo == true )
			params = '&entityId=' + eid
			+ '&entityKind=' + kind
			+ '&subentityId=' + seid
			+ '&elementId=apd_visitor'
			+ '&subIdOrder=visitor_total_visits'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
			+ '&eraseBlanks=true'
			+ '&timestamp=' + CommonsService.getTimestamp();
		else
			params = '&entityId=' + eid
			+ '&entityKind=' + kind
			+ '&subentityId=' + seid
			+ '&elementId=apd_visitor'
			+ '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_hourly_tickets'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
			+ '&eraseBlanks=true'
			+ '&timestamp=' + CommonsService.getTimestamp();

		$http.get(CommonsService.getUrl('/dashboard/timelineHour') + params)
			.then(function(res) {

				var data = res.data;
				// Disable extra options by default
				var from = 2;
				if( $scope.visitsOnly == true ) from = 1;
				for( var i = from; i < data.series.length; i++)
					data.series[i].visible = false;
				$('#visits_by_hour').highcharts({
					chart: {
						marginLeft: 50,
						marginRight: 150,
						height: 200
					},
					title: {
						text: ''
					},
					xAxis: {
						categories: data.categories
					},
					yAxis: {
						title: {
							text: ''
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


  $scope.generateTrafficByHourHeatmap = function() {
		var params = null;

		var eid;
		var seid;
		var kind;
		var vo = false;

		if( $scope.zoneId === undefined || $scope.zoneId == '') {
			eid = $scope.brand.id;
			seid = $scope.store.id;
			kind = 1;
			vo = false;
		} else {
			eid = $scope.zoneId;
			seid = $scope.zoneId;
			kind = 20;
			vo = true;
		}

        if( $scope.visitsOnly == true || vo == true )
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&elementSubId=visitor_total_visits'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=false'
            + '&toMinutes=false'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&elementSubId=visitor_total_visits,visitor_total_peasents,visitor_hourly_tickets'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=false'
            + '&toMinutes=false'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

		$http.get(CommonsService.getUrl('/dashboard/heatmapTableHour') + params)
			.then(function(res) {

				var data = res.data;

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

                $('#heatmap_traffic_by_hour').highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 100,
                        marginRight: 200,
                        height: 300
                    },
                    title: {
                        text: ''
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
                        minColor: '#FFFFFF',
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#137499'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 25,
                        symbolHeight: 280
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
                        borderColor: '#137499',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };


    $scope.generateOccupationHeatmap = function() {
		var params = null;

		var eid;
		var seid;
		var kind;
		var vo = false;

		if( $scope.zoneId === undefined || $scope.zoneId == '') {
			eid = $scope.brand.id;
			seid = $scope.store.id;
			kind = 1;
			vo = false;
		} else {
			eid = $scope.zoneId;
			seid = $scope.zoneId;
			kind = 20;
			vo = true;
		}

        if( $scope.visitsOnly == true || vo == true )
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_occupation'
            + '&elementSubId=occupation_hourly_visits'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_occupation,apd_visitor'
            + '&elementSubId=occupation_hourly_visits,occupation_hourly_peasants,visitor_hourly_tickets'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

		$http.get(CommonsService.getUrl('/dashboard/heatmapTableHour') + params)
			.then(function(res) {

				var data = res.data;

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

                $('#heatmap_occupation_by_hour').highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 100,
                        marginRight: 200,
                        height: 300
                    },
                    title: {
                        text: ''
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
                        minColor: '#FFFFFF',
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#137499'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 25,
                        symbolHeight: 280
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
                        borderColor: '#137499',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };

    $scope.generatePermanenceEntryHeatmap = function() {
		var params = null;

		var eid;
		var seid;
		var kind;
		var vo = false;

		if( $scope.zoneId === undefined || $scope.zoneId == '') {
			eid = $scope.brand.id;
			seid = $scope.store.id;
			kind = 1;
			vo = false;
		} else {
			eid = $scope.zoneId;
			seid = $scope.zoneId;
			kind = 20;
			vo = true;
		}

        if( $scope.visitsOnly == true || vo == true )
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits,permanence_hourly_peasents'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

		$http.get(CommonsService.getUrl('/dashboard/heatmapTableHour') + params)
			.then(function(res) {

				var data = res.data;

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

                $('#heatmap_permanence_by_hour').highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 100,
                        marginRight: 200,
                        height: 300
                    },
                    title: {
                        text: ''
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
                        minColor: '#FFFFFF',
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#137499'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 25,
                        symbolHeight: 280
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
                        borderColor: '#137499',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };

    $scope.generatePermanenceExitHeatmap = function() {
		var params = null;

		var eid;
		var seid;
		var kind;
		var vo = false;

		if( $scope.zoneId === undefined || $scope.zoneId == '') {
			eid = $scope.brand.id;
			seid = $scope.store.id;
			kind = 1;
			vo = false;
		} else {
			eid = $scope.zoneId;
			seid = $scope.zoneId;
			kind = 20;
			vo = true;
		}

        if( $scope.visitsOnly == true || vo == true )
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            params = '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits,permanence_hourly_peasents'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

		$http.get(CommonsService.getUrl('/dashboard/heatmapTableHour') + params)
			.then(function(res) {

				var data = res.data;

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

                $('#heatmap_permanence_by_hour_exit').highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 100,
                        marginRight: 200,
                        height: 300
                    },
                    title: {
                        text: ''
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
                        minColor: '#FFFFFF',
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#137499'
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'top',
                        y: 25,
                        symbolHeight: 280
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
                        borderColor: '#137499',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };

    $scope.generateGeneralInfo = function() {
        console.log($scope.storeType)
        $http.get(CommonsService.getUrl('/dashboard/generalData')
            + '&entityId=' + $scope.brand.id
            + '&subentityId=' + $scope.store.id
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

            $scope.generateConversionGauges();

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

    $scope.generateBrandPerformanceTable = function() {
        $http.get(CommonsService.getUrl('/dashboard/brandTableData')
            + '&entityId=' + $scope.brand.id
            + '&entityKind=1'
			+ '&fromStringDate=' + $scope.fromDate
			+ '&toStringDate=' + $scope.toDate
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
	        var row = '<tr>'
	                + '<td data-value="' + obj.title + '">' + obj.title + '</td>'
	                + '<td data-value="' + obj.peasants + '"><center>' + $scope.formatter1.format(obj.peasants) + '</center></td>'
	                + '<td data-value="' + obj.visitors + '"><center>' +  $scope.formatter1.format(obj.visitors) + '</center></td>'
	                + '<td data-value="' + obj.tickets + '"><center>' +  $scope.formatter1.format(obj.tickets) + '</center></td>'
	                + '<td data-value="' + obj.revenue + '"><center>' +  $scope.formatter2.format(obj.revenue) + '</center></td>'
	                + '<td data-value="' + obj.visitsConversion + '"><center>' + $scope.formatter3.format(obj.visitsConversion) + '%' + '</center></td>'
	                + '<td data-value="' + obj.ticketsConversion + '"><center>' + $scope.formatter3.format(obj.ticketsConversion) + '%' + '</center></td>'
	                + '<td data-value="' + obj.higherDay + '"><center>' + obj.higherDay + '</center></td>'
	                + '<td data-value="' + obj.lowerDay + '"><center>' + obj.lowerDay + '</center></td>'
	                + '<td data-value="' + obj.averagePermanence + '"><center>' + $scope.formatter1.format(obj.averagePermanence) + ' mins' + '</center></td>'
	                + '</tr>';

            newRow += row;
        }

        table.appendRow(newRow);

        $('#brand-count').html('&nbsp;(' + data.data.recordCount + ')');
    }

	// Define available stores
	$scope.setAvailableStores = function() {

		$http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
		.then(function(data) {
			$scope.brands = Array();
			for( var i = 0; i < data.data.data.length; i++ ) {
				var brand = {
					id: data.data.data[i].identifier,
					name: data.data.data[i].name
				}
				$scope.brands.push(brand);
			}
			$scope.brand = $scope.brands[0];
			$scope.brandChange();
		});
	}

	// Define period Types
	$scope.setPeriodTypes = function() {

		$scope.periodTypes = Array();

		$scope.periodTypes.push({
			id: 'week',
			name: 'Semana Retail'
		});

		$scope.periodTypes.push({
			id: 'month',
			name: 'Mensual'
		});

		$scope.periodTypes.push({
			id: 'quarter',
			name: 'Trimestral'
		});

		$scope.periodTypes.push({
			id: 'annual',
			name: 'Anual'
		});

		$scope.periodTypes.push({
			id: 'range',
			name: 'Rango de Fechas'
		});

		$scope.periodType = $scope.periodTypes[0];
		$scope.periodTypeChange();
		$scope.findCalendarDate();

	}

	// Define store Types
	$scope.setStoreTypes = function() {

		$scope.storeTypes = Array();

		$scope.storeTypes.push({
			id: '0',
			name: 'Todas'
		});

		$scope.storeTypes.push({
			id: '1',
			name: 'A pie de calle'
		});

		$scope.storeTypes.push({
			id: '2',
			name: 'Centro Comercial'
		});

		$scope.storeTypes.push({
			id: '3',
			name: 'En CETRAM / Metro'
		});

    $scope.storeTypes.push({
      id: '4',
      name: 'Kiosko'
    });

    $scope.storeTypes.push({
      id: '5',
      name: 'En tienda departamental'
    });

    $scope.storeTypes.push({
      id: '6',
      name: 'En tienda de autoservicio'
    });

    $scope.storeTypes.push({
      id: '7',
      name: 'En aereopuerto'
    });

		$scope.storeType = $scope.storeTypes[0];

	}

	// Update Stores when a brand is changed
	$scope.brandChange = function() {

        $scope.updateStoreLabel();

		$scope.stores = new Array();
		$scope.loadingSubmit = true;
    $http.get(CommonsService.getUrl('/dashboard/assignedStoreList')
			+ '&entityId=' + $scope.brand.id
      + '&storeType=' + $scope.storeType.id
			+ '&entityKind=1&onlyExternalIds=true')
		.then(function(data) {

			$scope.stores = Array();
			var store = {
				id: null,
				name: 'Todas'
			}
			$scope.stores.push(store);

			for( var i = 0; i < data.data.data.length; i++ ) {
				var store = {
					id: data.data.data[i].identifier,
					name: data.data.data[i].name
				}
				$scope.stores.push(store);
			}
			$scope.store = $scope.stores[0];
			$scope.loadingSubmit = false;
		});
	}

  // Update Stores when a Store Type is changed
  $scope.storeTypeChange = function() {

    //$scope.updateStoreLabel(); //TODO remove?

    $scope.stores = new Array();
    $scope.loadingSubmit = true;
    $http.get(CommonsService.getUrl('/dashboard/assignedStoreList')
      + '&entityId=' + $scope.brand.id
      + '&storeType=' + $scope.storeType.id
      + '&entityKind=1&onlyExternalIds=true')
    .then(function(data) {

      $scope.stores = Array();
      var store = {
        id: null,
        name: 'Todas'
      }
      $scope.stores.push(store);

      for( var i = 0; i < data.data.data.length; i++ ) {
        //if(data.data.data[i].storeType == $scope.storeType.id) {
          var store = {
            id: data.data.data[i].identifier,
            name: data.data.data[i].name
          }
          $scope.stores.push(store);
        //} // TODO removes
      }
      $scope.store = $scope.stores[0];
      $scope.loadingSubmit = false;
    });
  }

	$scope.updateStoreLabel = function() {
		$http.get(CommonsService.getUrl('/dashboard/config')
			+ '&entityId=' + $scope.brandId
			+ '&entityKind=1')
		.then(function(data) {
			try {
				$scope.storeLabel = data.data.storeLabel;
				if( $scope.storeLabel === undefined || $scope.storeLabel == null )
					$scope.storeLabel = 'Tienda';
			} catch( e ) {
				$scope.storeLabel = 'Tienda';
			}
			try {
				$scope.visitsComments = data.data.visitsComments;
			} catch( e ) {
			}

			if ($scope.visitsComments != '' && $scope.visitsComments !== undefined && $scope.classAdmin == 'hidden') {
				$scope.classUser = '';
			}
		});
	}

	// Changes on period type
	$scope.periodTypeChange = function() {

		if( $scope.periodType.id == 'range') {
			$scope.rangeVisible = '';
			$scope.weekVisible = 'hidden';
			$scope.monthVisible = 'hidden';
			$scope.quarterVisible = 'hidden';
			$scope.annualVisible = 'hidden';
      $scope.rangeCalendarChange();
		} else if( $scope.periodType.id == 'week') {
			$scope.rangeVisible = 'hidden';
			$scope.weekVisible = '';
			$scope.monthVisible = 'hidden';
			$scope.quarterVisible = 'hidden';
			$scope.annualVisible = 'hidden';
      $scope.retailCalendarChange();
		} else if( $scope.periodType.id == 'month') {
			$scope.rangeVisible = 'hidden';
			$scope.weekVisible = 'hidden';
			$scope.monthVisible = '';
			$scope.quarterVisible = 'hidden';
			$scope.annualVisible = 'hidden';
      $scope.monthCalendarChange();
		} else if( $scope.periodType.id == 'quarter') {
			$scope.rangeVisible = 'hidden';
			$scope.weekVisible = 'hidden';
			$scope.monthVisible = 'hidden';
			$scope.quarterVisible = '';
			$scope.annualVisible = 'hidden';
      $scope.quarterCalendarChange();
		} else if( $scope.periodType.id == 'annual') {
			$scope.rangeVisible = 'hidden';
			$scope.weekVisible = 'hidden';
			$scope.monthVisible = 'hidden';
			$scope.quarterVisible = 'hidden';
			$scope.annualVisible = '';
      $scope.annualCalendarChange();
		}
	}

  $scope.rangeCalendarChange = function(modelName, time) {
    if(modelName == "from") {
      $scope.fromDate = moment(time).format("YYYY-MM-DD");
    }
    if(modelName == "to") {
      $scope.toDate = moment(time).format("YYYY-MM-DD");
    }
  }

	// Change on retail calendar
	$scope.retailCalendarChange = function() {
		if($scope.retailCalendarDate != null ) {
			$scope.toDate = $scope.retailCalendarDate.toDate;
			$('#toDate').val($scope.toDate);
			$scope.fromDate = $scope.retailCalendarDate.fromDate;
			$('#fromDate').val($scope.fromDate);
		}
	}

	// Change on month calendar
	$scope.monthCalendarChange = function() {
		if($scope.monthCalendarDate != null ) {
			$scope.toDate = $scope.monthCalendarDate.toDate;
			$('#toDate').val($scope.toDate);
			$scope.fromDate = $scope.monthCalendarDate.fromDate;
			$('#fromDate').val($scope.fromDate);
		}
	}

	// Change on quarter calendar
	$scope.quarterCalendarChange = function() {
		if($scope.quarterCalendarDate != null ) {
			$scope.toDate = $scope.quarterCalendarDate.toDate;
			$('#toDate').val($scope.toDate);
			$scope.fromDate = $scope.quarterCalendarDate.fromDate;
			$('#fromDate').val($scope.fromDate);
		}
	}

	// Change on annual calendar
	$scope.annualCalendarChange = function() {
		if($scope.annualCalendarDate != null ) {
      console.log($scope.annualCalendarChange);
			$scope.toDate = $scope.annualCalendarDate.toDate;
			$('#toDate').val($scope.toDate);
			$scope.fromDate = $scope.annualCalendarDate.fromDate;
			$('#fromDate').val($scope.fromDate);
		}
	}

	// Find Dates
	$scope.findCalendarDate = function() {
		var d = new Date(new Date().getTime() - config.oneDay).format("yyyy-mm-dd");
		for( var i = 0; i < $scope.retailCalendar.length; i++ ) {
			if($scope.retailCalendar[i].fromDate <= d && $scope.retailCalendar[i].toDate >= d)
				$scope.retailCalendarDate = $scope.retailCalendar[i];
		}
		for( var i = 0; i < $scope.monthCalendar.length; i++ ) {
			if($scope.monthCalendar[i].fromDate <= d && $scope.monthCalendar[i].toDate >= d)
				$scope.monthCalendarDate = $scope.monthCalendar[i];
		}
		for( var i = 0; i < $scope.quarterCalendar.length; i++ ) {
			if($scope.quarterCalendar[i].fromDate <= d && $scope.quarterCalendar[i].toDate >= d)
				$scope.quarterCalendarDate = $scope.quarterCalendar[i];
		}
		for( var i = 0; i < $scope.annualCalendar.length; i++ ) {
			if($scope.annualCalendar[i].fromDate <= d && $scope.annualCalendar[i].toDate >= d)
				$scope.annualCalendarDate = $scope.annualCalendar[i];
		}

		if( $scope.periodType.id == 'week') {
			$scope.retailCalendarChange();
		} else if( $scope.periodType.id == 'month') {
			$scope.monthCalendarChange();
		} else if( $scope.periodType.id == 'quarter') {
			$scope.quarterCalendarChange();
		} else if( $scope.periodType.id == 'annual') {
			$scope.annualCalendarChange();
		}
	}

	return vm;
};

/**
 * dashboardFlotTwo - simple controller for data
 * for Flot chart in Dashboard view
 */
 function dashboardFlotTwo() {

 	var data1 = [
 	[gd(2012, 1, 1), 50],
 	[gd(2012, 1, 2), 66],
 	[gd(2012, 1, 3), 47],
 	[gd(2012, 1, 4), 89],
 	[gd(2012, 1, 5), 90],
 	[gd(2012, 1, 6), 24],
 	[gd(2012, 1, 7), 5],
 	[gd(2012, 1, 8), 45],
 	[gd(2012, 1, 9), 70],
 	[gd(2012, 1, 10), 8],
 	[gd(2012, 1, 11), 9],
 	[gd(2012, 1, 12), 40],
 	[gd(2012, 1, 13), 49],
 	[gd(2012, 1, 14), 53],
 	[gd(2012, 1, 15), 80],
 	[gd(2012, 1, 16), 70],
 	[gd(2012, 1, 17), 8],
 	[gd(2012, 1, 18), 11],
 	[gd(2012, 1, 19), 11],
 	[gd(2012, 1, 20), 6],
 	[gd(2012, 1, 21), 6],
 	[gd(2012, 1, 22), 8],
 	[gd(2012, 1, 23), 11],
 	[gd(2012, 1, 24), 13],
 	[gd(2012, 1, 25), 7],
 	[gd(2012, 1, 26), 9],
 	[gd(2012, 1, 27), 9],
 	[gd(2012, 1, 28), 8],
 	[gd(2012, 1, 29), 5],
 	[gd(2012, 1, 30), 8],
 	[gd(2012, 1, 31), 25]
 	];

  var data3 = [
  [gd(2012, 1, 1), 70],
  [gd(2012, 1, 2), 60],
  [gd(2012, 1, 3), 40],
  [gd(2012, 1, 4), 80],
  [gd(2012, 1, 5), 90],
  [gd(2012, 1, 6), 70],
  [gd(2012, 1, 7), 50],
  [gd(2012, 1, 8), 40],
  [gd(2012, 1, 9), 70],
  [gd(2012, 1, 10), 80],
  [gd(2012, 1, 11), 90],
  [gd(2012, 1, 12), 60],
  [gd(2012, 1, 13), 40],
  [gd(2012, 1, 14), 50],
  [gd(2012, 1, 15), 110],
  [gd(2012, 1, 16), 80],
  [gd(2012, 1, 17), 80],
  [gd(2012, 1, 18), 110],
  [gd(2012, 1, 19), 110],
  [gd(2012, 1, 20), 60],
  [gd(2012, 1, 21), 60],
  [gd(2012, 1, 22), 80],
  [gd(2012, 1, 23), 110],
  [gd(2012, 1, 24), 130],
  [gd(2012, 1, 25), 70],
  [gd(2012, 1, 26), 90],
  [gd(2012, 1, 27), 90],
  [gd(2012, 1, 28), 80],
  [gd(2012, 1, 29), 50],
  [gd(2012, 1, 30), 80],
  [gd(2012, 1, 31), 250]
  ];


 	var data2 = [
 	[gd(2012, 1, 1), 800],
 	[gd(2012, 1, 2), 500],
 	[gd(2012, 1, 3), 600],
 	[gd(2012, 1, 4), 700],
 	[gd(2012, 1, 5), 500],
 	[gd(2012, 1, 6), 456],
 	[gd(2012, 1, 7), 800],
 	[gd(2012, 1, 8), 589],
 	[gd(2012, 1, 9), 467],
 	[gd(2012, 1, 10), 876],
 	[gd(2012, 1, 11), 689],
 	[gd(2012, 1, 12), 700],
 	[gd(2012, 1, 13), 500],
 	[gd(2012, 1, 14), 600],
 	[gd(2012, 1, 15), 700],
 	[gd(2012, 1, 16), 786],
 	[gd(2012, 1, 17), 345],
 	[gd(2012, 1, 18), 888],
 	[gd(2012, 1, 19), 888],
 	[gd(2012, 1, 20), 888],
 	[gd(2012, 1, 21), 987],
 	[gd(2012, 1, 22), 444],
 	[gd(2012, 1, 23), 999],
 	[gd(2012, 1, 24), 567],
 	[gd(2012, 1, 25), 786],
 	[gd(2012, 1, 26), 666],
 	[gd(2012, 1, 27), 888],
 	[gd(2012, 1, 28), 900],
 	[gd(2012, 1, 29), 178],
 	[gd(2012, 1, 30), 555],
 	[gd(2012, 1, 31), 993]
 	];


 	var dataset = [
 	{
 		label: "Ventas",
 		grow:{stepMode:"linear"},
 		data: data2,
 		color: "#1ab394",
 		bars: {
 			show: true,
 			align: "center",
 			barWidth: 24 * 60 * 60 * 600,
 			lineWidth: 0
 		}

 	},
  {
 		label: "Tickets",
 		grow:{stepMode:"linear"},
 		data: data3,
 		yaxis: 2,
 		color: "#1C84C6",
 		lines: {
 			lineWidth: 2,
 			show: true,
 			fill: true,
 			fillColor: {
 				colors: [
 				{
 					opacity: 0.1
 				},
 				{
 					opacity: 0.1
 				}
 				]
 			}
 		}
 	},
 	{
 		label: "Visitas",
 		grow:{stepMode:"linear"},
 		data: data1,
 		yaxis: 2,
 		color: "#ff4444",
 		lines: {
 			lineWidth: 2,
 			show: true,
 			fill: true,
 			fillColor: {
 				colors: [
 				{
 					opacity: 0.1
 				},
 				{
 					opacity: 0.1
 				}
 				]
 			}
 		}
 	}
 	];


 	var options = {
 		grid: {
 			hoverable: true,
 			clickable: true,
 			tickColor: "#d5d5d5",
 			borderWidth: 0,
 			color: '#d5d5d5'
 		},
 		colors: ["#1ab394", "#464f88"],
 		tooltip: true,
 		xaxis: {
 			mode: "time",
 			tickSize: [3, "day"],
 			tickLength: 0,
 			axisLabel: "Date",
 			axisLabelUseCanvas: true,
 			axisLabelFontSizePixels: 12,
 			axisLabelFontFamily: 'Arial',
 			axisLabelPadding: 10,
 			color: "#d5d5d5"
 		},
 		yaxes: [
 		{
 			position: "left",
 			max: 900,
 			color: "#d5d5d5",
 			axisLabelUseCanvas: true,
 			axisLabelFontSizePixels: 12,
 			axisLabelFontFamily: 'Arial',
 			axisLabelPadding: 3
 		},
 		{
 			position: "right",
 			color: "#d5d5d5",
 			axisLabelUseCanvas: true,
 			axisLabelFontSizePixels: 12,
 			axisLabelFontFamily: ' Arial',
 			axisLabelPadding: 67
 		}
 		],
 		legend: {
 			noColumns: 1,
 			labelBoxBorderColor: "#d5d5d5",
 			position: "nw"
 		}

 	};

 	function gd(year, month, day) {
 		return new Date(year, month - 1, day).getTime();
 	}

	/**
	 * Definition of variables
	 * Flot chart
	 */
	 this.flotData = dataset;
	 this.flotOptions = options;
	}


/**
 * chartJsCtrl - Controller for data for ChartJs plugin
 * used in Chart.js view
 */
 function chartJsCtrl() {

	/**
	 * Data for Polar chart
	 */
	 this.polarData = [
	 {
	 	value: 300,
	 	color:"#a3e1d4",
	 	highlight: "#1ab394",
	 	label: "App"
	 },
	 {
	 	value: 140,
	 	color: "#dedede",
	 	highlight: "#1ab394",
	 	label: "Software"
	 },
	 {
	 	value: 200,
	 	color: "#A4CEE8",
	 	highlight: "#1ab394",
	 	label: "Laptop"
	 }
	 ];

	/**
	 * Options for Polar chart
	 */
	 this.polarOptions = {
	 	scaleShowLabelBackdrop : true,
	 	scaleBackdropColor : "rgba(255,255,255,0.75)",
	 	scaleBeginAtZero : true,
	 	scaleBackdropPaddingY : 1,
	 	scaleBackdropPaddingX : 1,
	 	scaleShowLine : true,
	 	segmentShowStroke : true,
	 	segmentStrokeColor : "#fff",
	 	segmentStrokeWidth : 2,
	 	animationSteps : 100,
	 	animationEasing : "easeOutBounce",
	 	animateRotate : true,
	 	animateScale : false
	 };

	/**
	 * Data for Doughnut chart
	 */
	 this.doughnutData = [
	 {
	 	value: 300,
	 	color:"#a3e1d4",
	 	highlight: "#1ab394",
	 	label: "App"
	 },
	 {
	 	value: 50,
	 	color: "#dedede",
	 	highlight: "#1ab394",
	 	label: "Software"
	 },
	 {
	 	value: 100,
	 	color: "#A4CEE8",
	 	highlight: "#1ab394",
	 	label: "Laptop"
	 }
	 ];

	/**
	 * Options for Doughnut chart
	 */
	 this.doughnutOptions = {
	 	segmentShowStroke : true,
	 	segmentStrokeColor : "#fff",
	 	segmentStrokeWidth : 2,
		percentageInnerCutout : 45, // This is 0 for Pie charts
		animationSteps : 100,
		animationEasing : "easeOutBounce",
		animateRotate : true,
		animateScale : false
	};

	/**
	 * Data for Line chart
	 */
	 this.lineData = {
	 	labels: ["January", "February", "March", "April", "May", "June", "July"],
	 	datasets: [
	 	{
	 		label: "Example dataset",
	 		fillColor: "rgba(220,220,220,0.5)",
	 		strokeColor: "rgba(220,220,220,1)",
	 		pointColor: "rgba(220,220,220,1)",
	 		pointStrokeColor: "#fff",
	 		pointHighlightFill: "#fff",
	 		pointHighlightStroke: "rgba(220,220,220,1)",
	 		data: [65, 59, 80, 81, 56, 55, 40]
	 	},
	 	{
	 		label: "Example dataset",
	 		fillColor: "rgba(26,179,148,0.5)",
	 		strokeColor: "rgba(26,179,148,0.7)",
	 		pointColor: "rgba(26,179,148,1)",
	 		pointStrokeColor: "#fff",
	 		pointHighlightFill: "#fff",
	 		pointHighlightStroke: "rgba(26,179,148,1)",
	 		data: [28, 48, 40, 19, 86, 27, 90]
	 	}
	 	]
	 };

	 this.lineDataDashboard4 = {
	 	labels: ["January", "February", "March", "April", "May", "June", "July"],
	 	datasets: [
	 	{
	 		label: "Example dataset",
	 		fillColor: "rgba(220,220,220,0.5)",
	 		strokeColor: "rgba(220,220,220,1)",
	 		pointColor: "rgba(220,220,220,1)",
	 		pointStrokeColor: "#fff",
	 		pointHighlightFill: "#fff",
	 		pointHighlightStroke: "rgba(220,220,220,1)",
	 		data: [65, 59, 40, 51, 36, 25, 40]
	 	},
	 	{
	 		label: "Example dataset",
	 		fillColor: "rgba(26,179,148,0.5)",
	 		strokeColor: "rgba(26,179,148,0.7)",
	 		pointColor: "rgba(26,179,148,1)",
	 		pointStrokeColor: "#fff",
	 		pointHighlightFill: "#fff",
	 		pointHighlightStroke: "rgba(26,179,148,1)",
	 		data: [48, 48, 60, 39, 56, 37, 30]
	 	}
	 	]
	 };

	/**
	 * Options for Line chart
	 */
	 this.lineOptions = {
	 	scaleShowGridLines : true,
	 	scaleGridLineColor : "rgba(0,0,0,.05)",
	 	scaleGridLineWidth : 1,
	 	bezierCurve : true,
	 	bezierCurveTension : 0.4,
	 	pointDot : true,
	 	pointDotRadius : 4,
	 	pointDotStrokeWidth : 1,
	 	pointHitDetectionRadius : 20,
	 	datasetStroke : true,
	 	datasetStrokeWidth : 2,
	 	datasetFill : true
	 };

	/**
	 * Options for Bar chart
	 */
	 this.barOptions = {
	 	scaleBeginAtZero : true,
	 	scaleShowGridLines : true,
	 	scaleGridLineColor : "rgba(0,0,0,.05)",
	 	scaleGridLineWidth : 1,
	 	barShowStroke : true,
	 	barStrokeWidth : 2,
	 	barValueSpacing : 5,
	 	barDatasetSpacing : 1
	 };

	/**
	 * Data for Bar chart
	 */
	 this.barData = {
	 	labels: ["January", "February", "March", "April", "May", "June", "July"],
	 	datasets: [
	 	{
	 		label: "My First dataset",
	 		fillColor: "rgba(220,220,220,0.5)",
	 		strokeColor: "rgba(220,220,220,0.8)",
	 		highlightFill: "rgba(220,220,220,0.75)",
	 		highlightStroke: "rgba(220,220,220,1)",
	 		data: [65, 59, 80, 81, 56, 55, 40]
	 	},
	 	{
	 		label: "My Second dataset",
	 		fillColor: "rgba(26,179,148,0.5)",
	 		strokeColor: "rgba(26,179,148,0.8)",
	 		highlightFill: "rgba(26,179,148,0.75)",
	 		highlightStroke: "rgba(26,179,148,1)",
	 		data: [28, 48, 40, 19, 86, 27, 90]
	 	}
	 	]
	 };

	/**
	 * Data for Radar chart
	 */
	 this.radarData = {
	 	labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
	 	datasets: [
	 	{
	 		label: "My First dataset",
	 		fillColor: "rgba(220,220,220,0.2)",
	 		strokeColor: "rgba(220,220,220,1)",
	 		pointColor: "rgba(220,220,220,1)",
	 		pointStrokeColor: "#fff",
	 		pointHighlightFill: "#fff",
	 		pointHighlightStroke: "rgba(220,220,220,1)",
	 		data: [65, 59, 90, 81, 56, 55, 40]
	 	},
	 	{
	 		label: "My Second dataset",
	 		fillColor: "rgba(26,179,148,0.2)",
	 		strokeColor: "rgba(26,179,148,1)",
	 		pointColor: "rgba(26,179,148,1)",
	 		pointStrokeColor: "#fff",
	 		pointHighlightFill: "#fff",
	 		pointHighlightStroke: "rgba(151,187,205,1)",
	 		data: [28, 48, 40, 19, 96, 27, 100]
	 	}
	 	]
	 };

	/**
	 * Options for Radar chart
	 */
	 this.radarOptions = {
	 	scaleShowLine : true,
	 	angleShowLineOut : true,
	 	scaleShowLabels : false,
	 	scaleBeginAtZero : true,
	 	angleLineColor : "rgba(0,0,0,.1)",
	 	angleLineWidth : 1,
	 	pointLabelFontFamily : "'Arial'",
	 	pointLabelFontStyle : "normal",
	 	pointLabelFontSize : 10,
	 	pointLabelFontColor : "#666",
	 	pointDot : true,
	 	pointDotRadius : 3,
	 	pointDotStrokeWidth : 1,
	 	pointHitDetectionRadius : 20,
	 	datasetStroke : true,
	 	datasetStrokeWidth : 2,
	 	datasetFill : true
	 };


	};

	angular
	.module('bdb')
	.controller('DashboardCtrl', DashboardCtrl)
	.controller('chartJsCtrl', chartJsCtrl)
	.controller('dashboardFlotTwo', dashboardFlotTwo);
