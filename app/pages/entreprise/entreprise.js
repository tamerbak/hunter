"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var employers_service_1 = require("../../providers/employers-service/employers-service");
var core_1 = require("@angular/core");
var EntreprisePage = (function () {
    function EntreprisePage(nav, service) {
        var _this = this;
        this.nav = nav;
        this.accounts = [];
        this.noCompany = false;
        debugger;
        this.opportunity = {
            account: {
                fullName: '',
                tel: '',
                email: ''
            }
        };
        this.service = service;
        this.storage = new ionic_angular_1.Storage(ionic_angular_1.LocalStorage);
        this.storage.get('OPPORTUNITY').then(function (opp) {
            debugger;
            _this.opportunity = JSON.parse(opp);
            if (!_this.opportunity.account) {
                _this.opportunity.account = {
                    fullName: '',
                    tel: '',
                    email: ''
                };
                _this.noCompany = true;
            }
        });
    }
    EntreprisePage.prototype.popScreen = function () {
        this.nav.pop();
    };
    EntreprisePage.prototype.search = function () {
        var _this = this;
        this.service.seekAccounts(this.searchText).then(function (accounts) {
            _this.accounts = accounts;
        });
    };
    EntreprisePage.prototype.selectAccount = function (account) {
        var _this = this;
        this.opportunity.account = account;
        this.service.saveEnterprise(this.opportunity).then(function (data) {
            _this.storage.set('OPPORTUNITY', JSON.stringify(_this.opportunity));
        });
    };
    EntreprisePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/entreprise/entreprise.html',
            providers: [employers_service_1.EmployersService]
        })
    ], EntreprisePage);
    return EntreprisePage;
}());
exports.EntreprisePage = EntreprisePage;
//# sourceMappingURL=entreprise.js.map