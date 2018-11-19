app.factory('winSrv', function ($q, $http) {

    function getWinLotterieInfo(idx) {

        var async = $q.defer();
            var url = 'https://json-server-heroku-eexxarsqwr.now.sh/lotteries/' + idx;

       

        $http.get(url).then(function (lottery) {

            async.resolve(lottery.data);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    }

    function getWinLotterieSeller(idx) {

        var async = $q.defer();
            var url = 'https://json-server-heroku-eexxarsqwr.now.sh/users/' + idx;

       

        $http.get(url).then(function (user) {

            async.resolve(user.data);
        }, function (err) {
            async.reject(err);
        });
        return async.promise;
    }



    return{
        getWinLotterieInfo: getWinLotterieInfo,
        getWinLotterieSeller: getWinLotterieSeller
    }

});
