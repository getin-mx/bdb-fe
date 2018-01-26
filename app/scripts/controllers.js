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
function SessionCtrl($scope, $rootScope, $location, AuthenticationService, CommonsService, $uibModal , $http) {
    $scope.init = function() {
        var globals = AuthenticationService.getCredentials();
        var credentials = globals.currentUser;
        if (credentials) {
            $scope.userName = credentials.firstname;
            $scope.avatarId = credentials.avatarId;
            $scope.identifier = credentials.identifier;
            if( credentials.avatarId == null || credentials.avatarId === undefined ) {
                $scope.hastImage = 'hidden';
            } else {
                $scope.hastImage = '';
            }
        } else {
            $scope.userName = 'Demo User';
        }

        $scope.obj = {};
    }

    $scope.logout = function(){
        AuthenticationService.logout(function(response) {
            $location.path('/login');
        });
    };

    $scope.showPasswordChangeModal = function() {
        $rootScope.passModalInstance = $uibModal.open({
            templateUrl: 'views/base/password.change.html',
            size: 'md',
            controller: SessionCtrl
        });
    };

    $scope.changePassword = function() {
        var message = undefined;

        if( $scope.obj.currentPassword == '' || $scope.obj.currentPassword === undefined ) {
            message = 'Por favor, ingresa tu contraseña actual';
        } else if( $scope.obj.newPassword == '' || $scope.obj.newPassword === undefined ) {
            message = 'Por favor, ingresa tu nueva contraseña';
        } else if( $scope.obj.newPassword2 == '' || $scope.obj.newPassword2 === undefined ) {
            message = 'Por favor, ingresa tu confirmación de contraseña';
        } else if( $scope.obj.newPassword == $scope.obj.currentPassword ) {
            message = 'Tu nueva contrseña no puede ser igual a la actual';
        } else if( $scope.obj.newPassword != $scope.obj.newPassword2 ) {
            message = 'Tu nueva contraseña no coincide con su confirmación';
        }

        if( message !== undefined ) {
            alert("Error!" + message + "error");
        } else {
            $scope.loadingSubmit = true;
            $http.post((CommonsService.getUrl('/pass')), $scope.obj)
                .then(function(data) {
                    if(data.data.error_code === undefined) {
                        alert("La contraseña fue cambiada con éxito");
                        $rootScope.passModalInstance.close();
                    } else if(data.data.error_code == 407) {
                        alert("La contraseña actual es incorrecta");
                    } else {
                        alert("Ocurrió un error al cambiar la contraseña. Por favor, inténtalo más tarde");
                    }
                    $scope.loadingSubmit = false;
                })
        }

    }
};

angular
    .module('bdb')
    .controller('MainCtrl', MainCtrl)
    .controller('InitialCtrl', InitialCtrl)
    .controller('LoginCtrl', LoginCtrl)
    .controller('SessionCtrl', SessionCtrl)
    .controller('TranslateCtrl', TranslateCtrl);
