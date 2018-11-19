app.controller('winCtrl', function (loginSrv, $location, $scope, listSrv, $log, winSrv) {

    if (!loginSrv.isLoggedIn()) {
        $location.path('/login');
    }

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

    $scope.logout = function () {
        loginSrv.logout();
        $location.path('/login');
    }

    $scope.userId = loginSrv.getActiveUser().id;

    listSrv.getTheName($scope.userId).then(function (name) {
        $scope.name = name
    });


    listSrv.getTheWinner($scope.userId).then(function (userDataWinner) {

        if (userDataWinner == undefined) {
            return
        } else {

            $scope.winners = userDataWinner
            var j;
            for (var i = 0; i < $scope.winners.length; i++) {
                moment.locale('he');
                j=i
                $scope.winners[i]['time'] = moment($scope.winners[i]['time']).fromNow()

                winSrv.getWinLotterieInfo($scope.winners[i]["lotterieId"]).then(function (lotterieData) {

                    $scope.lotterieInfo = lotterieData

                    winSrv.getWinLotterieSeller($scope.lotterieInfo.sellerUserId).then(function (user) {

                        $scope.winners[j].seller = user.name

                    });

                });
            }
        }

    }, function (error) {
        $log.error(error)
    });




});