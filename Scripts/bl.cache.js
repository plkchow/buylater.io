var bl;
(function (bl) {
    var Cache = (function () {
        function Cache() {
        }
        Cache.prototype.getEmail = function () {
            return localStorage.getItem("email");
        };
        Cache.prototype.setEmail = function (value) {
            localStorage.setItem("email", value);
        };
        Cache.prototype.removeEmail = function () {
            localStorage.removeItem("email");
        };
        Cache.prototype.getToken = function () {
            return localStorage.getItem("token");
        };
        Cache.prototype.setToken = function (value) {
            localStorage.setItem("token", value);
        };
        Cache.prototype.removeToken = function () {
            localStorage.removeItem("token");
        };
        return Cache;
    })();
    bl.Cache = Cache;
    bl.cache = new Cache();
})(bl || (bl = {}));
//# sourceMappingURL=bl.cache.js.map