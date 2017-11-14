'use strict';
angular.module('bdb')
  .factory('preventTemplateCache', function($injector) {

    //var ENV = $injector.get('ENV');
    return {
          'request': function(config) {
            if (config.url.indexOf('views') !== -1) {
              config.url = config.url + '?t=' + Math.floor(Date.now() / 1000);
            }
            return config;
          }
        }
  });

angular.module('bdb').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('preventTemplateCache');
}]);
