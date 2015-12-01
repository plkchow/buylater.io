var bl;
(function (bl) {
    var Contact = (function () {
        function Contact() {
            this.email = ko.observable("");
            this.message = ko.observable("");
            this.sending = ko.observable(false);
        }
        Contact.prototype.send = function () {
            if (bl.contact.email() && bl.contact.message()) {
                var data = { email: bl.contact.email(), message: bl.contact.message() };
                bl.contact.sending(true);
                $.ajax({
                    url: bl.appSettings.baseUrl + "/contact",
                    type: "POST",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (success) {
                        bl.contact.message("");
                    },
                    complete: function () {
                        bl.contact.sending(false);
                    }
                });
            }
        };
        return Contact;
    })();
    bl.Contact = Contact;
    bl.contact = new Contact();
})(bl || (bl = {}));
//# sourceMappingURL=bl.contact.js.map