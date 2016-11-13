"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var configs_1 = require("../../configurations/configs");
/*
 Generated class for the EmployersService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
var EmployersService = (function () {
    function EmployersService(http) {
        this.http = http;
        this.accounts = null;
    }
    EmployersService.prototype.seekAccounts = function (query) {
        var _this = this;
        var encodedArg = btoa(query);
        var payload = {
            'class': 'fr.protogen.masterdata.model.CCallout',
            id: 146,
            args: [{
                    'class': 'fr.protogen.masterdata.model.CCalloutArguments',
                    label: 'Contact to create',
                    value: encodedArg
                }]
        };
        return new Promise(function (resolve) {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            var headers = Configs.getHttpJsonHeaders();
            _this.http.post(configs_1.Configs.calloutURL, JSON.stringify(payload), { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
               
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                _this.accounts = data;
                resolve(_this.accounts);
            });
        });
    };
    EmployersService.prototype.saveEnterprise = function (opportunity) {
        var _this = this;
        var sql = "update user_opportunite set fk_user_entreprise=" + opportunity.account.idEntreprise + " where pk_user_opportunite=" + opportunity.id;
        console.log('UPDATE OPPORTUNITY SQL : ' + sql);
        return new Promise(function (resolve) {
            var headers = Configs.getHttpTextHeaders();
            _this.http.post(configs_1.Configs.sqlURL, sql, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.opportunity = opportunity;
                resolve(_this.opportunity);
            });
        });
    };
    EmployersService = __decorate([
        core_1.Injectable()
    ], EmployersService);
    return EmployersService;
}());
exports.EmployersService = EmployersService;
//# sourceMappingURL=employers-service.js.map