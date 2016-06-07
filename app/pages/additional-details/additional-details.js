"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var entreprise_1 = require('../entreprise/entreprise');
var offre_1 = require('../offre/offre');
var contacts_1 = require('../contacts/contacts');
var core_1 = require("@angular/core");
var AdditionalDetailsPage = (function () {
    function AdditionalDetailsPage(nav) {
        this.nav = nav;
        // set the root pages for each tab
        this.tab1Root = entreprise_1.EntreprisePage;
        this.tab2Root = offre_1.OffrePage;
        this.tab3Root = contacts_1.ContactsPage;
    }
    AdditionalDetailsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/additional-details/additional-details.html'
        })
    ], AdditionalDetailsPage);
    return AdditionalDetailsPage;
}());
exports.AdditionalDetailsPage = AdditionalDetailsPage;
//# sourceMappingURL=additional-details.js.map