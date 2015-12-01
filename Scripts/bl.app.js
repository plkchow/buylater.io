var bl;
(function (bl) {
    var App = (function () {
        function App() {
            var _this = this;
            this.keywords = ko.observable("");
            this.price = ko.observable("");
            this.deleteItem = ko.observable(null);
            this.searchResultList = ko.observableArray([]);
            this.alertsList = ko.observableArray([]);
            this.searching = ko.observable(false);
            this.adding = ko.observable(false);
            this.searchItem = ko.computed(function () {
                if (!_this.searchResultList() || _this.searchResultList().length <= 0)
                    return null;
                var sortedList = _this.searchResultList().sort(function (a, b) {
                    return a.price - b.price;
                });
                return sortedList[0];
            });
            this.discounts = ko.computed(function () {
                if (!_this.searchItem())
                    return [];
                var result = [];
                for (var i = 1; i < 10; i++) {
                    var discount = i * 10;
                    var percentage = (100 - discount) * 0.01;
                    var target = _this.searchItem().price * percentage;
                    result.push(target);
                }
                return result;
            });
            this.validPrice = ko.computed(function () {
                if (!_this.price())
                    return true;
                if (!Number(_this.price()))
                    return false;
                return Number(_this.price()) < _this.searchItem().price;
            });
        }
        App.prototype.init = function () {
            // test server availability
            $.get(bl.appSettings.baseUrl + "/ping")
                .done(function (result) {
                console.log("Ping to api server: " + result);
            });
            // valid token
            $(document).ajaxSend(function (event, xhr, settings) {
                if (bl.cache.getToken()) {
                    xhr.setRequestHeader("Authorization", "Bearer " + bl.cache.getToken());
                }
            });
            $(document).ajaxError(function (event, xhr, settings) {
                if (xhr.status == 401) {
                    bl.cache.removeToken();
                    bl.cache.removeEmail();
                    bl.auth.email("");
                }
            });
            if (bl.cache.getToken()) {
                // Restore previous session
                bl.app.getAlerts();
            }
            else {
                bl.app.onPreloadComplete();
            }
        };
        App.prototype.search = function (d, e) {
            if (!bl.app.keywords()) {
                return;
            }
            bl.app.searching(true);
            var data = { keywords: bl.app.keywords() };
            $.get(bl.appSettings.baseUrl + "/search", data)
                .done(function (result) {
                bl.app.searchResultList(result.items);
            }).always(function () {
                bl.app.searching(false);
            });
        };
        App.prototype.getAlerts = function () {
            $.ajax({
                url: bl.appSettings.baseUrl + "/alerts",
                type: "GET",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + bl.cache.getToken()
                },
                success: function (vm) {
                    bl.auth.email(vm.email);
                    bl.app.alertsList(vm.alerts);
                },
                complete: function () {
                    bl.app.onPreloadComplete();
                }
            });
        };
        App.prototype.addAlert = function () {
            var price = Number(bl.app.price());
            if (price) {
                bl.app.adding(true);
                var data = { index: -1, keywords: bl.app.keywords(), price: price, notified: null };
                $.ajax({
                    url: bl.appSettings.baseUrl + "/alerts",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (success) {
                        bl.app.price("");
                        bl.app.alertsList.push(data);
                        bl.app.scrollTo("#alert");
                    },
                    complete: function () {
                        bl.app.adding(false);
                    }
                });
            }
        };
        App.prototype.showAlert = function (d, e) {
            bl.app.keywords(d.keywords);
            bl.app.search();
        };
        App.prototype.deleteAlert = function (d, e) {
            var deleteItem = bl.app.deleteItem();
            $.ajax({
                url: bl.appSettings.baseUrl + "/alerts/" + deleteItem.index,
                contentType: "application/json",
                type: "DELETE",
                success: function (success) {
                    if (success) {
                        bl.app.alertsList.remove(deleteItem);
                    }
                }
            });
        };
        App.prototype.deleteAlertConfirm = function (d, e) {
            bl.app.deleteItem(d);
        };
        App.prototype.setDiscount = function (d) {
            bl.app.price(d.toFixed(2));
        };
        App.prototype.formatCurrency = function (value) {
            return "$" + value.toFixed(2);
        };
        App.prototype.tooltip = function (notified) {
            if (notified) {
                return "We have sent a notification for this alert on " + notified;
            }
            else {
                return null;
            }
        };
        App.prototype.scrollTo = function (id) {
            $("#html,body").animate({
                scrollTop: $(id).offset().top + "px"
            }, "slow", "swing", function () {
                $.sidr("close", "sidr");
            });
        };
        App.prototype.onPreloadComplete = function () {
            $("#preloader").fadeOut("slow", function () {
                $("#preloader").remove();
            });
        };
        return App;
    })();
    bl.App = App;
    bl.app = new App();
    window.onload = function () {
        ko.applyBindings({ app: bl.app, auth: bl.auth, contact: bl.contact });
        bl.app.init();
        $("body").tooltip();
    };
})(bl || (bl = {}));
//# sourceMappingURL=bl.app.js.map