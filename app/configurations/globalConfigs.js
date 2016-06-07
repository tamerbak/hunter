/**
 * Created by tim on 06/05/2016.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var GlobalConfigs = (function () {
    function GlobalConfigs() {
        this.projectTarget = "employer";
        this.cnxBtnName = "Se connecter / S'inscrire";
    }
    GlobalConfigs.prototype.setProjectTarget = function (value) {
        this.projectTarget = value;
    };
    GlobalConfigs.prototype.getProjectTarget = function () {
        return this.projectTarget;
    };
    GlobalConfigs.prototype.setCnxBtnName = function (value) {
        this.cnxBtnName = value;
    };
    GlobalConfigs.prototype.getCnxBtnName = function () {
        return this.cnxBtnName;
    };
    GlobalConfigs = __decorate([
        core_1.Injectable()
    ], GlobalConfigs);
    return GlobalConfigs;
}());
exports.GlobalConfigs = GlobalConfigs;
//# sourceMappingURL=globalConfigs.js.map