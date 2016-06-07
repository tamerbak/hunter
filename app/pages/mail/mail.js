"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var configs_1 = require('../../configurations/configs');
var globalConfigs_1 = require('../../configurations/globalConfigs');
var authentication_service_1 = require("../../providers/authentication.service");
var load_list_service_1 = require("../../providers/load-list.service");
var data_provider_service_1 = require("../../providers/data-provider.service");
var global_service_1 = require("../../providers/global.service");
var validation_data_service_1 = require("../../providers/validation-data.service");
var home_1 = require("../home/home");
var info_user_1 = require("../info-user/info-user");
var core_1 = require("@angular/core");
/**
    * @author Amal ROCHD
    * @description authentication by mail view
    * @module Authentication
*/
var MailPage = (function () {
    /**
        * @description While constructing the view, we load the list of countries to display their codes
    */
    function MailPage(nav, gc, authService, loadListService, dataProviderService, globalService, validationDataService) {
        var _this = this;
        this.nav = nav;
        this.gc = gc;
        this.authService = authService;
        this.loadListService = loadListService;
        this.dataProviderService = dataProviderService;
        this.globalService = globalService;
        this.validationDataService = validationDataService;
        this.pays = [];
        // Set global configs
        // Get target to determine configs
        this.projectTarget = gc.getProjectTarget();
        // get config of selected target
        var config = configs_1.Configs.setConfigs(this.projectTarget);
        // Set local variables and messages
        this.isEmployer = (this.projectTarget == 'employer');
        this.mailTitle = "E-mail";
        this.themeColor = config.themeColor;
        this.nav = nav;
        this.index = 33;
        this.libelleButton = "Se connecter";
        //load countrie list
        this.loadListService.loadCountries(this.projectTarget).then(function (data) {
            _this.pays = data.data;
        });
    }
    /**
        * @description Display the list of countries in an alert
    */
    MailPage.prototype.doRadioAlert = function () {
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
                _this.testRadioOpen = false;
                _this.testRadioResult = data;
                _this.index = data;
            }
        });
        this.nav.present(alert).then(function () {
            _this.testRadioOpen = true;
        });
    };
    /**
        * @description function called to authenticate a user
    */
    MailPage.prototype.authenticate = function () {
        var _this = this;
        var indPhone = this.index + this.phone;
        //call the service of autentication
        this.authService.authenticate(this.email, indPhone, this.password1, this.projectTarget)
            .then(function (data) {
            //case of authentication failure : server unavailable or connection probleme 
            if (!data || data.length == 0 || (data.id == 0 && data.status == "failure")) {
                console.log(data);
                _this.globalService.showAlertValidation("Serveur non disponible ou problème de connexion.");
                return;
            }
            //case of authentication failure : incorrect password 
            if (data.id == 0 && data.status == "passwordError") {
                console.log("Password error");
                _this.globalService.showAlertValidation("Votre mot de passe est incorrect");
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
            var token = _this.authService.getObj('deviceToken');
            console.log(token);
            var accountId = data.id;
            console.log(accountId);
            if (token) {
                console.log("insertion du token : " + token);
                _this.authService.insertToken(token, accountId, _this.projectTarget);
            }
            //user is connected, then change the name of connexion btn to deconnection
            _this.authService.setObj('connexion', JSON.stringify(connexion));
            _this.authService.setObj('currentUser', JSON.stringify(data));
            _this.gc.setCnxBtnName("Déconnexion");
            //if user is connected for the first time, redirect him to the page 'civility', else redirect him to the home page
            var isNewUser = data.newAccount;
            if (isNewUser) {
                _this.globalService.showAlertValidation("Bienvenue dans votre espace VitOnJob!");
                _this.nav.push(info_user_1.InfoUserPage, {
                    currentEmployer: data });
            }
            else {
                _this.nav.pop(home_1.HomePage);
            }
        });
    };
    /**
        * @description function called to decide if the auth/inscr button should be disabled
    */
    MailPage.prototype.isAuthDisabled = function () {
        if (this.showPhoneField == true) {
            //inscription
            return (!this.index || !this.phone || !this.password1
                || !this.password2 || !this.email) && !this.password2IsValid();
        }
        else {
            //connection
            return (!this.email || !this.password1);
        }
    };
    /**
        * @description function called on change of the email input to validate it
    */
    MailPage.prototype.watchEmail = function (e, el) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (!re.test(this.email)) {
            var alert_1 = ionic_angular_1.Alert.create({
                title: 'Email incorrect',
                buttons: ['OK']
            });
            this.nav.present(alert_1);
        }
        else {
            this.isRegistration(el);
        }
    };
    /**
        * @description function called when the email input is valid to decide if the form is for inscription or authentication
    */
    MailPage.prototype.isRegistration = function (el) {
        var _this = this;
        //verify if the email exist in the database
        this.dataProviderService.getUserByMail(this.email, this.projectTarget).then(function (data) {
            if (!data || data.data.length == 0) {
                //el.setFocus();
                _this.showPhoneField = true;
                _this.phone = "";
                _this.libelleButton = "S'inscrire";
            }
            else {
                //$scope.email = data.data[0]["email"];
                _this.email = data.data[0]["email"];
                _this.libelleButton = "Se connecter";
                _this.showPhoneField = false;
            }
        });
    };
    /**
        * @description validate the phone format
    */
    MailPage.prototype.isPhoneValid = function () {
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
    MailPage.prototype.validateEmail = function (e) {
        //this.validationDataService.checkEmail(e);
    };
    /**
        * @description check if the password and its confirmation are the same
    */
    MailPage.prototype.password2IsValid = function () {
        return (this.password1 == this.password2);
    };
    /**
        * @description return to the home page
    */
    MailPage.prototype.goBack = function () {
        this.nav.pop(home_1.HomePage);
    };
    MailPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/mail/mail.html',
            providers: [globalConfigs_1.GlobalConfigs, authentication_service_1.AuthenticationService, load_list_service_1.LoadListService, data_provider_service_1.DataProviderService, global_service_1.GlobalService, validation_data_service_1.ValidationDataService]
        })
    ], MailPage);
    return MailPage;
}());
exports.MailPage = MailPage;
//# sourceMappingURL=mail.js.map