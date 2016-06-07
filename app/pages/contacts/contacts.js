"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var opportunities_service_1 = require("../../providers/opportunities-service/opportunities-service");
var modal_new_candidate_1 = require("../modal-new-candidate/modal-new-candidate");
var index_1 = require("ionic-native/dist/index");
var core_1 = require("@angular/core");
var ContactsPage = (function () {
    function ContactsPage(nav, navParams, opportunitiesService) {
        var _this = this;
        this.nav = nav;
        this.navParams = navParams;
        this.voidCandidates = true;
        this.storage = new ionic_angular_1.Storage(ionic_angular_1.LocalStorage);
        this.opportunitiesService = opportunitiesService;
        this.storage.get('OPPORTUNITY').then(function (opp) {
            _this.opportunity = JSON.parse(opp);
            _this.opportunitiesService.loadOpportunityCandidates(_this.opportunity).then(function (data) {
                _this.voidCandidates = data.length == 0;
                _this.candidates = data;
            });
        });
    }
    ContactsPage.prototype.addNewCandidates = function () {
        var _this = this;
        var newCandidatePage = new ionic_angular_1.Modal(modal_new_candidate_1.ModalNewCandidatePage);
        newCandidatePage.onDismiss(function (candidate) {
            if (candidate && candidate.id > 0) {
                _this.voidCandidates = false;
                _this.candidates.push(candidate);
                if (candidate.createdAccount) {
                    var options = {
                        replaceLineBreaks: true,
                        android: {
                            intent: ''
                        }
                    };
                    var message = "Vous êtes invité à créer un compte sur href://www.vitonjob.com afin d'accéder à l'offre '" + _this.opportunity.title + "'";
                    console.log(message);
                    index_1.SMS.send(candidate.tel, message, options);
                }
            }
        });
        this.storage.set('OPP', JSON.stringify(this.opportunity)).then(function () {
            _this.nav.present(newCandidatePage);
        });
    };
    ContactsPage.prototype.popScreen = function () {
        this.nav.pop();
    };
    ContactsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/contacts/contacts.html',
            providers: [opportunities_service_1.OpportunitiesService]
        })
    ], ContactsPage);
    return ContactsPage;
}());
exports.ContactsPage = ContactsPage;
//# sourceMappingURL=contacts.js.map