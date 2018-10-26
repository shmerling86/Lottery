app.controller('listCtrl', function ($scope, listSrv, loginSrv, $location, $log) {

    if (!loginSrv.isLoggedIn()) {
        $location.path('/');
    }

    $scope.isLogged = function () {
        return loginSrv.isLoggedIn()
    }

    $scope.logout = function () {
        loginSrv.logout();
        $location.path('/');
    }

    $scope.custom = true;
    $scope.toggleCustom = function() {
        $scope.custom = $scope.custom === false ? true: false;
    };

    $scope.kindOfSort = "active";

    $scope.sortByStatus = function (item) {

        switch ($scope.kindOfSort) {
            case "all":
                return true;
            case "active":
                if (item.complete < 100) return true;
                break;

            case "completed":
                if (item.complete == 100) return true;
                break;
        }
        return false;
    }

    $scope.lotteries = [];

    listSrv.getAllLotteries().then(function (lotteries) {

        $scope.lotteries = lotteries;


    }, function (error) {
        $log.error(error)
    });

    $scope.completePercentage = 0;
    // $scope.competitors = [];

    $scope.getAndCount = function (btn, index) {


        listSrv.getAllLotteries().then(function (lotteries) {

            var lengOfCompetittors = lotteries[index].competitors.length
            var numOfParticipants = lotteries[index].numberOfParticipants
            var howMuchFinish = lotteries[index].complete


            if (lengOfCompetittors == 0) {

                $scope.completePercentage = ((1 / numOfParticipants) * 100)

            } else if (lengOfCompetittors > 0 && lengOfCompetittors < numOfParticipants) {

                $scope.completePercentage = ((lengOfCompetittors + 1) / numOfParticipants) * 100;

            } else if (howMuchFinish >= 100) {
                $scope.completePercentage = 100
            }


                // for (var j = 0; j < lotteries[index].competitors.length; j++) {

                //     if (lotteries[index].competitors[j] === loginSrv.getActiveUser().id) {
                //         console.log(loginSrv.getActiveUser().id);

                //     }
                // }


            listSrv.getAllCompetitors(index).then(function (competitors) {

                $scope.competitorsId = competitors

                listSrv.countMeIn(index, $scope.competitorsId, $scope.completePercentage).then(function () {

                    btn.target.disabled = true;

                    if ($scope.completePercentage == 100) {

                        listSrv.lotteryGen(index).then(function (winnerId) {
                            $scope.idOfWinner = winnerId

                            listSrv.patchTheWinner($scope.idOfWinner, index).then(function () {

                            }, function (error) {
                                $log.error(error)
                            });

                        }, function (error) {
                            $log.error(error)
                        });
                    }

                }, function (error) {
                    $log.error(error)
                });

            }, function (error) {
                $log.error(error)
            });

        }, function (error) {
            $log.error(error)
        });



    };


});