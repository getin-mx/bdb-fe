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
        'angular-ladda',				// Ladda plugin
        'datePicker',					// Angular Date Pciker
        'ui.footable',					// Foo Tables
        'oitozero.ngSweetAlert',		// SweetAlert
        'ui.knob',                      // jsKnob
        'ui.bootstrap',                 // ui-bootstrap
        'localytics.directives',        // angular-chosen (just provided... not in repo)
        'summernote',                   // Summernote text editor
        'BrowserCache'
    ])
})();
