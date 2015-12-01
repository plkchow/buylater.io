var bl;
(function (bl) {
    var AppSettings = (function () {
        function AppSettings() {
            this.baseUrl = "https://microsoft-apiapp9451454733aa46e89d5760c3c4d4952f.azurewebsites.net/api";
        }
        return AppSettings;
    })();
    bl.AppSettings = AppSettings;
    bl.appSettings = new AppSettings();
})(bl || (bl = {}));
//# sourceMappingURL=bl.appSettings.js.map