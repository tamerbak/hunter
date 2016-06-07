"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var configs_1 = require('../../configurations/configs');
var authentication_service_1 = require("../../providers/authentication.service");
var load_list_service_1 = require("../../providers/load-list.service");
var data_provider_service_1 = require("../../providers/data-provider.service");
var global_service_1 = require("../../providers/global.service");
var validation_data_service_1 = require("../../providers/validation-data.service");
var home_1 = require("../home/home");
var info_user_1 = require("../info-user/info-user");
var ionic_angular_2 = require('ionic-angular');
var core_1 = require('@angular/core');
core_1.enableProdMode();
/**
 * @author Amal ROCHD
 * @description authentication by phone view
 * @module Authentication
 */
var PhonePage = (function () {
    /**
     * @description While constructing the view, we load the list of countries to display their codes
     */
    function PhonePage(nav, gc, authService, loadListService, dataProviderService, globalService, validationDataService, events) {
        var _this = this;
        this.nav = nav;
        this.gc = gc;
        this.authService = authService;
        this.loadListService = loadListService;
        this.dataProviderService = dataProviderService;
        this.globalService = globalService;
        this.validationDataService = validationDataService;
        this.events = events;
        this.pays = [];
        // Set global configs
        // Get target to determine configs
        this.projectTarget = gc.getProjectTarget();
        this.storage = new ionic_angular_2.Storage(ionic_angular_2.SqlStorage);
        // get config of selected target
        var config = configs_1.Configs.setConfigs(this.projectTarget);
        // Set local variables and messages
        this.themeColor = config.themeColor;
        this.isEmployer = (this.projectTarget == 'employer');
        this.phoneTitle = "Téléphone";
        this.index = 33;
        this.libelleButton = "Se connecter";
        //load countries list
        this.loadListService.loadCountries(this.projectTarget).then(function (data) {
            _this.pays = data.data;
        });
    }
    /**
     * @description Display the list of countries in an alert
     */
    PhonePage.prototype.doRadioAlert = function () {
        var _this = this;
        var alert = ionic_angular_1.Alert.create();
        alert.setTitle('Choisissez votre pays');
        for (var _i = 0, _a = this.pays; _i < _a.length; _i++) {
            var p = _a[_i];
            alert.addInput({
                type: 'radio',
                label: p.nom,
                value: p.indicatif_telephonique,
                //france code by default checked
                checked: p.indicatif_telephonique == '33'
            });
        }
        alert.addButton('Annuler');
        alert.addButton({
            text: 'Ok',
            handler: function (data) {
                console.log('Radio data:', data);
                _this.index = data;
            }
        });
        this.nav.present(alert).then(function () {
        });
    };
    /**
     * @description function called to authenticate a user
     */
    PhonePage.prototype.authenticate = function () {
        var _this = this;
        var indPhone = this.index + this.phone;
        var loading = ionic_angular_1.Loading.create({
            content: " \n\t\t\t<div>\n\t\t\t<img src='img/loading.gif' />\n\t\t\t</div>\n\t\t\t",
            spinner: 'hide'
        });
        this.nav.present(loading);
        //call the service of autentication
        this.authService.authenticate(this.email, indPhone, this.password1, this.projectTarget)
            .then(function (data) {
            console.log(data);
            //case of authentication failure : server unavailable or connection probleme 
            if (!data || data.length == 0 || (data.id == 0 && data.status == "failure")) {
                console.log(data);
                loading.dismiss();
                _this.globalService.showAlertValidation("VitOnJob", "Serveur non disponible ou problème de connexion.");
                return;
            }
            //case of authentication failure : incorrect password 
            if (data.id == 0 && data.status == "passwordError") {
                console.log("Password error");
                loading.dismiss();
                _this.globalService.showAlertValidation("VitOnJob", "Votre mot de passe est incorrect");
                return;
            }
            //case of authentication success
            _this.authService.setObj('connexion', null);
            _this.authService.setObj('currentUser', null);
            var connexion = {
                'etat': true,
                'libelle': 'Se déconnecter',
                'employeID': (_this.projectTarget == 'jobyer' ? data.jobyerId : data.employerId)
            };
            //load device token to current account
            var token;
            _this.authService.getObj('deviceToken').then(function (val) {
                token = val;
            });
            var accountId = data.id;
            if (token) {
                console.log("insertion du token : " + token);
                _this.authService.insertToken(token, accountId, _this.projectTarget);
            }
            _this.storage.set('connexion', JSON.stringify(connexion));
            _this.storage.set('currentUser', JSON.stringify(data)).then(function () {
                _this.events.publish('user:login');
                //user is connected, then change the name of connexion btn to deconnection
                _this.gc.setCnxBtnName("Déconnexion");
                loading.dismiss();
                //if user is connected for the first time, redirect him to the page 'civility', else redirect him to the home page
                var isNewUser = data.newAccount;
                if (isNewUser) {
                    _this.globalService.showAlertValidation("VitOnJob", "Bienvenue dans votre espace VitOnJob!");
                    _this.nav.push(info_user_1.InfoUserPage, {
                        currentUser: data });
                }
                else {
                    _this.nav.rootNav.setRoot(home_1.HomePage);
                }
            });
        });
    };
    /**
     * @description function called to decide if the auth/inscr button should be disabled
     */
    PhonePage.prototype.isAuthDisabled = function () {
        if (this.showEmailField == true) {
            //inscription
            return (!this.index || !this.phone || this.showPhoneError() || !this.password1 || this.showPassword1Error() || !this.password2 || this.showPassword2Error() || !this.email || this.showEmailError());
        }
        else {
            //connection
            return (!this.index || !this.phone || !this.password1);
        }
    };
    /**
     * @description function called on change of the phone input to validate it
     */
    PhonePage.prototype.checkForString = function (e) {
        if (e.keyCode < 48 || e.keyCode > 57) {
            e.preventDefault();
            return;
        }
    };
    /**
     * @description validate phone data field and call the function that search for it in the server
     */
    PhonePage.prototype.watchPhone = function (e, el) {
        if (this.phone) {
            this.phone = this.phone.replace("-", "").replace(".", "").replace("+", "").replace(" ", "").replace("(", "").replace(")", "").replace("/", "").replace(",", "").replace("#", "").replace("*", "").replace(";", "").replace("N", "");
            if (this.phone.length == 10) {
                if (this.phone.substring(0, 1) == '0') {
                    this.phone = this.phone.substring(1, 10);
                }
                else {
                    this.phone = this.phone.substring(0, 9);
                }
            }
            if (this.phone.length == 9) {
                this.isRegistration(el);
            }
        }
    };
    /**
     * @description show error msg if phone is not valid
     */
    PhonePage.prototype.showPhoneError = function () {
        if (this.phone)
            return (this.phone.length != 9);
    };
    /**
     * @description function called when the phone input is valid to decide if the form is for inscription or authentication
     */
    PhonePage.prototype.isRegistration = function (el) {
        var _this = this;
        if (this.isPhoneValid()) {
            // Testing if phone number exists
            var tel = "+" + this.index + this.phone;
            this.dataProviderService.getUserByPhone(tel, this.projectTarget).then(function (data) {
                if (!data || data.status == "failure") {
                    console.log(data);
                    _this.globalService.showAlertValidation("VitOnJob", "Serveur non disponible ou problème de connexion.");
                    return;
                }
                if (!data || data.data.length == 0) {
                    _this.showEmailField = true;
                    _this.email = "";
                    _this.libelleButton = "S'inscrire";
                }
                else {
                    _this.email = data.data[0]["email"];
                    _this.libelleButton = "Se connecter";
                    _this.showEmailField = false;
                }
            });
        }
        else {
            this.showEmailField = true;
            this.libelleButton = "S'inscrire";
            this.email = "";
        }
    };
    /**
     * @description validate the phone format
     */
    PhonePage.prototype.isPhoneValid = function () {
        if (this.phone != undefined) {
            var phone_REGEXP = /^0/;
            var isMatchRegex = phone_REGEXP.test(this.phone);
            console.log("isMatchRegex = " + isMatchRegex);
            if (Number(this.phone.length) >= 9 && !isMatchRegex) {
                console.log('test phone');
                return true;
            }
            else
                return false;
        }
        else
            return false;
    };
    /**
     * @description validate the email format
     */
    PhonePage.prototype.showEmailError = function () {
        if (this.email)
            return !(this.validationDataService.checkEmail(this.email));
        else
            return false;
    };
    /**
     * @description show error msg if password is not valid
     */
    PhonePage.prototype.showPassword1Error = function () {
        if (this.password1 && this.showEmailField)
            return this.password1.length < 6;
    };
    /**
     * @description check if the password and its confirmation are the same
     */
    PhonePage.prototype.showPassword2Error = function () {
        if (this.password2)
            return this.password2 != this.password1;
    };
    /**
     * @description return to the home page
     */
    PhonePage.prototype.goBack = function () {
        this.nav.rootNav.setRoot(home_1.HomePage);
    };
    PhonePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/phone/phone.html',
            providers: [authentication_service_1.AuthenticationService, load_list_service_1.LoadListService, data_provider_service_1.DataProviderService, global_service_1.GlobalService, validation_data_service_1.ValidationDataService]
        })
    ], PhonePage);
    return PhonePage;
}());
exports.PhonePage = PhonePage;
//# sourceMappingURL=phone.js.map