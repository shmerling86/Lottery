app.factory('listSrv', function ($http, $q, loginSrv) {

    function Lotterie(productName, description, marketPrice, numberOfParticipants, lotteriePrice, image, sellerUserId, competitors, buyerUserId, isPaid, complete, startTime, id) {
        this.productName = productName,
            this.description = description,
            this.marketPrice = marketPrice,
            this.numberOfParticipants = numberOfParticipants,
            this.lotteriePrice = parseInt((this.marketPrice / this.numberOfParticipants).toFixed(0)),
            this.image = image,
            this.sellerUserId = sellerUserId,
            this.competitors = competitors,
            this.buyerUserId = buyerUserId,
            this.isPaid = isPaid,
            this.complete = parseInt((((this.competitors.length) / this.numberOfParticipants) * 100).toFixed(0)),
            this.startTime = startTime
        this.chance = (100 * (1 / this.numberOfParticipants)).toFixed(1),
            this.id = id
    }

    function getAllLotteries() {
        var lotteries = [];

        var async = $q.defer();
        var itemsUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/lotteries';

        $http.get(itemsUrl).then(function (response) {

            response.data.forEach(function (lotterie) {

                lotteries.push(new Lotterie(lotterie.productName, lotterie.description, lotterie.marketPrice, lotterie.numberOfParticipants, lotterie.lotteriePrice,
                    lotterie.image, lotterie.sellerUserId, lotterie.competitors, lotterie.buyerUserId, lotterie.isPaid, lotterie.complete, lotterie.startTime, lotterie.id, lotterie.chance));
            });

            async.resolve(lotteries);
        }, function (err) {
            console.error(err)
            async.reject(err)
        });
        return async.promise;
    }

    function getAllCompetitors(idxOfLotterie) {

        var async = $q.defer();
        var itemsUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/lotteries/' + idxOfLotterie
        $http.get(itemsUrl).then(function (lotterie) {

            async.resolve(lotterie.data['competitors']);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    };

    function getJoinDate(userId) {

        var async = $q.defer();

        var itemsUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/users/' + userId

        $http.get(itemsUrl).then(function (user) {

            async.resolve(user.data.participation);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    };

    var participation = [];
    function dateTheJoin(time, index, participations) {

        var async = $q.defer();
        var userId = loginSrv.getActiveUser().id
        var itemsUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/users/' + userId

        if (participations != undefined) {
            participation = participations
        }

        participation.push({
            lotteryN: index,
            time: time
        })

        var patch = {
            "participation": participation
        }

        $http.patch(itemsUrl, patch).then(function () {

            async.resolve(participation);
        }, function (err) {

            async.reject(err);
        });
        return async.promise;
    };

    function countMeIn(idxOfLotterie, competitors, completePercentage) {
        var competitors = competitors

        var async = $q.defer();
        var itemsUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/lotteries/' + idxOfLotterie
        var userId = loginSrv.getActiveUser().id

        competitors.push(userId);

        var patch = {
            competitors: competitors,
            complete: completePercentage
        }

        $http.patch(itemsUrl, patch).then(function (res) {

            async.resolve(res);
        }, function (err) {

            async.reject(err);
        });
        return async.promise;
    };

    function getRandomNum(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function lotteryGen(idxOfLottery) {

        var async = $q.defer();
        var Url = 'https://json-server-heroku-ctnjrlaexn.now.sh/lotteries/' + idxOfLottery
        $http.get(Url).then(function (response) {
            var winnerIdPosition = getRandomNum(0, (((response.data["competitors"]).length) - 1))

            async.resolve(response.data["competitors"][winnerIdPosition]);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    }

    var winner = []
    function patchTheWinner(winnerId, finishLottery, time) {


        var async = $q.defer();
        var itemUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/users/' + winnerId

        winner.push({
            time: time,
            finishLottery: finishLottery
        })

        var patch = {
            "winner": winner
        }

        $http.patch(itemUrl, patch).then(function (res) {

            async.resolve(res);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    };

    var loser = [];
    function patchTheLoser(finishLottery, time, losers) {

        for (let i = 0; i < losers.length; i++) {
            var participation = losers[i];

            var async = $q.defer();
            var itemUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/users/' + participation

            loser.push({
                time: time,
                finishLottery: finishLottery
            })

            var patch = {
                "loser": loser
            }

            $http.patch(itemUrl, patch).then(function (res) {

                async.resolve(res);
            }, function (err) {
                async.reject(err);
            });
            return async.promise;
        };
    }



    function getTheWinner(userId) {

        var async = $q.defer();
        var Url = 'https://json-server-heroku-ctnjrlaexn.now.sh/users/' + userId
        $http.get(Url).then(function (lottery) {

            async.resolve(lottery.data.winner);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    }

    function getTheLoser(userId) {

        var async = $q.defer();
        var Url = 'https://json-server-heroku-ctnjrlaexn.now.sh/users/' + userId
        $http.get(Url).then(function (lottery) {

            async.resolve(lottery.data.loser);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    }

    function getTheName(id) {
        var async = $q.defer();
        var loginUrl = 'https://json-server-heroku-ctnjrlaexn.now.sh/users/' + id

        $http.get(loginUrl).then(function (response) {

            async.resolve(response.data.name)

        }, function (err) {
            async.reject(err)
        });
        return async.promise
    };


    return {
        Lotterie: Lotterie,
        getAllLotteries: getAllLotteries,
        countMeIn: countMeIn,
        getAllCompetitors: getAllCompetitors,
        lotteryGen: lotteryGen,
        patchTheWinner: patchTheWinner,
        dateTheJoin: dateTheJoin,
        getJoinDate: getJoinDate,
        getTheWinner: getTheWinner,
        getTheName: getTheName,
        patchTheLoser: patchTheLoser,
        getTheLoser: getTheLoser
    }

});