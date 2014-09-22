angular.module( 'cardinalQuizApp.dashboard', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'my-quiz', {
    name: 'my-quiz',
    url: '/my-quiz',
    views: {
      "main": {
        controller: 'myQuizzesCtrl',
        templateUrl: 'src/app/dashboard/my_quizzes.tpl.html'
      },
      "header": {
        controller: 'HeaderCtrl',
        templateUrl: 'partials/_header.tpl.html'
      }
    },
    data:{ pageTitle: 'Quizzes Created By Me!' }
  });

  $stateProvider.state( 'assign-quiz', {
    name: 'assign-quiz',
    url: '/quiz/:id/assign',
    views: {
      "main": {
        controller: 'assignQuizCtrl',
        templateUrl: 'src/app/dashboard/assign-quiz.tpl.html'
      },
      "header": {
        controller: 'HeaderCtrl',
        templateUrl: 'partials/_header.tpl.html'
      }
    },
    data:{ pageTitle: 'Assign Quiz to Users!' }
  });

  $stateProvider.state( 'view_quiz_details', {
    name: 'view_quiz_details',
    url: '/quiz/:id/',
    views: {
      "main": {
        controller: 'viewQuizDetailsCtrl',
        templateUrl: 'src/app/dashboard/view_quiz_details.tpl.html'
      },
      "header": {
        controller: 'HeaderCtrl',
        templateUrl: 'partials/_header.tpl.html'
      }
    },
    data:{ pageTitle: 'View Quiz Details!' }
  });
  
  $stateProvider.state( 'view_quiz_questions', {
    name: 'view_quiz_questions',
    url: '/quiz/:id/questions',
    views: {
      "main": {
        controller: 'viewQuizQuestionsCtrl',
        templateUrl: 'src/app/dashboard/view_quiz_questions.tpl.html'
      },
      "header": {
        controller: 'HeaderCtrl',
        templateUrl: 'partials/_header.tpl.html'
      }
    },
    data:{ pageTitle: 'View Quiz Questions!' }
  });
  
  $stateProvider.state( 'create_quiz', {
    name: 'create_quiz',
    url: '/quiz/create',
    views: {
      "main": {
        controller: 'createQuizCtrl',
        templateUrl: 'src/app/dashboard/create_quiz.tpl.html'
      },
      "header": {
        controller: 'HeaderCtrl',
        templateUrl: 'partials/_header.tpl.html'
      }
    },
    data:{ pageTitle: 'Create new Quiz!' }
  });
})

.controller( 'myQuizzesCtrl', function AboutCtrl( $scope, $http, quizService ) {
  $http({method: 'GET', url: 'data/my_quizzes.json'}).
    success(function(data, status, headers, config) {
      quizService.addQuizDataFromApi(data);
      $scope.myQuizzes = quizService.getQuizzes();
    }).
    error(function(data, status, headers, config) {
      
    }
  );
})

.controller( 'assignQuizCtrl', function assignQuizCtrl( $scope, $http, $stateParams, quizService ) {

  $scope.quizDetails = [];
  $scope.userFriends = [];
  $scope.selectedFriends = [];

  /* Get All User Friends */
  $http({method: 'GET', url: 'data/friends.json'})
  .success(function(data, status, headers, config) {
    /* Set User Friends in scope */
    $scope.userFriends = data;
    
    /* Get the selected Quiz Details */
    if (quizService.getQuizzes().length < 1) {
      quizService.getQuizzesFromApi(function(){
        $scope.quizDetails = quizService.getQuizById($stateParams.id);
        /* Set already assigned friends in scope. */
        $scope.setAssignedFriends();
      });
    } else {
      $scope.quizDetails = quizService.getQuizById($stateParams.id);
      /* Set already assigned friends in scope. */
      $scope.setAssignedFriends();
    }
  });

  $scope.setAssignedFriends = function() {
    angular.forEach($scope.quizDetails.assigned_to, function(val, key) {
        $scope.selectedFriends.push(val.fb_user_id);
    });
  };

  $scope.toggleSelection = function toggleSelection(friendId) {
    var idx = $scope.selectedFriends.indexOf(friendId);
    // is currently selected
    if (idx > -1) {
      $scope.selectedFriends.splice(idx, 1);
    }
    // is newly selected
    else {
      $scope.selectedFriends.push(friendId);
    }
  };

  $scope.assignQuizToUsers = function() {
    quizService.assignToFriends($scope.quizDetails.quiz_id, $scope.selectedFriends, function(response){
      if (response.status == 'success') {
        alert('Quiz Assigned successfully to selected Friends.')
      }
    });
  };
})
.controller( 'viewQuizQuestionsCtrl', function viewQuizQuestionsCtrl( $scope, $http, $stateParams, quizService ) {
  $scope.quizQuestions = [];
  
  /* Get All Quiz Questions */
  $http({method: 'GET', url: 'data/quiz_questions.json'})
  .success(function(data, status, headers, config) {
    /* Set User Friends in scope */
    $scope.quizQuestions = data;
    
    /* Get the selected Quiz Details */
    if (quizService.getQuizzes().length < 1) {
      quizService.getQuizzesFromApi(function(){
        $scope.quizDetails = quizService.getQuizById($stateParams.id);
      });
    } else {
      $scope.quizDetails = quizService.getQuizById($stateParams.id);
    }
  });
})
.controller( 'createQuizCtrl', function createQuizCtrl( $scope, $http, $stateParams, $location, quizService ) {
  $scope.quiz = { 
    'quiz_name' : '',
    'num_question' : '',
    'selected_questions' : []
  };

  $scope.disableQuizTextBox = false;
  $scope.selectedQuestions = [];

  $scope.$watch('platformQuestion', function(platformQuestion){
      var selectedQuestion = [];
      var selectedItems = 0;
      angular.forEach(platformQuestion, function(question){
        if (question.selected) {
          selectedQuestion.push(question);
        }
      })
      $scope.quiz.selected_questions = selectedQuestion;
  }, true);

  $scope.getQuestionsForQuiz = function(){
    $scope.disableQuizTextBox = true;
    quizService.getPlatformQuestions(function(data){
      $scope.platformQuestion = data;
    });
  };
  
  $scope.createQuiz = function(){
    quizService.createQuiz($scope.quiz, function(data){
      alert('status = ' + data.status);
      alert('createdQuizId = ' + data.quiz_details.quiz_id);
      quizService.addQuiz(data.quiz_details);
      $location.path('/quiz/'+data.quiz_details.quiz_id+'/');
      
      
      //$state.transitionTo(...)
      
    });
  };
})
.controller( 'viewQuizDetailsCtrl', function createQuizCtrl( $scope, $http, $stateParams, quizService ) {
  $scope.quizDetails = quizService.getQuizById($stateParams.id);
  console.log($scope.quizDetails);
});
  





