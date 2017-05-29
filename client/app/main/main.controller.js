'use strict';

angular.module('fccuserlistApp')
  .controller('MainCtrl', [ '$scope', '$http', '$auth', '$location',
    function ($scope, $http, $auth, $location ) {
    $scope.campers = [];
    $scope.onRecentPage = true;
    $scope.showingFollowing = false;

    $scope.singleUser;

    $scope.me;

    $scope.notFound = false;

    $scope.isLoggedIn = $auth.isAuthenticated;

// Sorting the table
      $scope.predicate = 'totalRecent';

      $scope.reverse = true;
      $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : true;
        $scope.predicate = predicate;
      };


    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then($scope.getMe);
    };

    $scope.getMe = function(response) {
      $http.get('/auth/github/me')
        .success(function(data) {
          $scope.me = data;
      })
    };

    $scope.handleEnter = function($event){
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
         $scope.getUserRanking();
      }
    };

    // $scope.getDataRecent = function() {

    //   $scope.recentActivity = "recent activity from ";
    //   $scope.singleUser = undefined;
    //   $scope.onRecentPage = true;
    //   $scope.showingFollowing = false;
    //   $http.get('/api/fccusers/challenges').then(function(challenges) {
    //     sessionStorage.challenges = angular.toJson(challenges);
    //     $http.get('/api/fccusers/top100/recent').then(function(campers) {
    //       challenges = angular.fromJson(sessionStorage.challenges).data;
    //       console.log(challenges);
    //       for(var i=0;i<campers.data.length;i++){
    //         var fullcount = 0;
    //         var continus = 0;
    //         var skipped = false;
    //         for(var c=0;c<challenges.length;c++){
    //         console.log("t");
    //           var hasDone = false;
    //           for(var j=0;j<campers.data[i].progressTimestamps.length;j++){
    //             if(campers.data[i].email == "srimal.w@fidenz.com"){
    //               console.log("srimal");
    //               console.log("completedChallenge" in campers.data[i].progressTimestamps[j]);
    //             }
    //             if( "completedChallenge" in campers.data[i].progressTimestamps[j]){
    //             var completed_challenge = campers.data[i].progressTimestamps[j];
    //               if(completed_challenge.completedChallenge == challenges[c]._id){
    //                 hasDone = true;
    //                 break;
    //               }
    //             }
    //           }
    //           if(hasDone && !skipped){
    //             continus++;
    //             fullcount++;
    //           } else if(hasDone){
    //             skipped = true;
    //             fullcount++;
    //           }
    //         }
    //         campers.data[i].continus = continus;
    //         campers.data[i].fullcount = fullcount;
    //         campers.data[i].skipped = skipped;
    //       }
    //       console.log(campers.data);
    //   //     $scope.order($scope.newPredicate());
    //        $scope.reverse = true;
    //        $scope.campers = campers.data;
    //     });
    //   });



    // };


    $scope.getDataRecent = function() {

      $scope.recentActivity = "recent activity from ";
      $scope.singleUser = undefined;
      $scope.onRecentPage = true;
      $scope.showingFollowing = false;
      $http.get('/api/fccusers/challenges').then(function(challenges) {
        sessionStorage.challenges = angular.toJson(challenges);
        $http.get('/api/fccusers/top100/recent').then(function(campers) {
          challenges = angular.fromJson(sessionStorage.challenges).data;
          var datatmp = $scope.getWinnersInformation(challenges,campers.data,true);
          // console.log(datatmp);
          // for (var i =0; i< datatmp.length; i ++) {
          //    console.log(datatmp[i].user_email +" - " + datatmp[i].eventusercode);
          // }
           $scope.reverse = true;
           $scope.campers = datatmp;
        });
      });



    };

    $scope.getWinnersInformation = function(challengesCollection, attemptUsersList, isSortBySkipedIndex)
    {
        var stats = [];
        var challenges = [];
        var challengesFilterd = [];

        challengesCollection.sort(function(a,b) {
          return a.suborder - b.suborder;
        });
        challengesCollection.forEach( function (challange) 
        {
            if(challange["title"].indexOf("Challenge")>=0 && challange["title"].indexOf("codeCampChallenge")==-1)
            {
                challenges.push(challange["_id"].toString());
            }
        });

        attemptUsersList.forEach( function(user)
        { 
            var sequence = [];
            var answerList = [];
            var answers = user.challengeMap;

            var lastTimeStamp = 0.0;
            var sequenceTimeStamp = 0.0;
            var lastCompletedQuiz = -1;

            var date = new Date();
            var sequenceTime = new Date();
            
            for (var key in answers)
            {
                var answer = answers[key];

                answerList.push(answer);
                sequence.push(answer["id"]);
                lastTimeStamp = answer["completedDate"];
            }

            var answered_count = 0;
            var skip_indexs = [];
            var skipCount = 0;

            loopchallengesFilterd:
            for(var a=0; a < challenges.length; a++)
            {
                var challange = challenges[a];

                if (sequence.indexOf(challange) == -1)
                {
                    if(skipCount == 0 && lastCompletedQuiz != -1)
                    {
                        var ans = answerList[lastCompletedQuiz];
                        sequenceTimeStamp = ans["completedDate"];
                    }
                    skip_indexs.push(a+1);
                    skipCount++;
                } 
                else 
                {
                    lastCompletedQuiz = sequence.indexOf(challange);
                    answered_count++;
                }
            }
            
            skip_indexs.sort(function (a, b)
            {
               return a - b;
            });

            date = new Date(lastTimeStamp);
            sequenceTime = new Date(sequenceTimeStamp);

            var stat = {"user_email": user.email,
                "name": (user.firstname+" "+user.lastname),
                "username": user.username,
                "eventusercode": user.eventusercode, 
                "gender": user.gender,
                "profile_image": user.picture,
                "answered_count": answered_count, 
                "sequence_length": skip_indexs[0]-1,
                "first_quiz_skipped": skip_indexs[0],
                "number_of_quiz_skiped":skip_indexs.length,
                "sequence_complete_time": (sequenceTimeStamp == 0 ? "":sequenceTime.toString('yyyy/MM/dd HH:mm:ss')).split(' ').slice(0, 5).join(' '),
                "last_quiz_completed_time": (lastTimeStamp == 0 ? "":date.toString('yyyy/MM/dd HH:mm:ss')).split(' ').slice(0, 5).join(' ')};

            stats.push(stat);
        });

        if(isSortBySkipedIndex)
        {
            stats.sort(function (a, b){
                return b.first_quiz_skipped - a.first_quiz_skipped;
            });
        }
        else
        {
            stats.sort(function (a, b){
                return b.answered_count - a.answered_count;
            });  
        }
        return stats;
    }

    $scope.newPredicate = function() {
      if ($scope.predicate === 'username') return $scope.predicate;
      if ($scope.predicate === 'totalRecent') return 'total';
      if ($scope.predicate === 'total') return 'totalRecent';
      if ($scope.predicate === 'pointsRecent') return 'points';
      if ($scope.predicate === 'points') return 'pointsRecent';
      if ($scope.predicate === 'projectsRecent') return 'projects';
      if ($scope.predicate === 'projects') return 'projectsRecent';
      if ($scope.predicate === 'cummunityRecent') return 'cummunity';
      if ($scope.predicate === 'community') return 'communityRecent';
      return 'totalRecent';
    };

    $scope.getDataFollowing = function() {

      $scope.recentActivity = "recent activity from ";
      $scope.onRecentPage = true;
      $scope.showingFollowing = true;
      $http.get('/api/fccusers/following/recent/'+$scope.me.username).success(function(campers) {
         $scope.campers = campers;
      });
    };

    $scope.getDataAlltime = function() {
       $scope.onRecentPage = false;
       $scope.singleUser = undefined;
       $scope.showingFollowing = false;
       $http.get('/api/fccusers/top100/alltime').success(function(campers) {
//         $scope.order($scope.newPredicate());
         $scope.reverse = true;
         $scope.campers = campers;
       });
    };

    $scope.refreshUser = function(username) {
      $http.get('/api/fccusers/update/'+username).success(function() {
        setTimeout(function() {
            if ($scope.onRecentPage) {
              $scope.getDataRecent();
            }
            else {
              $scope.getDataAlltime();
            }
            $scope.$apply();
        }, 3000);
      });
    };

    $scope.followUser = function(username) {
      if (username === 'input') {
        $http.get('/api/fccusers/verify/username/'+$scope.username)
         .then(function(response) {
           var user = response.data;
           username = user.username;
           $http.put('/api/fccusers/follow/'+$scope.me.username+'/'+username).success(function() {
              $scope.getMe();
           }); 
        }, function(err) {
          $scope.notFound = true;
        });
      }
      else {
        $scope.notFound = false;
        $http.put('/api/fccusers/follow/'+$scope.me.username+'/'+username).success(function() {
              $scope.getMe();
        }); 
      }
    };

    $scope.unfollowUser = function(username) {
      if ($scope.showingFollowing) {
        for (var i=0;i<$scope.campers.length; i++) {
          if ($scope.campers[i].username === username) {
            $scope.campers.splice(i,1);
            break;
          }
        }
      }

      $http.put('/api/fccusers/unfollow/'+$scope.me.username+'/'+username).success(function() {
        $scope.getMe();
      });
    };

    $scope.isFollowing = function(username) {
      return ($scope.me && $scope.me.username !== username && $scope.me.following.indexOf(username) >= 0);
    };

    $scope.isNotFollowing = function(username) {
      return ($scope.me && $scope.me.username !== username && $scope.me.following.indexOf(username) < 0);
    };

    $scope.getUserRanking = function() {
		if (!$scope.username) return false;

		$scope.notFound = false;
      $http.get('/api/fccusers/ranking-'+($scope.onRecentPage?'r':'o')+'/'+$scope.username)
         .then(function(response) {
      		$scope.singleUser = response.data;
      }, function(err) {
      	$scope.notFound = true;
      });
    };

    if ($scope.isLoggedIn()) {
      $scope.getMe();
    }

    $scope.getDataRecent();

  }]);
