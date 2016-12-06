/**
 * BigDataBrain
 *
 */

function MyMenuService($http, CommonsService) {
	this.getMenu = function() {
		return $http.get(CommonsService.getUrl('/mymenu'))
			.then(this.handleSuccess, this.handleError('Error getting menu'));
	}

	this.handleSuccess = function(res) {
		return res.data;
	}

	this.handleError = function(error) {
		return function() {
			return {
				success: false,
				message: error
			};
		};
	}

	return this;
}

angular
	.module('bdb')
	.factory('MyMenuService', MyMenuService); 