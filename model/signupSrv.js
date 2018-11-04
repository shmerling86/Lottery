app.factory('signupSrv', function ($q, $http) {

  function addUser(name, email, password) {

        var async = $q.defer();
        var signupUrl = 'https://json-server-heroku-feciwgcalx.now.sh/users'
        var patch = {
            name: name,
            email: email,
            password: password
        };

        $http.post(signupUrl, patch).then(function (response) {
            async.resolve(response)
        }, function (err) {
            async.reject(err);
        });
        return async.promise
    };

    return {
        addUser: addUser
    }

});