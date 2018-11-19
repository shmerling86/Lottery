app.controller('signupCtrl', function ($scope, $location, signupSrv, loginSrv, listSrv) {

    if (loginSrv.isLoggedIn()) {
        $location.path('/list');
    }

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

    $scope.newUserName = '';
    $scope.email = '';
    $scope.password = '';

    $scope.addUser = function () {

        signupSrv.addUser($scope.newUserName, $scope.email, $scope.password).then(function (newUser) {

            loginSrv.activeUser = newUser.data
            $location.path('/list');


        }, function (error) {
            $log.error(error)
        });

    };

});