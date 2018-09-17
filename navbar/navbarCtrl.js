app.controller('navbarCtrl', function ($scope, loginSrv, $location) {

    $scope.logout = function () {
        loginSrv.logout();
        $location.path('/');
    }

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

});
