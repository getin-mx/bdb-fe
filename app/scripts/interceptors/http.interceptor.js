angular
  .module('bdb')
  .factory('httpErrorResponseInterceptor', ['$q', '$location',
    function($q, $location) {
      return {
        response: function(response) {
          if( response.data !== undefined && response.data.error_code !== undefined ) {
            if( response.data.error_code == 408 ) {
               $location.path('/loginAdmin');
            }
          } else {
            return response;
          }
        },
        responseError: function error(response) {
          switch (response.status) {
            case 401:
              $location.path('/loginAdmin');
              break;
            case 404:
              $location.path('/404');
              break;
            case 200: 
              if( response.data !== undefined && response.data.error_code !== undefined ) {
                if( response.data.error_code == 408 ) {
                   $location.path('/loginAdmin');
                }
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