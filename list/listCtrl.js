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
    $scope.toggleCustom = function () {
        $scope.custom = $scope.custom === false ? true : false;
        if ($scope.custom == false) {
            moment.locale('he');

            $scope.timeOpen = moment(new Date());
                    
            $scope.joinDate = $scope.clickTime.from($scope.timeOpen);

        }

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
    $scope.competitors = [];

    $scope.numOfMsg = 0;

    listSrv.getAllLotteries().then(function (lotteries) {

        $scope.lotteries = lotteries;

    }, function (error) {
        $log.error(error)
    });

    $scope.completePercentage = 0;

    $scope.getAndCount = function (btn, index) {
        moment.locale('he');

        $scope.clickTime = moment(new Date());
    

        $scope.numOfMsg++

        $scope.competitors.push($scope.lotteries[index]);

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