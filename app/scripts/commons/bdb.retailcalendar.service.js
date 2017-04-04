/**
 * BigDataBrain
 *
 */

function RetailCalendar($http, $cookieStore, $rootScope) {

	var vm = this;
	this.getUrl = function(service) {
		if( $rootScope.globals.currentUser ) {
			return config.baseUrl + service + '?authToken=' + $rootScope.globals.currentUser.token;
		} else {
			return config.baseUrl + service;
		}
	}

	return this;

}

angular
	.module('bdb')
	.factory('RetailCalendar', RetailCalendar);
