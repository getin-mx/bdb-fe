/**
 * BigDataBrain
 *
 */

function CommonsService($http, $cookieStore, $rootScope) {

	var vm = this;
	this.getUrl = function(service) {
		if( $rootScope.globals.currentUser ) {
			return config.baseUrl + service + '?authToken=' + $rootScope.globals.currentUser.token;
		} else {
			return config.baseUrl + service;
		}
	}

	this.getDashUrl = function(service) {
		if( $rootScope.globals.currentUser ) {
			return config.dashUrl + service + '?authToken=' + $rootScope.globals.currentUser.token;
		} else {
			return config.dashUrl + service;
		}
	}

	this.paginateCommonTable = function($scope, entity, data, status, role ) {
		var strStatus;
		var fnStatus;
		var idxStatus = ($scope.statusTranslator !== undefined ) ? $scope.statusTranslator(status) : status

		if( idxStatus == 0 ) {
			strStatus = 'active';
			fnStatus = $scope.fillTableActive;
		} else {
			strStatus = 'inactive';
			fnStatus = $scope.fillTableInactive; 
		}

		//get the footable object
		var table = $('#' + entity + '-' + strStatus + '-table').data('footable');

		$('#' + entity + '-' + strStatus + '-table').data('record-count',data.data.recordCount);
		table.pageCallback = function(ft, pageNumber, sort, callback) {
			var $table = $(ft.table), data = $table.data();
			var pageSize = data.pageSize || ft.options.pageSize;
			var from = pageSize * pageNumber;
			var to = from + pageSize;

			$scope.loadingRefresh = true;
			$scope.status[idxStatus].httpCallback = callback;
			$scope.status[idxStatus].ft = ft;
			$scope.status[idxStatus].pageNumber = pageNumber;

			$http.get(vm.getUrl('/' + entity) 
				+ '&from=' + from 
				+ '&to=' + to 
				+ '&status=' + status
				+ (role === undefined ? '' : '&role=' + role)
				+ ($scope.country === undefined ? '' : '&country=' + $scope.country.id)
				+ '&q=' + encodeURIComponent($scope.search)
				+ '&order=' + encodeURIComponent(sort))
				.then(fnStatus);
		}

	    $('#' + entity + '-' + strStatus + '-table>tbody>tr').each(function(index, elem){$(elem).remove();});

	    var newRow = '';
	    for(var i = 0; i < data.data.data.length; i++) {
	    	var obj = data.data.data[i];
	    	newRow += $scope.fillRecord(obj, status);
	    }

		table.appendRow(newRow);

    	$('#' + entity + '-' + strStatus + '-count').html('&nbsp;(' + data.data.recordCount + ')');

	    if( $scope.status[idxStatus].httpCallback !== undefined ) {
	    	$scope.status[idxStatus].ft.pageInfo.currentPage = $scope.status[idxStatus].pageNumber;
	    	$scope.status[idxStatus].httpCallback($scope.status[idxStatus].ft, $scope.status[idxStatus].pageNumber);
	    	$scope.status[idxStatus].httpCallback = undefined;
	    	$scope.status[idxStatus].ft = undefined;
	    	$scope.status[idxStatus].pageNumber = undefined;
	    }

		$scope.loadingRefresh = false;
	}

	this.safeApply = function(scope) {
		try {
			if(!scope.$$phase) {
				scope.$apply();
			}
		} catch( e ) {}
	}

	this.getTimezoneArray = function() {

		var ret = new Array();
		ret.push({id: -12, name: '(GMT -12:00) Eniwetok, Kwajalein'});
		ret.push({id: -11, name: '(GMT -11:00) Midway Island, Samoa'});
		ret.push({id: -10, name: '(GMT -10:00) Hawaii'});
		ret.push({id: -9, name: '(GMT -9:00) Alaska'});
		ret.push({id: -8, name: '(GMT -8:00) Pacific Time (US and Canada)'});
		ret.push({id: -7, name: '(GMT -7:00) Mountain Time (US and Canada)'});
		ret.push({id: -6, name: '(GMT -6:00) Central Time (US and Canada), Mexico City'});
		ret.push({id: -5, name: '(GMT -5:00) Eastern Time (US and Canada), Bogota, Lima'});
		ret.push({id: -4, name: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz'});
		ret.push({id: -3.5, name: '(GMT -3:30) Newfoundland'});
		ret.push({id: -3, name: '(GMT -3:00) Brazil, Buenos Aires, Georgetown<'});
		ret.push({id: -2, name: '(GMT -2:00) Mid-Atlantic'});
		ret.push({id: -1, name: '(GMT -1:00) Azores, Cape Verde Islands'});
		ret.push({id: 0, name: '(GMT) Western Europe Time, London, Lisbon, Casablanca'});
		ret.push({id: 1, name: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris'});
		ret.push({id: 2, name: '(GMT +2:00) Kaliningrad, South Africa'});
		ret.push({id: 3, name: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg'});
		ret.push({id: 3.5, name: '(GMT +3:30) Tehran'});
		ret.push({id: 4, name: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi'});
		ret.push({id: 4.5, name: '(GMT +4:30) Kabul'});
		ret.push({id: 5, name: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent'});
		ret.push({id: 5.5, name: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi'});
		ret.push({id: 6, name: '(GMT +6:00) Almaty, Dhaka, Colombo'});
		ret.push({id: 7, name: '(GMT +7:00) Bangkok, Hanoi, Jakarta'});
		ret.push({id: 8, name: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong'});
		ret.push({id: 9, name: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk'});
		ret.push({id: 9.5, name: '(GMT +9:30) Adelaide, Darwin'});
		ret.push({id: 10, name: '(GMT +10:00) Eastern Australia, Guam, Vladivostok'});
		ret.push({id: 11, name: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia'});
		ret.push({id: 12, name: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka'});

		return ret;

	}

	return this;
};

Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

angular
	.module('bdb')
	.factory('CommonsService', CommonsService);
