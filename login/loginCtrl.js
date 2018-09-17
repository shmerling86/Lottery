app.controller('loginCtrl', function ($scope, $location, loginSrv) {

    if (loginSrv.isLoggedIn()) {
        $location.path('/options');
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

            // console.log(user.id);
            
            $location.path('/options');

        }, function () {
            $scope.invalidLogin = true;
        })
    }


});