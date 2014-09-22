angular.module( 'cardinalQuizApp.services', [
])
.service('quizService', function($http) {
  var quizList = [];

  var addQuizDataFromApi = function(newObj) {
    quizList = newObj;
  }

  var addQuiz = function(newObj) {
    quizList.push(newObj);
  }

  var getQuizzes = function(){
    return quizList;
  };

  var getQuizById = function(id){
    var quizById = null;

    angular.forEach(quizList, function(value, key) {
      if (parseInt(id) == parseInt(value.quiz_id)) {
        quizById = value;
      }
    });
    return quizById;
  };

  var getQuizzesFromApi = function(callback) {
    $http({method: 'GET', url: 'data/my_quizzes.json'}).
      success(function(data, status, headers, config) {
        addQuizDataFromApi(data);
        callback();
      });        
  };

  var assignToFriends = function(quizId, selectedFriends, callback) {
    $http({
      method: 'GET', 
      url: 'data/assign_quiz.json', 
      data: { 
              quizId:quizId, 
              selectedFriends:selectedFriends
            } 
    })
    .success(function(data, status, headers, config) {
        callback(data);
    });
  };
  
  var getPlatformQuestions = function(callback) {
    $http({
      method: 'GET', 
      url: 'data/get_platform_questions.json'
    })
    .success(function(data, status, headers, config) {
        callback(data);
    });
  }
  
  var createQuiz = function(quizObj, callback) {
    $http({
      method: 'POST', 
      url: 'data/create_quiz.json'
    })
    .success(function(data, status, headers, config) {
        callback(data);
    });
  }

  return {
    addQuiz: addQuiz,
    getQuizzes: getQuizzes,
    getQuizzesFromApi : getQuizzesFromApi,
    getQuizById: getQuizById,
    addQuizDataFromApi : addQuizDataFromApi,
    assignToFriends : assignToFriends,
    getPlatformQuestions : getPlatformQuestions,
    createQuiz:createQuiz
  };

});
