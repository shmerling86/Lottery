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

    $scope.userId = loginSrv.getActiveUser().id;


    $scope.toggleCustom = function () {
        $scope.participation = 0;

        $scope.custom = $scope.custom === false ? true : false;
        if ($scope.custom == false) {
            listSrv.getJoinDate().then(function (userDataParticipation) {

                $scope.participations = userDataParticipation


                for (var i = 0; i < $scope.participations.length; i++) {
                    moment.locale('he');
                    $scope.participations[i]['joinDate'] = moment($scope.participations[i]['joinDate']).fromNow()
                }

            }, function (error) {
                $log.error(error)
            });

            listSrv.getTheWinner().then(function (lotteryWinner) {
                $scope.winners = lotteryWinner

                for (var i = 0; i < $scope.winners.length; i++) {
                    moment.locale('he');
                    $scope.winners[i]['winTime'] = moment($scope.winners[i]['winTime']).fromNow()
                }

            }, function (error) {
                $log.error(error)
            });

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
                if (item.complete >= 100) return true;
                break;
        }
        return false;
    }

    $scope.lotteries = [];
    $scope.competitors = [];

    listSrv.getAllLotteries().then(function (lotteries) {

        $scope.lotteries = lotteries;

    }, function (error) {
        $log.error(error)
    });

    $scope.completePercentage = 0;


    $scope.getAndCount = function (btn, index) {
        $scope.custom = true;
        moment.locale('he');
        $scope.clickTime = moment().format();


        listSrv.getJoinDate().then(function (userDataParticipation) {
            $scope.participations = userDataParticipation

            listSrv.dateTheJoin($scope.clickTime, $scope.lotteries[index]['productName'], $scope.participations).then(function (participation) {

                $scope.participation = participation.length

            }, function (error) {
                $log.error(error)
            });

        }, function (error) {
            $log.error(error)
        });


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
                            moment.locale('he');
                            $scope.winTime = moment().format();

                            listSrv.patchTheWinner($scope.idOfWinner, lotteries[index]['productName'], $scope.winTime).then(function () {


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