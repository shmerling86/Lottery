app.controller('loginCtrl', function ($scope, $location, $log, loginSrv) {

    if (loginSrv.isLoggedIn()) {
        $location.path('/list');
    }

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

    $scope.email = '';
    $scope.password = '';
    $scope.invalidLogin = false;

    $scope.login = function () {
        $scope.invalidLogin = false;
        
        loginSrv.login($scope.email, $scope.password).then(function (user) {

            $location.path('/list');

        }, function (error) {
            $scope.invalidLogin = true;

            $log.error(error)
        });

    }


});