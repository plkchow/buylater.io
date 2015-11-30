var bl;
(function (bl) {
    var Authentication = (function () {
        function Authentication() {
            this.email = ko.observable("");
        }
        Authentication.prototype.signout = function () {
            bl.auth.email("");
            bl.app.alertsList.removeAll();
            bl.cache.removeEmail();
            bl.cache.removeToken();
        };
        Authentication.prototype.onGoogleLoad = function () {
            var gapi = window.gapi;
            gapi.load("auth2", function () {
                gapi.auth2.init({
                    client_id: "226140050721-rpr9pka0notlvbqfv3l7tp3iigadcotl.apps.googleusercontent.com"
                });
            });
        };
        Authentication.prototype.googleSignIn = function () {
            var gapi = window.gapi;
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signIn().then(function () {
                var user = auth2.currentUser.get();
                var response = user.getAuthResponse();
                var idToken = response.id_token;
                bl.auth.getBearerToken("google", idToken);
            });
        };
        Authentication.prototype.getBearerToken = function (provider, token) {
            var data = { provider: provider, token: token };
            $.get(bl.appSettings.baseUrl + "/accounts/token", data)
                .done(function (result) {
                bl.auth.email(result.userName);
                bl.cache.setEmail(result.userName);
                bl.cache.setToken(result.access_token);
                bl.app.getAlerts();
            });
        };
        Authentication.prototype.verifyCacheToken = function () {
            $.ajax({
                url: bl.appSettings.baseUrl + "/accounts/verify",
                type: "GET",
                success: function (email) {
                    bl.auth.email(email);
                    bl.app.getAlerts();
                }
            });
        };
        return Authentication;
    })();
    bl.Authentication = Authentication;
    bl.auth = new Authentication();
})(bl || (bl = {}));
