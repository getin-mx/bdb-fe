/**
 * BigDataBrain
 *
 */

/**
 * pageTitle - Directive for set Page title - mata title
 */
 function pageTitle($rootScope, $timeout) {
 	return {
 		link: function(scope, element) {
 			var listener = function(event, toState, toParams, fromState, fromParams) {
				// Default title - load on Dashboard 1
				var title = 'BigDataBrain Dashboard';
				// Create your own title pattern
				if (toState.data && toState.data.pageTitle) title = 'BDB | ' + toState.data.pageTitle;
				$timeout(function() {
					element.text(title);
				});
			};
			$rootScope.$on('$stateChangeStart', listener);
		}
	}
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
 function sideNavigation($timeout) {
 	return {
 		restrict: 'A',
 		link: function(scope, element) {
			// Call the metsiMenu plugin and plug it to sidebar navigation
			$timeout(function(){
				element.metisMenu();
			});
		}
	};
};

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
 function iboxTools($timeout) {
 	return {
 		restrict: 'A',
 		scope: true,
 		templateUrl: 'views/common/ibox_tools.html',
 		controller: function ($scope, $element) {
			// Function for collapse ibox
			$scope.showhide = function () {
				var ibox = $element.closest('div.ibox');
				var icon = $element.find('i:first');
				var content = ibox.find('div.ibox-content');
				content.slideToggle(200);
				// Toggle icon from up to down
				icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
				ibox.toggleClass('').toggleClass('border-bottom');
				$timeout(function () {
					ibox.resize();
					ibox.find('[id^=map-]').resize();
				}, 50);
			},
				// Function for close ibox
				$scope.closebox = function () {
					var ibox = $element.closest('div.ibox');
					ibox.remove();
				}
			}
		};
	};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
 function minimalizaSidebar($timeout) {
 	return {
 		restrict: 'A',
 		template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary" href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
 		controller: function ($scope, $element) {
 			$scope.minimalize = function () {
 				$("body").toggleClass("mini-navbar");
 				if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
					// Hide menu in order to smoothly turn on when maximize menu
					$('#side-menu').hide();
					// For smoothly turn on menu
					setTimeout(
						function () {
							$('#side-menu').fadeIn(400);
						}, 200);
				} else if ($('body').hasClass('fixed-sidebar')){
					$('#side-menu').hide();
					setTimeout(
						function () {
							$('#side-menu').fadeIn(400);
						}, 100);
				} else {
					// Remove all inline style from jquery fadeIn function to reset menu state
					$('#side-menu').removeAttr('style');
				}
			}
		}
	};
};

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
 function iboxToolsFullScreen($timeout) {
 	return {
 		restrict: 'A',
 		scope: true,
 		templateUrl: 'views/common/ibox_tools_full_screen.html',
 		controller: function ($scope, $element) {
			// Function for collapse ibox
			$scope.showhide = function () {
				var ibox = $element.closest('div.ibox');
				var icon = $element.find('i:first');
				var content = ibox.find('div.ibox-content');
				content.slideToggle(200);
				// Toggle icon from up to down
				icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
				ibox.toggleClass('').toggleClass('border-bottom');
				$timeout(function () {
					ibox.resize();
					ibox.find('[id^=map-]').resize();
				}, 50);
			};
			// Function for close ibox
			$scope.closebox = function () {
				var ibox = $element.closest('div.ibox');
				ibox.remove();
			};
			// Function for full screen
			$scope.fullscreen = function () {
				var ibox = $element.closest('div.ibox');
				var button = $element.find('i.fa-expand');
				$('body').toggleClass('fullscreen-ibox-mode');
				button.toggleClass('fa-expand').toggleClass('fa-compress');
				ibox.toggleClass('fullscreen');
				setTimeout(function() {
					$(window).trigger('resize');
				}, 100);
			}
		}
	};
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
 function ionRangeSlider() {
 	return {
 		restrict: 'A',
 		scope: {
 			rangeOptions: '='
 		},
 		link: function (scope, elem, attrs) {
 			elem.ionRangeSlider(scope.rangeOptions);
 		}
 	}
 }

/**
 * touchSpin - Directive for Bootstrap TouchSpin
 */
 function touchSpin() {
 	return {
 		restrict: 'A',
 		scope: {
 			spinOptions: '='
 		},
 		link: function (scope, element, attrs) {
 			scope.$watch(scope.spinOptions, function(){
 				render();
 			});
 			var render = function () {
 				$(element).TouchSpin(scope.spinOptions);
 			};
 		}
 	}
 };

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
 function dropzone() {
 	return {
 		restrict: 'C',
 		link: function(scope, element, attrs) {
      debugger;
 			var dropzoneConfig = {
 				url: config.uploadUrl,
 				parallelUploads: 1,
 				maxFiles: 1,
 				createImageThumbnails: true,
        addRemoveLinks: true,
 				maxThumbnailFilesize: 10,
 				thumbnailWidth: 80,
 				thumbnailHeight: 80,
 				autoProcessQueue: true,
        acceptedFiles: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
 			};

 			var eventHandlers = {
 				'addedfile': function(file) {
 					scope.file = file;
 					if (this.files[1]!=null) {
 						this.removeFile(this.files[0]);
 					}
 					scope.$apply(function() {
 						scope.fileAdded = true;
 					});
 				},

 				'success': function (file, response) {
 					file.previewElement.classList.add('hide-trans');
          debugger;
 					scope.$emit('upload.success', [file,response]);
 				}

 			};

 			dropzone = new Dropzone(element[0], dropzoneConfig);

 			angular.forEach(eventHandlers, function(handler, event) {
 				dropzone.on(event, handler);
 			});

 			scope.processDropzone = function() {
 				dropzone.processQueue();
 			};

 			scope.resetDropzone = function() {
 				dropzone.removeAllFiles();
 			}
 		}
 	}
 }

/**
 * icheck - Directive for custom checkbox icheck
 */
 function icheck($timeout) {
 	return {
 		restrict: 'A',
 		require: 'ngModel',
 		link: function($scope, element, $attrs, ngModel) {
 			return $timeout(function() {
 				var value;
 				value = $attrs['value'];

 				$scope.$watch($attrs['ngModel'], function(newValue){
 					$(element).iCheck('update');
 				})

 				return $(element).iCheck({
 					checkboxClass: 'icheckbox_square-green',
 					radioClass: 'iradio_square-green'

 				}).on('ifChanged', function(event) {
 					if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
 						$scope.$apply(function() {
 							return ngModel.$setViewValue(event.target.checked);
 						});
 					}
 					if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
 						return $scope.$apply(function() {
 							return ngModel.$setViewValue(value);
 						});
 					}
 				});
 			});
 		}
 	};
 }

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
 function lightboxGallery() {
 	return {
 		link: function(scope, element, attrs) {
 			element[0].onclick = function (event) {
 				event = event || window.event;
 				var target = event.target || event.srcElement,
 				link = target.src ? target.parentNode : target,
 				options = {index: link, event: event},
 				links = this.getElementsByTagName('a');

 				if( target.tagName == 'I' || target.tagName == 'SPAN')
 					return;

 				blueimp.Gallery(links, options);
 			};

 			var list = element[0].getElementsByTagName("IMG");
 			for( var i = 0; i < list.length; i++ ) {
 				var node = list[0];
 				var newNode = document.createElement('span');
 				var parentNode = node.parentNode;
 				newNode.classList.add('thumb-delete');
 				newNode.classList.add('hidden');
 				newNode.innerHTML = '<i class="fa fa-times" aria-hidden="true" style="width: 20px; height: 20px;"></i>';
 				newNode.onclick = function(e) {
 					e.preventDefault();
 					var parentNode = this.parentNode;
 					while( parentNode.tagName != 'A')
 						parentNode = parentNode.parentNode;
 					scope.$emit('ligboxgallery.delete', parentNode);
 				}
 				parentNode.onmouseover = function() {
 					this.getElementsByTagName("SPAN")[0].classList.remove('hidden');
 				};
 				parentNode.onmouseout = function() {
 					this.getElementsByTagName("SPAN")[0].classList.add('hidden');
 				};
 				parentNode.insertBefore(newNode, node.nextSibling);
 			}
 		}
 	}
 }

/**
 *
 * Pass all functions into module
 */
 angular
 .module('bdb')
 .directive('pageTitle', pageTitle)
 .directive('sideNavigation', sideNavigation)
 .directive('iboxTools', iboxTools)
 .directive('minimalizaSidebar', minimalizaSidebar)
 .directive('ionRangeSlider', ionRangeSlider)
 .directive('touchSpin', touchSpin)
 .directive('dropzone', dropzone)
 .directive('iboxToolsFullScreen', iboxToolsFullScreen)
 .directive('icheck', icheck)
 .directive('lightboxGallery', lightboxGallery);
