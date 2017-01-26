/**
 * BigDataBrain
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl($scope, AuthenticationService) {

    var main = this;
    $scope.hastImage = 'hidden';

    $scope.updateCredentials = function() {
        var globals = AuthenticationService.getCredentials();
        var credentials = globals.currentUser;
        var menu = globals.currentMenu;
        if (credentials) {
            main.userName = credentials.firstname;
            main.avatarId = credentials.avatarId;
            if( credentials.avatarId == null || credentials.avatarId === undefined ) {
                $scope.hastImage = 'hidden';
            } else {
                $scope.hastImage = '';
            }
            if( menu ) {
                $scope.menu = menu.entries;
            } else {
                $scope.menu = Array();
            }
        } else {
            main.userName = 'Demo User';
        }
    };

    (function initController() {
        $scope.updateCredentials();
    })();

    $scope.$on('credentialsUpdated', function(event, args) {
      $scope.updateCredentials();  
    });

    return main;
};

/**
 * InitialCtrl - controller
 */
function InitialCtrl($state, $scope, AuthenticationService) {

    $state.go($scope.menu[0].sref);
};

/**
 * TranslateCtrl - controller
 */
function TranslateCtrl($translate, $scope) {
    $scope.changeLanguage = function (langKey) {
    	alert(langKey);
        $translate.use(langKey);
        $scope.language = langKey;
    };
};



/**
 * LoginCtrl - controller
 */
function LoginCtrl($scope, $location, AuthenticationService) {

    var vm = this;
    vm.showError = false;
    vm.errorMessage = '';

    (function initController() {
        // reset login status
        AuthenticationService.clearCredentials();
    })();

    $scope.login = function(){

        $scope.loadingLogin = true;
        $scope.loginForm.username.$dirty = true;
        $scope.loginForm.password.$dirty = true;
        vm.showError = false;
        vm.errorMessage = '';

        if(!$scope.loginForm.$invalid) {
            AuthenticationService.login($scope.username, $scope.password, function (response) {
                if (response.token) {
                    AuthenticationService.setCredentials(response, null);
                    AuthenticationService.loadMenu(function(menuResponse) {
                        AuthenticationService.setCredentials(response, menuResponse);
                        $scope.$emit('credentialsUpdated');
                        $location.path('/');
                        $scope.loadingLogin = false;
                    });
                } else {
                    vm.showError = true;
                    vm.errorMessage = 'Usuario o contraseña incorrecta';
                    $scope.loadingLogin = false;
                }
            });
        } else {
            $scope.loadingLogin = false;
        }
    };

    return vm;
};

/**
 * Logout - controller
 */
function LogoutCtrl($scope, $location, AuthenticationService) {
    $scope.logout = function(){
        AuthenticationService.logout(function(response) {
            $location.path('/login');    
        });
    };
};


angular
    .module('bdb')
    .controller('MainCtrl', MainCtrl)
    .controller('InitialCtrl', InitialCtrl)
    .controller('LoginCtrl', LoginCtrl)
    .controller('LogoutCtrl', LogoutCtrl)
    .controller('TranslateCtrl', TranslateCtrl);
