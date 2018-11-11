app.factory('newSrv', function ($q, $http) {


    function addLotterie(productName, description, marketPrice, numberOfParticipants, lotteriePrice ,sellerUserId, competitors, complete, startTime, chance) {

        var async = $q.defer();

        var itemsUrl = 'https://json-server-heroku-eexxarsqwr.now.sh/lotteries';

        var patch = {
            productName: productName,
            description: description,
            marketPrice: marketPrice,
            numberOfParticipants: numberOfParticipants,
            lotteriePrice: lotteriePrice,
            sellerUserId: sellerUserId,
            competitors: competitors,
            complete: complete,
            startTime: startTime,
            chance: chance
        }

        $http.post(itemsUrl, patch).then(function (response) {
            
            async.resolve(response);
        }, function (response) {
            console.error(response)
            async.reject([])
        });
        return async.promise;
    }

    
  
    return {

        addLotterie: addLotterie
    }

});
