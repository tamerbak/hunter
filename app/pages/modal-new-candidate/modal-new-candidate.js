"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var opportunities_service_1 = require("../../providers/opportunities-service/opportunities-service");
var index_1 = require("ionic-native/dist/index");
var core_1 = require("@angular/core");
var ModalNewCandidatePage = (function () {
    function ModalNewCandidatePage(nav, navParams, service, viewCtrl) {
        var _this = this;
        this.nav = nav;
        this.navParams = navParams;
        this.candidates = [];
        this.storage = new ionic_angular_1.Storage(ionic_angular_1.LocalStorage);
        this.storage.get('OPP').then(function (result) {
            _this.opportunity = JSON.parse((result));
        });
        this.service = service;
        this.viewCtrl = viewCtrl;
        this.contact = {
            id: 0,
            tel: '',
            email: '',
            deviceToken: '',
            concluded: false,
            seen: false,
            seenDate: '',
            firstName: '',
            lastName: '',
            title: ''
        };
    }
    ModalNewCandidatePage.prototype.seekContact = function (evt) {
        var _this = this;
        this.contactInfo = evt.target.value;
        this.candidates = [];
        index_1.Contacts.find(['*'], { filter: this.contactInfo }).then(function (contacts) {
            console.log(contacts);
            for (var i = 0; i < contacts.length; i++) {
                var c = {
                    displayName: contacts[i].displayName,
                    tel: ''
                };
                if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length > 0) {
                    c.tel = contacts[i].phoneNumbers[0].value;
                }
                _this.candidates.push(c);
            }
        });
    };
    ModalNewCandidatePage.prototype.selectContact = function (c) {
        var _this = this;
        this.service.addCandidate(c, this.opportunity).then(function (contact) {
            _this.contact = contact;
            _this.viewCtrl.dismiss(_this.contact);
        });
    };
    ModalNewCandidatePage.prototype.cancelAdding = function () {
        this.contact.id = 0;
        this.viewCtrl.dismiss(this.contact);
    };
    ModalNewCandidatePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/modal-new-candidate/modal-new-candidate.html',
            providers: [opportunities_service_1.OpportunitiesService]
        })
    ], ModalNewCandidatePage);
    return ModalNewCandidatePage;
}());
exports.ModalNewCandidatePage = ModalNewCandidatePage;
//# sourceMappingURL=modal-new-candidate.js.map