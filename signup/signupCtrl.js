app.controller('signupCtrl', function ($scope, $location, signupSrv, loginSrv) {

    if (loginSrv.isLoggedIn()) {
        $location.path('/list');
    }

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

    $scope.fullName = '';
    $scope.email = '';
    $scope.password = '';

    $scope.addUser = function () {

        signupSrv.addUser($scope.fullName, $scope.email, $scope.password).then(function (newUser) {

            // activeUser = newUser.data
            $location.path('/login');


        }, function (error) {
            $log.error(error)
        });

    };

});