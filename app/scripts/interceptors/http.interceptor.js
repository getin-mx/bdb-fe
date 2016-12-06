angular
  .module('bdb')
  .factory('httpErrorResponseInterceptor', ['$q', '$location',
    function($q, $location) {
      return {
        response: function(responseData) {
          return responseData;
        },
        responseError: function error(response) {
          switch (response.status) {
            case 401:
              $location.path('/login');
              break;
            case 404:
              $location.path('/404');
              break;
            case 200: 
              if( response.data !== undefined && response.data !== error_code ) {
                if( response.data.error_code == '408' )
                  $location.path('/login');
              }
              break;
            default:
              $location.path('/500');
          }

          return $q.reject(response);
        }
      };
    }
  ]);

//Http Intercpetor to check auth failures for xhr requests
angular
  .module('bdb')
  .config(['$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('httpErrorResponseInterceptor');
    }
  ]);