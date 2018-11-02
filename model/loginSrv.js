app.factory('loginSrv', function ($http, $q) {

    var activeUser = null;

    function User(plainUser) {
        this.name = plainUser.name;
        this.email = plainUser.email;
        this.password = plainUser.password;
        this.id = plainUser.id;
    }

    function isLoggedIn() {
        return activeUser ? true : false;
    }

    function logout() {
        activeUser = null;
    }

    function login(email, password) {
        var async = $q.defer();
        var loginUrl = 'https://json-server-heroku-bhjylyubnn.now.sh' + '/users?email=' + email + "&password=" + password;

        $http.get(loginUrl).then(function (response) {

            if (response.data.length > 0) {
                activeUser = new User(response.data[0]);
                 
                async.resolve(activeUser)
            } else {
                async.reject('invalid Credentials');
            }
        }, function (err) {
            async.reject(err)
        });
        return async.promise
    };

    function getActiveUser() {
        return activeUser;
    }

    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        getActiveUser: getActiveUser,
        activeUser: activeUser
    }

});


