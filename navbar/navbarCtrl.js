app.controller('navbarCtrl', function ($scope, loginSrv, listSrv, $location) {

    if (loginSrv.isLoggedIn()) {
        $location.path('/list');
    } else{
        $location.path('/login');

    }

    $scope.logout = function () {
        loginSrv.logout();
        $location.path('/login');
    }

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

   
});
