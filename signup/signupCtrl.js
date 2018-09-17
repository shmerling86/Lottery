app.controller('signupCtrl', function ($scope, $location, signupSrv, loginSrv) {

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

    $scope.fullName = '';
    $scope.email = '';
    $scope.password = '';

    $scope.addUser = function () {

        signupSrv.addUser($scope.fullName, $scope.email, $scope.password).then(function (newUser) {

            $location.path('/login');


        }, function (error) {
            $log.error(error)
        });

    };

});