app.controller('listCtrl', function ($scope, listSrv, loginSrv, $location, $log) {

    if (!loginSrv.isLoggedIn()) {
        $location.path('/login');
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


    listSrv.getTheName($scope.userId).then(function (name) {
        $scope.name = name
    });

    $scope.toggleCustom = function () {
        $scope.participation = 0;

        $scope.custom = $scope.custom === false ? true : false;
       
        if ($scope.custom == false) {
            listSrv.getJoinDate($scope.userId).then(function (userDataParticipation) {


                if (userDataParticipation == undefined) {
                    $scope.custom = true;

                    return
                } else {
                    $scope.participations = userDataParticipation

                    for (var i = 0; i < $scope.participations.length; i++) {
                        moment.locale('he');
                        $scope.participations[i]['time'] = moment($scope.participations[i]['time']).fromNow()
                    }
                }
                
            }, function (error) {
                $log.error(error)
            });

            listSrv.getTheWinner($scope.userId).then(function (userDataWinner) {

                if (userDataWinner == undefined) {
                    return
                } else {

                    $scope.winners = userDataWinner

                    for (var i = 0; i < $scope.winners.length; i++) {
                        moment.locale('he');
                        $scope.winners[i]['time'] = moment($scope.winners[i]['time']).fromNow()
                        // $scope.participations.push(moment($scope.winners[i]).fromNow())
                    }
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

    // $scope.lotteries = [];
    $scope.competitors = [];

    listSrv.getAllLotteries().then(function (lotteries) {

        $scope.lotteries = lotteries;

        for (var i = 0; i < lotteries.length; i++) {
            moment.locale('he');
            lotteries[i]['startTime'] = moment(lotteries[i]['startTime']).fromNow()
        }

    }, function (error) {
        $log.error(error)
    });

    $scope.completePercentage = 0;

    $scope.isAlreadyIn = function (idx) {

        listSrv.getAllCompetitors(idx).then(function (competitors) {
            $scope.alreadyIn = false;
            for (let i = 0; i < competitors.length; i++) {
                if ($scope.userId == competitors[i]) {

                    $scope.alreadyIn = true;

                } else {
                    $scope.alreadyIn = false;

                }
            }


        }, function (error) {
            $log.error(error)
        });

    }

    $scope.getAndCount = function (btn, index) {

        $scope.custom = true;
        moment.locale('he');
        $scope.clickTime = moment().format();


        listSrv.getJoinDate($scope.userId).then(function (userDataParticipation) {
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

            // for (var i = 0; i < lotteries.length; i++) {
            //     moment.locale('he');
            //     lotteries[i]['startTime'] = moment(lotteries[i]['startTime']).fromNow()
            // }



            listSrv.getAllCompetitors(index).then(function (competitors) {

                $scope.competitorsId = competitors

                listSrv.countMeIn(index, $scope.competitorsId, $scope.completePercentage).then(function () {

                    btn.target.disabled = true;

                    if ($scope.completePercentage == 100) {

                        listSrv.lotteryGen(index).then(function (winnerId) {
                            $scope.idOfWinner = winnerId
                            moment.locale('he');
                            $scope.time = moment().format();

                            listSrv.patchTheWinner($scope.idOfWinner, lotteries[index]['productName'], $scope.time).then(function () {


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