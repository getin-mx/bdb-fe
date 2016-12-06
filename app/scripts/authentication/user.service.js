/**
 * BigDataBrain
 *
 */

function UserService($http, CommonsService) {
	this.login = function(username, password) {
		return $http.post(CommonsService.getUrl('/auth'), {
				identifier: username,
				password: password
			}, {
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then(this.handleSuccess, this.handleError('Error logging ing'));
	}

	this.logout = function() {
		return $http.delete(CommonsService.getUrl('/auth'))
			.then(this.handleSuccess, this.handleError('Error logging out'));
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
	.factory('UserService', UserService); 