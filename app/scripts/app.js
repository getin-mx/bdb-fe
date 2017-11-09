/**
 * BigDataBrain
 *
 */

(function () {
    angular.module('bdb', [
        'ngCookies',                    // Cookies Manager
        'ui.router',                    // Routing
        'pascalprecht.translate',       // Angular Translate
        'ui.bootstrap',                 // Bootstrap
        'angular-ladda',				        // Ladda plugin
        'datePicker',					          // Angular Date Pciker
        'ui.footable',					        // Foo Tables
        'ui.knob',                      // jsKnob
        'angularModalService',
        'localytics.directives',        // angular-chosen (just provided... not in repo)
        'summernote',                   // Summernote text editor
        'angular-flot',                 // Flot Charts
        'angles',                       // Chartjs
        'BrowserCache'
    ])
})();
