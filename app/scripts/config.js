/**
 * BigDataBrain
 *
 */

/**
 * General configuration
 */
var config = {};

config.baseUrl = 'http://api.allshoppings.mobi/bdb';
config.dashUrl = 'http://api.allshoppings.mobi/appv2';

// config.baseUrl = 'http://localhost:8081/bdb';
// config.dashUrl = 'http://localhost:8081/appv2';

config.oneMonth = 2505600000;
config.oneWeek = 518400000;
config.oneDay = 86400000;

/**
 * Angular configuration
 */
function angularConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'Main view' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: { pageTitle: 'Login', specialClass: 'gray-bg' }
        })
        .state('404', {
            url: "/404",
            templateUrl: "views/error404.html",
            data: { pageTitle: '404', specialClass: 'gray-bg' }
        })
        .state('500', {
            url: "/500",
            templateUrl: "views/error500.html",
            data: { pageTitle: '500', specialClass: 'gray-bg' }
        })

        .state('index.trafficmap', {
            url: "/trafficmap",
            templateUrl: "views/base/trafficmap.html",
            data: { pageTitle: 'Tráfico Vehicular'}
        })

        .state('index.influencemap', {
            url: "/influencemap",
            templateUrl: "views/base/influencemap.html",
            data: { pageTitle: 'Mapa de Influencia'}
        })

        .state('index.apdvisits', {
            url: "/apdvisits",
            templateUrl: "views/custom/apdvisits.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.storeplacer', {
            url: "/storeplacer",
            templateUrl: "views/custom/storeplacer.html",
            data: { pageTitle: 'Ubicacion'}
        })

        .state('index.storetickets', {
            url: "/storetickets",
            templateUrl: "views/custom/storetickets.html",
            data: { pageTitle: 'Tickets'}
        })

        .state('index.test', {
            url: "/test",
            templateUrl: "views/custom/test.html",
            data: { pageTitle: 'Test de Componentes'}
        })

        .state('index.apddetails', {
            url: "/apddetails",
            templateUrl: "views/custom/apddetails.html",
            data: { pageTitle: 'Detalles'}
        })

        .state('index.mtheatmap', {
            url: "/mtheatmap",
            templateUrl: "views/custom/mt_heatmap.html",
            data: { pageTitle: 'Heatmap'}
        })

        .state('mtheatmap_frame', {
            url: "/mtheatmap_frame",
            templateUrl: "views/custom/mt_heatmap_frame.html",
            data: { pageTitle: 'Heatmap', specialClass: 'white-bg' }
        })

        .state('index.heatmap', {
            url: "/heatmap",
            templateUrl: "views/custom/heatmap.html",
            data: { pageTitle: 'Heatmap'}
        })

        .state('heatmap_frame', {
            url: "/heatmap_frame",
            templateUrl: "views/custom/heatmap_frame.html",
            data: { pageTitle: 'Heatmap', specialClass: 'white-bg' }
        })


        .state('index.demoheatmap', {
            url: "/demoheatmap",
            templateUrl: "views/custom/demo_heatmap.html",
            data: { pageTitle: 'Heatmap'}
        })

        .state('index.demomap', {
            url: "/demomap",
            templateUrl: "views/custom/demo_maps.html",
            data: { pageTitle: 'Mapas'}
        })

        .state('index.demovisits', {
            url: "/demovisits",
            templateUrl: "views/custom/demo_visits.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.demovisits3', {
            url: "/demovisits3",
            templateUrl: "views/custom/demo_visits_3.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.demoareas', {
            url: "/demoareas",
            templateUrl: "views/custom/demo_areas.html",
            data: { pageTitle: 'Areas de Afluencia'}
        })

        .state('index.users', {
            url: "/users",
            templateUrl: "views/base/users.html",
            data: { pageTitle: 'Usuarios'}
        })

        .state('index.applications', {
            url: "/applications",
            templateUrl: "views/base/applications.html",
            data: { pageTitle: 'Aplicaciones'}
        })

        .state('index.shoppings', {
            url: "/shoppings",
            templateUrl: "views/base/shoppings.html",
            data: { pageTitle: 'Centros Comerciales'}
        })

        .state('index.shoppingsettings', {
            url: "/shoppingsettings/{identifier}",
            templateUrl: "views/base/shopping.settings.html",
            data: { pageTitle: 'Configuracion de Centros Comerciales'}
        })

        .state('index.brands', {
            url: "/brands",
            templateUrl: "views/base/brands.html",
            data: { pageTitle: 'Cadenas'}
        })

        .state('index.apdevices', {
            url: "/apdevices",
            templateUrl: "views/base/apdevices.html",
            data: { pageTitle: 'Antenas'}
        })

        .state('index.apuptime', {
            url: "/apuptime/{hostname}",
            templateUrl: "views/base/apuptime.html",
            data: { pageTitle: 'Uptime de Antenas'}
        })

        .state('index.aplocation', {
            url: "/aplocation/{hostname}",
            templateUrl: "views/base/aplocation.html",
            data: { pageTitle: 'Ubicacion de Antenas'}
        })

        .state('index.apdevicesettings', {
            url: "/apdevicesettings/{hostname}",
            templateUrl: "views/base/apdevice.settings.html",
            data: { pageTitle: 'Configuracion de Antena'}
        })

};

/**
 * Cookie run control
 */
function run($rootScope, $state, $cookieStore, $http, $location) {
    // keep user logged in after page refresh
    $rootScope.$state = $state;
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.token; // jshint ignore:line
    }
 
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });

    // Moment.js locale configuration
    moment.locale(moment.locale(), {invalidDate: ""});

};

// Enter key trap
angular
    .module('bdb')
    .directive('bdbEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.bdbEnter);
                });

                event.preventDefault();
            }inde
        });
    };
});

angular
    .module('bdb')
    .config(angularConfig)
    .run(run);
