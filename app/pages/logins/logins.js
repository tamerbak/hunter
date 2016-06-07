"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var globalConfigs_1 = require('../../configurations/globalConfigs');
var phone_1 = require('../phone/phone');
var mail_1 = require('../mail/mail');
var core_1 = require("@angular/core");
var LoginsPage = (function () {
    function LoginsPage(nav, navParams) {
        this.nav = nav;
        // set the root pages for each tab
        this.phoneRoot = phone_1.PhonePage;
        this.mailRoot = mail_1.MailPage;
        this.nav = nav;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        // Set local variables and messages
        this.phoneTabTitle = "Téléphone";
        this.mailTabTitle = "E-mail";
    }
    LoginsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/logins/logins.html',
            providers: [globalConfigs_1.GlobalConfigs]
        })
    ], LoginsPage);
    return LoginsPage;
}());
exports.LoginsPage = LoginsPage;
//# sourceMappingURL=logins.js.map