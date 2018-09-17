app.factory('newSrv', function ($q, $http, loginSrv) {


    function addLotterie(productName, description, marketPrice, numberOfParticipants, lotteriePrice ,sellerUserId, competitors, complete) {

        var async = $q.defer();

        var itemsUrl = 'https://json-server-heroku-pzqjawpbmu.now.sh/lotteries';

        var patch = {
            productName: productName,
            description: description,
            marketPrice: marketPrice,
            numberOfParticipants: numberOfParticipants,
            lotteriePrice: lotteriePrice,
            sellerUserId: sellerUserId,
            competitors: competitors,
            complete: complete
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
