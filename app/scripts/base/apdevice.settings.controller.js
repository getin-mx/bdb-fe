/**
 * APDeviceSettingsCtrl - controller
 */
 function APDeviceSettingsCtrl($rootScope, $scope, $http, $stateParams, $location, CommonsService, AuthenticationService , $timeout, $filter, Alertify) {

	var vm = this;

    var STATUS_ENABLED = 0;
    var STATUS_DISABLED = 1;
    var STATUS_PENDING = 2;

    var STATUS_NEW = 3;
    var STATUS_VIEWED = 4;
    var STATUS_REMOVED = 5;

    var STATUS_PREPARED = 10;
    var STATUS_RUNNING = 11;
    var STATUS_SUCCEEDED = 12;
    var STATUS_ERROR = 13;
    var STATUS_CANCELLED = 14;

    var BAR_COLOR = "#ED5565";
    var BAR_COLOR_NEUTRAL = "#EEE";

  $scope.remote = {};
	$scope.obj = {
        visitPowerThreshold: -60,
		    peasantPowerThreshold: -200,
        visitTimeThreshold: 2,
        visitGapThreshold: 10,
        visitMaxThreshold: 90,
        visitCountThreshold: 0,
        timezone: 'CDT',
        visitsOnMon: true,
        visitsOnTue: true,
        visitsOnWed: true,
        visitsOnThu: true,
        visitsOnFri: true,
        visitsOnSat: true,
        visitsOnSun: true,
        monInverted: false,
        tueInverted: false,
        wedInverted: false,
        thuInverted: false,
        friInverted: false,
        satInverted: false,
        sunInverted: false,
        visitStartMon: '11:00',
        visitEndMon: '20:00',
        visitStartTue: '11:00',
        visitEndTue: '20:00',
        visitStartWed: '11:00',
        visitEndWed: '20:00',
        visitStartThu: '11:00',
        visitEndThu: '20:00',
        visitStartFri: '11:00',
        visitEndFri: '20:00',
        visitStartSat: '11:00',
        visitEndSat: '20:00',
        visitStartSun: '11:00',
        visitEndSun: '20:00',
        monitorStart: '10:00',
        monitorEnd: '21:00',
        passStart: '04:00' ,
        passEnd: '03:00'
	}

    $scope.visitCountThreshold = {
        min: 0,
        max: 720,
        step: 2,
        prefix: "",
        postfix: " mins",
        prettify: true,
        hasGrid: true,
        from: 0
    };

    $scope.visitGapThreshold = {
        min: 0,
        max: 720,
        step: 1,
        prefix: "",
        postfix: " mins",
        prettify: true,
        hasGrid: true,
        from: 10
    };

    $scope.visitTimeThreshold = {
        min: 0,
        max: 720,
        step: 1,
        type: 'double',
        prefix: "",
        postfix: " mins",
        prettify: true,
        hasGrid: true,
        isTime: false,
        from: 2,
        to: 90
    };

    $scope.monitor = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.visitMon = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.visitTue = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.visitWed = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.visitThu = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.visitFri = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.visitSat = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.visitSun = {
        min: 0,
        max: 1440,
        step: 15,
        type: 'double',
        prefix: "",
        postfix: "",
        prettify: true,
        hasGrid: true,
        isTime: true,
        from: 0,
        to: 1440
    };

    $scope.processMinDate = moment("2017-01-01T12:00:00.000Z");

	$scope.init = function() {
        // console.log($scope.processMinDate);
        $scope.classNoActiveAssignations = 'hidden';
        $scope.classActiveAssignations = 'hidden';
		if( $stateParams.hostname !== undefined ) {
			$scope.hostname = $stateParams.hostname;
		} else {
			$scope.hostname = document.getElementById('hostnameParam').value;
		}
		$scope.refresh();
	}

    $scope.update = function() {

        $scope.remote = angular.copy($scope.obj);

        $scope.loadingSubmit = true;

        $scope.remote.visitTimeThreshold = $scope.visitTimeThresholdObj.getFrom();
        $scope.remote.visitMaxThreshold = $scope.visitTimeThresholdObj.getTo();
        $scope.remote.visitCountThreshold = $scope.visitCountThresholdObj.getFrom();
        $scope.remote.visitGapThreshold = $scope.visitGapThresholdObj.getFrom();


        $scope.remote.monitorStart = $scope.toTime($scope.monitorObj.getFrom());
        $scope.remote.monitorEnd = $scope.toTime($scope.monitorObj.getTo());

        if($scope.remote.monInverted){
            $scope.remote.visitStartMon =  $scope.toTime($scope.visitMonObj.getTo());
            $scope.remote.visitEndMon = $scope.toTime($scope.visitMonObj.getFrom());
        } else{
              $scope.remote.visitStartMon = $scope.toTime($scope.visitMonObj.getFrom());
              $scope.remote.visitEndMon = $scope.toTime($scope.visitMonObj.getTo());
          }

        if($scope.remote.tueInverted){
            $scope.remote.visitStartTue =  $scope.toTime($scope.visitTueObj.getTo());
            $scope.remote.visitEndTue = $scope.toTime($scope.visitTueObj.getFrom());
        } else{
            $scope.remote.visitStartTue = $scope.toTime($scope.visitTueObj.getFrom());
            $scope.remote.visitEndTue = $scope.toTime($scope.visitTueObj.getTo());
        }

        if($scope.remote.wedInverted){
            $scope.remote.visitStartWed =  $scope.toTime($scope.visitWedObj.getTo());
            $scope.remote.visitEndWed = $scope.toTime($scope.visitWedObj.getFrom());
        } else{
            $scope.remote.visitStartWed = $scope.toTime($scope.visitWedObj.getFrom());
            $scope.remote.visitEndWed = $scope.toTime($scope.visitWedObj.getTo());
        }

        if($scope.remote.thuInverted){
            $scope.remote.visitStartThu =  $scope.toTime($scope.visitThuObj.getTo());
            $scope.remote.visitEndThu = $scope.toTime($scope.visitThuObj.getFrom());
        } else{
            $scope.remote.visitStartThu = $scope.toTime($scope.visitThuObj.getFrom());
            $scope.remote.visitEndThu = $scope.toTime($scope.visitThuObj.getTo());
        }

        if($scope.remote.friInverted){
            $scope.remote.visitStartFri =  $scope.toTime($scope.visitFriObj.getTo());
            $scope.remote.visitEndFri = $scope.toTime($scope.visitFriObj.getFrom());
        } else{
            $scope.remote.visitStartFri = $scope.toTime($scope.visitFriObj.getFrom());
            $scope.remote.visitEndFri = $scope.toTime($scope.visitFriObj.getTo());
        }

        if($scope.remote.satInverted){
            $scope.remote.visitStartSat =  $scope.toTime($scope.visitSatObj.getTo());
            $scope.remote.visitEndSat = $scope.toTime($scope.visitSatObj.getFrom());
        } else{
            $scope.remote.visitStartSat = $scope.toTime($scope.visitSatObj.getFrom());
            $scope.remote.visitEndSat = $scope.toTime($scope.visitSatObj.getTo());
        }

        if($scope.remote.sunInverted){
            $scope.remote.visitStartSun =  $scope.toTime($scope.visitSunObj.getTo());
            $scope.remote.visitEndSun = $scope.toTime($scope.visitSunObj.getFrom());
        } else{
            $scope.remote.visitStartSun = $scope.toTime($scope.visitSunObj.getFrom());
            $scope.remote.visitEndSun = $scope.toTime($scope.visitSunObj.getTo());
        }

        delete $scope.remote.lastInfoUpdate;
        delete $scope.remote.mode;
        delete $scope.remote.model;
        delete $scope.remote.version;
        delete $scope.remote.tunnelIp;
        delete $scope.remote.lanIp;
        delete $scope.remote.wanIp;
        delete $scope.remote.publicIp;
        delete $scope.remote.lastRecordDate;
        delete $scope.remote.lastRecordCount;
        delete $scope.remote.reportStatus;

        $scope.reportMailList = Array();
        for( var x = 0; x < $scope.remote.reportMailList.length; x++ ) {
            if( $scope.remote.reportMailList[x] !== undefined && $scope.remote.reportMailList[x].trim() != '' ) {
                $scope.reportMailList.push($scope.remote.reportMailList[x].trim());
            }
        }
        $scope.remote.reportMailList = $scope.reportMailList.slice();

        $http.post(CommonsService.getUrl('/apdevice/' + $scope.hostname), $scope.remote)
        .then($scope.postUpdate);
    }

    $scope.postUpdate = function(data) {
        // console.log(data);
        if( data.status = 200
            && data.data.error_code === undefined ) {
            // swal({
            //     title: "Ok!",
            //     text: "La configuración de la antena fue salvada con éxito",
            //     type: "success"
            // });
            Alertify.confirm('Are you sure?').then(
                function onOk() { Alertify.success('Cool');},
                function onCancel() { Alertify.success('Not cool');}
            );

        } else {
            // swal({
            //     title: "Error!",
            //     text: "La configuración de la antena no pudo salvarse",
            //     type: "error"
            // });
            Alertify.success('Hello world!');
        }

        $scope.loadingSubmit = false;
        $scope.postRefresh(data);
    }

	$scope.refresh = function() {
		$http.get(CommonsService.getUrl('/apdevice/' + $scope.hostname ))
		.then($scope.postRefresh);
	}

	$scope.postRefresh = function(data) {
		angular.extend($scope.obj, data.data);

		$scope.visitTimeThreshold.from = parseInt($scope.obj.visitTimeThreshold);
		$scope.visitTimeThreshold.to = parseInt($scope.obj.visitMaxThreshold);
		$scope.visitTimeThresholdObj = $('#visitTimeThreshold').data('ionRangeSlider');
		$scope.visitTimeThresholdObj.update($scope.visitTimeThreshold);

		$scope.visitCountThreshold.from = parseInt($scope.obj.visitCountThreshold);
		$scope.visitCountThresholdObj = $('#visitCountThreshold').data('ionRangeSlider');
		$scope.visitCountThresholdObj.update($scope.visitCountThreshold);

		$scope.visitGapThreshold.from = parseInt($scope.obj.visitGapThreshold);
		$scope.visitGapThresholdObj = $('#visitGapThreshold').data('ionRangeSlider');
		$scope.visitGapThresholdObj.update($scope.visitGapThreshold);

		$scope.monitor.from = $scope.fromTime($scope.obj.monitorStart);
		$scope.monitor.to = $scope.fromTime($scope.obj.monitorEnd, true);
		$scope.monitorObj = $('#monitor').data('ionRangeSlider');
		$scope.monitorObj.update($scope.monitor);

    $scope.initSlider('monday');
    $scope.initSlider('tuesday');
    $scope.initSlider('wednesday');
    $scope.initSlider('thursday');
    $scope.initSlider('friday');
    $scope.initSlider('saturday');
    $scope.initSlider('sunday');

    $scope.changeDay();
	}

  $scope.hasInvertedDisplay = function (start, end) {
    if(end < start && end != "00:00") {
      return true;
    } else {
      return false;
    }
  }
  $scope.toTitleCase = function(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  $scope.initSlider = function(day) {
    formattedDay = day.slice(0,3);
    formattedDay = $scope.toTitleCase(formattedDay);

    if($scope.hasInvertedDisplay($scope.obj['visitStart'+formattedDay], $scope.obj['visitEnd'+formattedDay])) {
      $scope['visit'+formattedDay].from = $scope.fromTime($scope.obj['visitEnd'+formattedDay]);
      $scope['visit'+formattedDay].to = $scope.fromTime($scope.obj['visitStart'+formattedDay]);
      $scope['visit'+formattedDay+'Obj'] = $('#visit'+formattedDay).data('ionRangeSlider');
      $scope['visit'+formattedDay+'Obj'].update($scope['visit'+formattedDay]);
      //flag for day gets inverted
      $scope.obj[day.slice(0,3) + 'Inverted'] = true;
      $scope.invertDay(true, day);
    } else{
      $scope['visit'+formattedDay].from = $scope.fromTime($scope.obj['visitStart'+formattedDay]);
      $scope['visit'+formattedDay].to = $scope.fromTime($scope.obj['visitEnd'+formattedDay], true);
      $scope['visit'+formattedDay+'Obj'] = $('#visit'+formattedDay).data('ionRangeSlider');
      $scope['visit'+formattedDay+'Obj'].update($scope['visit'+formattedDay]);
    }
  }

  $scope.invert = function(day) {
    var invertedName = [day.slice(0,3) + 'Inverted'];
    $scope.invertDay($scope.obj[invertedName], day);
  }

  $scope.invertDay = function(invert, day) {
    if(invert){
      $('.'+day+'-container .irs-line-mid').css('background', BAR_COLOR);
      $('.'+day+'-container .irs-line-left').css('background', BAR_COLOR);
      $('.'+day+'-container .irs-line-right').css('background', BAR_COLOR);
      $('.'+day+'-container .irs-bar').css('background', BAR_COLOR_NEUTRAL);
    }
    else {
      $('.'+day+'-container .irs-line-mid').css('background', BAR_COLOR_NEUTRAL);
      $('.'+day+'-container .irs-line-left').css('background', BAR_COLOR_NEUTRAL);
      $('.'+day+'-container .irs-line-right').css('background', BAR_COLOR_NEUTRAL);
      $('.'+day+'-container .irs-bar').css('background', BAR_COLOR);
    }
  }

	$scope.changeDay = function() {

        try {
    		if( $scope.obj.visitsOnMon == false ) {
    			$('#visitMon')[0].offsetParent.children[0].style = 'display: none;';
    		} else {
    			$('#visitMon')[0].offsetParent.children[0].style = 'display: block;';
    		}

    		if( $scope.obj.visitsOnTue == false ) {
    			$('#visitTue')[0].offsetParent.children[0].style = 'display: none;';
    		} else {
    			$('#visitTue')[0].offsetParent.children[0].style = 'display: block;';
    		}

    		if( $scope.obj.visitsOnWed == false ) {
    			$('#visitWed')[0].offsetParent.children[0].style = 'display: none;';
    		} else {
    			$('#visitWed')[0].offsetParent.children[0].style = 'display: block;';
    		}

    		if( $scope.obj.visitsOnThu == false ) {
    			$('#visitThu')[0].offsetParent.children[0].style = 'display: none;';
    		} else {
    			$('#visitThu')[0].offsetParent.children[0].style = 'display: block;';
    		}

    		if( $scope.obj.visitsOnFri == false ) {
    			$('#visitFri')[0].offsetParent.children[0].style = 'display: none;';
    		} else {
    			$('#visitFri')[0].offsetParent.children[0].style = 'display: block;';
    		}

    		if( $scope.obj.visitsOnSat == false ) {
    			$('#visitSat')[0].offsetParent.children[0].style = 'display: none;';
    		} else {
    			$('#visitSat')[0].offsetParent.children[0].style = 'display: block;';
    		}

    		if( $scope.obj.visitsOnSun == false ) {
    			$('#visitSun')[0].offsetParent.children[0].style = 'display: none;';
    		} else {
    			$('#visitSun')[0].offsetParent.children[0].style = 'display: block;';
    		}
        } catch( e ) {}

	}

	$scope.fromTime = function( time, checkover ) {
		try {
			if( checkover && time == '00:00' )
				return 1440;

			var parts = time.split(':');
			return ((parseInt(parts[0]) * 60) + parseInt(parts[1]));
		} catch( e ) {
			return 0;
		}
	}

	$scope.toTime = function( num ) {
        var snum = parseInt(String(num).replace(' ', ''));
        var hour = Math.floor(snum / 60);
        var min = Math.floor(snum % 60);
        var shour;
        var smin;

        hour = hour % 24;

        if( hour < 10 )
            shour = '0' + hour;
        else
            shour = hour;

        if( min < 10 )
            smin = '0' + min;
        else
            smin = min;

        return(shour + ':' + smin);
	}

	$scope.updateMap = function() {

		if($scope.map === undefined ) {
			// Default fallback for Mexico City
			if( $scope.obj.lat === undefined ) {
				$scope.obj.lat = 19.412457;
				$scope.obj.lon = -99.1404902;
			}

			$scope.map = new GMaps({
				div: '#map',
				lat: $scope.obj.lat,
				lng: $scope.obj.lon,
				width: "100%",
				height: "550px",
				zoom: 14
			});

			$scope.map.removeMarkers();
			$scope.map.addMarker({
				lat: $scope.obj.lat,
				lng: $scope.obj.lon,
				title: $scope.obj.hostname
			});

		}


		$timeout(function() {$scope.map.refresh(); $scope.map.setCenter($scope.obj.lat, $scope.obj.lon);}, 500);
	}


	$scope.updateUptime = function() {
		$timeout(function() {$scope.uptime.reflow();}, 500);
	}


	$scope.refreshUptime = function() {

	    var dToDate = new Date(new Date().getTime());
	    var dFromDate = new Date(dToDate.getTime() - config.oneMonth);

	    $scope.toDate = dToDate.format("yyyy-mm-dd", null);
	    $scope.fromDate = dFromDate.format("yyyy-mm-dd", null);
        $('#uptimeFromDate').val($scope.fromDate);
        $('#uptimeToDate').val($scope.toDate);

		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/dashboard/apuptime') + '&identifier=' + $scope.hostname
			+ '&fromStringDate=' + $scope.fromDate + '&toStringDate=' + $scope.toDate)
			.then($scope.fillUptime);

	}

    $scope.refreshUptimeButton = function() {

        $scope.toDate = $('#uptimeToDate').val();
        $scope.fromDate = $('#uptimeFromDate').val();

        $scope.loadingRefresh = true;
        $http.get(CommonsService.getUrl('/dashboard/apuptime') + '&identifier=' + $scope.hostname
            + '&fromStringDate=' + $scope.fromDate + '&toStringDate=' + $scope.toDate)
            .then($scope.fillUptime);

    }

	$scope.fillUptime = function(data) {
        $scope.uptime = Highcharts.chart('heatmap_apuptime', {
            chart: {
                type: 'heatmap'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: data.data.xCategories,
                title: 'Dias'
            },
            yAxis: {
                categories: data.data.yCategories,
                title: 'Horarios'
            },
            colorAxis: {
                min: 0,
                minColor: '#ed5565',
                maxColor: '#FFFFFF'
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
                    return this.point.value + '%';
                }
            },
            series: [{
                borderWidth: 0.5,
                borderColor: '#676a6c',
                data: data.data.data,
                dataLabels: {
                    enabled: false,
                    color: '#000000'
                }
            }]
        });
    };

    $scope.refreshAssignations = function() {
        $scope.loadingRefresh = true;
        $http.get(CommonsService.getUrl('/apdassignation') + '&hostname=' + $scope.hostname )
            .then($scope.fillAssignationsTable);

        $scope.formAssignationClass = 'hidden';
        $scope.tableAssignationClass = 'col-lg-12';
    }

    $scope.fillAssignationsTable = function(data) {

        var count = 0;

        //get the footable object
        var table = $('#apdassignations-table').data('footable');

        $("#apdassignations-table>tbody>tr").each(function(index, elem){$(elem).remove();});

        tableRows = '';
        var activeCount = 0;

        for(var i = 0; i < data.data.data.length; i++) {
            var obj = data.data.data[i];
            var newRow = '<tr>'
                       + '<td data-value="' + obj.name + '">' + obj.name + '</td>'
                       + '<td data-value="' + (obj.fromDate === undefined ? '' : obj.fromDate)
                                     + '">' + (obj.fromDate === undefined ? '-' :  $filter('date')(obj.fromDate, "dd/MM/yyyy")) + '</td>'
                       + '<td data-value="' + (obj.toDate === undefined ? '' : obj.toDate)
                                     + '">' + (obj.toDate === undefined ? '-' : $filter('date')(obj.toDate, "dd/MM/yyyy")) + '</td>'

                       + '<td data-value="' + obj.identifier + '">'
                       + '<a class="apdassignationsettings" style="margin-left: 10px;" href="#" '
                       + 'data-value="' + obj.identifier + '"><i class="fa fa-cog"></i></a>'
                       + (obj.active === false ? '<a class="apdassignationdelete" style="margin-left: 10px;" href="#" '
                       + 'data-value="' + obj.identifier + '"><i class="fa fa-trash"></i></a>' : '')
                       + (obj.active === true ? '<a class="apdassignationremove" style="margin-left: 10px;" href="#" '
                       + 'data-value="' + obj.identifier + '"><i class="fa fa-arrow-down"></i></a>' : '')
                       + '</td>'

                       + '</tr>';

            tableRows += newRow;
            count++;
            if( obj.active === true )
                activeCount++;
        }

        table.appendRow(tableRows);

        $('#apdassignations-table').data('current-page', '0');
        $('#apdassignations-table').data('record-count', count);

        table.redraw();

        $("#apdassignations-count").html('&nbsp;(' + count + ')');

        if( activeCount == 0 ) {
            $scope.classNoActiveAssignations = '';
            $scope.classActiveAssignations = 'hidden';
        } else {
            $scope.classNoActiveAssignations = 'hidden';
            $scope.classActiveAssignations = '';
        }


        // Define apdassignationsettings click response
        $('.apdassignationsettings').click(function(e) {
            e.preventDefault();

            $scope.formAssignationClass = '';
            $scope.tableAssignationClass = 'col-lg-6';

            $rootScope.APDAssignationParms = {
                hostname: $scope.hostname,
                identifier: $(e.currentTarget).data('value')
            }

            $rootScope.$emit('adpassignation.load')
            $scope.$apply();

        });

        // Define apdassignationdelete click response
        $('.apdassignationdelete').click(function(e) {
            e.preventDefault();

            // swal({
            //     title: "Estas seguro?",
            //     text: "Si se elimina la asignación ya no podrá recuperarse!",
            //     type: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#DD6B55",
            //     confirmButtonText: "Si, eliminalo!",
            //     cancelButtonText: "No, me arrepiento...",
            //     closeOnConfirm: false,
            //     closeOnCancel: true },
            // function (isConfirm) {
            //     if (isConfirm) {
            //         $http.delete(CommonsService.getUrl('/apdassignation/' + $(e.currentTarget).data('value')))
            //             .then(function(data) {
            //                 swal("Eliminado!", "La asignación fue eliminada.", "success");
            //                 $scope.refreshAssignations();
            //             });
            //     }
            // });
            Alertify.success('Hello world!');
        });

        // Define apdassignationdelete click response
        $('.apdassignationremove').click(function(e) {
            e.preventDefault();

            swal({
                title: "Estas seguro?",
                text: "Quieres desasignar esta antena?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, desasignar!",
                cancelButtonText: "No, me arrepiento...",
                closeOnConfirm: false,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    $http.get((CommonsService.getUrl('/apdassignation/' + $(e.currentTarget).data('value'))))
                        .then(function(data) {
                            data.data.toDate = 'now';
                            $http.post((CommonsService.getUrl('/apdassignation')), data.data)
                                .then(function(data) {
                                    swal("Desasignado!", "La antena fue desasignada", "success");
                                    $scope.refreshAssignations();
                                })
                        })
                }
            });
        });

        $scope.loadingRefresh = false;
    }

    $rootScope.$on('adpassignation.update', function() {
        $scope.formAssignationClass = 'hidden';
        $scope.tableAssignationClass = 'col-lg-12';
        $scope.refreshAssignations();
    });

    $rootScope.$on('adpassignation.cancel', function() {
        $scope.formAssignationClass = 'hidden';
        $scope.tableAssignationClass = 'col-lg-12';
    });

    $scope.newAssignation = function() {
        $scope.formAssignationClass = '';
        $scope.tableAssignationClass = 'col-lg-6';

        $rootScope.APDAssignationParms = {
            hostname: $scope.hostname,
            identifier: undefined
        }

        $rootScope.$emit('adpassignation.new')
    }

    $scope.refreshProcesses = function() {
        $scope.loadingRefresh = true;

        $http.get(CommonsService.getUrl('/process') + '&hostname=' + $scope.hostname + '&order=startDateTime desc' )
            .then($scope.fillProcessTable);
        $http.get(CommonsService.getUrl('/apdassignation') + '&hostname=' + $scope.hostname + '&active=true' )
            .then(function(data) {
                $scope.entity = {};
                if( data.data.data.length > 0 ) {
                    $scope.entity.id = data.data.data[0].entityId;
                    $scope.entity.kind = data.data.data[0].entityKind;
                    $scope.entity.name = data.data.data[0].entityName;
                }
                $scope.loadingUpdate = false;
            });
    }

    $scope.fillProcessTable = function(data) {

        var count = 0;
        var endedCount = 0;

        //get the footable object
        var tableProcess = $('#process-table').data('footable');
        var tableEnded = $('#process-ended-table').data('footable');

        $("#process-table>tbody>tr").each(function(index, elem){$(elem).remove();});
        $("#process-ended-table>tbody>tr").each(function(index, elem){$(elem).remove();});

        tableProcessRows = '';
        tableEndedRows = '';

        for(var i = 0; i < data.data.data.length; i++) {
            var obj = data.data.data[i];
            var newRow = '<tr>'
                       + '<td data-value="' + obj.name + '">' + obj.name + '</td>'
                       + '<td data-value="' + obj.userId + '">' + obj.userId + '</td>'
                       + '<td data-value="' + (obj.startDateTime === undefined ? '' : obj.startDateTime)
                                     + '">' + (obj.startDateTime === undefined ? '-' :  $filter('date')(obj.startDateTime, "dd/MM/yyyy")) + '</td>'
                       + '<td data-value="' + obj.status + '">' + $scope.statusToString(obj.status) + '</td>'
                       + '</tr>';

            if( obj.status == STATUS_PREPARED || obj.status == STATUS_RUNNING ) {
                tableProcessRows += newRow;
                count++;
            } else {
                tableEndedRows += newRow;
                endedCount++;
            }
        }

        tableProcess.appendRow(tableProcessRows);
        tableEnded.appendRow(tableEndedRows);

        $('#process-table').data('current-page', '0');
        $('#process-table').data('record-count', count);
        $('#process-ended-table').data('current-page', '0');
        $('#process-ended-table').data('record-count', endedCount);

        tableProcess.redraw();
        tableEnded.redraw();

        $("#process-count").html('&nbsp;(' + count + ')');
        $("#process-ended-count").html('&nbsp;(' + endedCount + ')');

        $scope.loadingRefresh = false;
    }

    $scope.requestProcess = function() {
        $scope.loadingUpdate = true;
        $scope.processFromDate = $('#processFromDate').val();
        $scope.processToDate = $('#processToDate').val();

        var tmpDate = moment($scope.processFromDate);
        if( tmpDate < $scope.processMinDate ) {
            swal({
                title: "Error!",
                text: "La fecha de inicio del reproceso es menor al primero de enero!",
                type: "error"
            });
            $scope.loadingUpdate = false;
            return;
        }

        tmpDate = moment($scope.processToDate);
        if( tmpDate < $scope.processMinDate ) {
            swal({
                title: "Error!",
                text: "La fecha de fin del reproceso es menor al primero de enero!",
                type: "error"
            });
            $scope.loadingUpdate = false;
            return;
        }

        if( Date.daysBetween(new Date($scope.processFromDate), new Date($scope.processToDate)) > 31 ) {
            swal({
                title: "Error!",
                text: "No puede reprocesarse más de un mes!",
                type: "error"
            });
            $scope.loadingUpdate = false;
            return;
        }

        if( moment($scope.processToDate) <= moment($scope.processFromDate)) {
            swal({
                title: "Error!",
                text: "La fecha de fin de reproceso tiene que ser mayor a la de inicio!",
                type: "error"
            });
            $scope.loadingUpdate = false;
            return;
        }

        var request = {
            entityId: $scope.entity.id,
            entityKind : $scope.entity.kind,
            processType: 0,
            fromDate: $scope.processFromDate,
            toDate: $scope.processToDate
        }

        $http.post(CommonsService.getUrl('/requestProcess' ), request)
            .then($scope.postRequestProcess);

    }

    $scope.postRequestProcess = function(data) {

        if( data.status = 200
            && data.data.error_code === undefined ) {
            swal({
                title: "Ok!",
                text: "Se ha emitido el reproceso! Espera hasta que el proceso se encuentre en estado finalizado",
                type: "success"
            });
        } else {
            swal({
                title: "Error!",
                text: "No pudo emitirse el reproceso! Asegúrate de que la antena esté asignada y que las fechas de proceso sean correctas",
                type: "error"
            });
        }

        $scope.loadingUpdate = false;
        $scope.refreshProcesses();
    }


    $scope.statusToString = function(status) {
        if( status == STATUS_RUNNING )
            return "Ejecutando...";
        if( status == STATUS_PREPARED)
            return "Preparado";
        if( status == STATUS_CANCELLED)
            return "Cancelado";
        if( status == STATUS_ERROR)
            return "Error";
        if( status == STATUS_SUCCEEDED)
            return "Finalizado";
        if( status == STATUS_REMOVED)
            return "Eliminado";
        if( status == STATUS_VIEWED)
            return "Visto";
        if( status == STATUS_NEW)
            return "Nuevo";
        if( status == STATUS_PENDING)
            return "Pendiente";
        if( status == STATUS_DISABLED)
            return "Deshabilitado";
        if( status == STATUS_ENABLED)
            return "Habilitado";
        return "";
    }

	return vm;
};

angular
	.module('bdb')
	.controller('APDeviceSettingsCtrl', APDeviceSettingsCtrl);
