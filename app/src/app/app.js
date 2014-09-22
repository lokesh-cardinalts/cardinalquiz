angular.module( 'cardinalQuizApp', [
  'cardinalQuizApp.home',
  'cardinalQuizApp.dashboard',
  'ui.router',
  'cardinalQuiz.config',
  'cardinalQuizApp.services',
  'cardinalQuizApp.directives'  
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.filter('escape', function() {
  return window.escape;
})

.controller( 'AppCtrl', ['$scope', '$location', 'APP_NAME', function AppCtrl ( $scope, $location, appName ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ' + appName ;
    }
  });
}])

.controller( 'HeaderCtrl', ['$scope', 'APP_VERSION', function($scope, appVersion) {
  $scope.menu = [
                  {
                    "label": "Home",
                    "url": "/home",
                    "sref": "home"
                  },
                  {
                    "label": "My Quizzes",
                    "url": "/my-quiz",
                    "sref": "my-quiz"
                  }
                ];
   $scope.appVersion = appVersion;
}]);

;

