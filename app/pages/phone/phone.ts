import {Alert, NavController, Events, Loading, Storage, SqlStorage, Toast} from "ionic-angular";
import {Configs} from "../../configurations/configs";
import {GlobalConfigs} from "../../configurations/globalConfigs";
import {AuthenticationService} from "../../providers/authentication.service";
import {LoadListService} from "../../providers/load-list.service";
import {DataProviderService} from "../../providers/data-provider.service";
import {GlobalService} from "../../providers/global.service";
import {ValidationDataService} from "../../providers/validation-data.service";
import {HomePage} from "../home/home";
import {CivilityPage} from "../civility/civility";
import {Component} from "@angular/core";

declare function md5(arg:string);

/**
 * @author Amal ROCHD
 * @description authentication by phone view
 * @module Authentication
 */
@Component({
    templateUrl: 'build/pages/phone/phone.html',
    providers: [AuthenticationService, LoadListService, DataProviderService, GlobalService, ValidationDataService]
})

export class PhonePage {
    projectTarget:string;
    isEmployer:boolean;
    phoneTitle:string;
    themeColor:string;
    public phone;
    public index;
    public pays = [];
    showEmailField:boolean;
    email:string;
    libelleButton:string;
    password1:string;
    password2:string;
    storage:any;
    isPhoneNumValid = true;
    authService:any;
    globalService:any;

    /**
     * @description While constructing the view, we load the list of countries to display their codes
     */
    constructor(public nav:NavController,
                public gc:GlobalConfigs, private _authService:AuthenticationService, private loadListService:LoadListService, private dataProviderService:DataProviderService, private _globalService:GlobalService, private validationDataService:ValidationDataService, public events:Events) {
        // Set global configs
        // Get target to determine configs
        this.projectTarget = gc.getProjectTarget();
        this.storage = new Storage(SqlStorage);
        this.authService = _authService;
        this.globalService = _globalService;

        // get config of selected target
        let config = Configs.setConfigs(this.projectTarget);

        // Set local variables and messages
        this.themeColor = config.themeColor;
        this.isEmployer = (this.projectTarget == 'employer');
        this.phoneTitle = "Téléphone";
        this.index = 33;
        this.libelleButton = "Se connecter";

        //load countries list
        this.loadListService.loadCountries().then((data:{data:any}) => {
            this.pays = data.data;
        });
    }

    /**
     * @description Display the list of countries in an alert
     */
    doRadioAlert() {
        let alert = Alert.create();
        alert.setTitle('Choisissez votre pays');
        for (let p of this.pays) {
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
            handler: data => {
                console.log('Radio data:', data);
                this.index = data;
            }
        });

        this.nav.present(alert).then(() => {
        });
    }

    /**
     * @description function called to authenticate a user
     */
    authenticate() {
        var indPhone = this.index + this.phone;
        let loading = Loading.create({
            content: ` 
			<div>
			<img src='img/loading.gif' />
			</div>
			`,
            spinner: 'hide'
        });
        this.nav.present(loading);

        //call the service of autentication
        this.authService.authenticate(this.email, indPhone, this.password1, this.projectTarget)
            .then((data:{length:number, status:string,id:number, jobyerId:number, employerId:number,newAccount:boolean}) => {
                console.log(data);
                //case of authentication failure : server unavailable or connection probleme
                if (!data || data.length == 0 || (data.id == 0 && data.status == "failure")) {
                    console.log(data);
                    loading.dismiss();
                    this.globalService.showAlertValidation("VitOnJob", "Serveur non disponible ou problème de connexion.");
                    return;
                }
                //case of authentication failure : incorrect password
                if (data.id == 0 && data.status == "passwordError") {
                    console.log("Password error");
                    loading.dismiss();
                    if (!this.showEmailField) {
                        this.globalService.showAlertValidation("VitOnJob", "Votre mot de passe est incorrect.");
                    } else {
                        console.log("used email error");
                        this.globalService.showAlertValidation("VitOnJob", "Cette adresse email a été déjà utilisé. Veuillez choisir une autre.");
                    }
                    return;
                }

                //case of authentication success
                this.authService.setObj('connexion', null);
                this.authService.setObj('currentUser', null);
                var connexion = {
                    'etat': true,
                    'libelle': 'Se déconnecter',
                    'employeID': (this.projectTarget == 'jobyer' ? data.jobyerId : data.employerId)
                };

                //load device token to current account
                var token;
                this.authService.getObj('deviceToken').then(val => {
                    token = val;
                });
                var accountId = data.id;
                if (token) {
                    console.log("insertion du token : " + token);
                    this.authService.insertToken(token, accountId, this.projectTarget);
                }

                this.storage.set('connexion', JSON.stringify(connexion));
                this.storage.set('currentUser', JSON.stringify(data)).then(()=> {
                    this.events.publish('user:login', data);

                    //user is connected, then change the name of connexion btn to deconnection
                    this.gc.setCnxBtnName("Déconnexion");
                    loading.dismiss();

                    //if user is connected for the first time, redirect him to the page 'civility', else redirect him to the home page
                    var isNewUser = data.newAccount;
                    if (isNewUser) {
                        this.globalService.showAlertValidation("VitOnJob", "Bienvenue dans votre espace VitOnJob!");
                        this.nav.push(CivilityPage, {
                            currentUser: data
                        });
                    } else {
                        this.nav.rootNav.setRoot(HomePage);
                    }
                });

            });
    }

    /**
     * @description function called to decide if the auth/inscr button should be disabled
     */
    isAuthDisabled() {
        if (this.showEmailField == true) {
            //inscription
            return (!this.index || !this.phone || !this.isPhoneNumValid || !this.password1 || this.showPassword1Error() || !this.password2 || this.showPassword2Error() || !this.email || this.showEmailError())
        } else {
            //connection
            return (!this.index || !this.phone || !this.isPhoneNumValid || !this.password1 || this.showPassword1Error())
        }
    }

    /**
     * @description function called on change of the phone input to validate it
     */
    checkForString(e) {
        if (e.keyCode < 48 || e.keyCode > 57) {
            e.preventDefault();
            return;
        }
    }

    /**
     * @description validate phone data field and call the function that search for it in the server
     */
    watchPhone(e, el) {
        if (this.phone) {
            this.isPhoneNumValid = false;
            if (e.target.value.substring(0, 1) == '0') {
                e.target.value = e.target.value.substring(1, e.target.value.length);
            }
            if (e.target.value.includes('.')) {
                e.target.value = e.target.value.replace('.', '');
            }
            if (e.target.value.length > 9) {
                e.target.value = e.target.value.substring(0, 9);
            }
            if (e.target.value.length == 9) {
                this.isRegistration(e.target.value);
                this.isPhoneNumValid = true;
            }
        }
    }

    /**
     * @description show error msg if phone is not valid
     */
    showPhoneError() {
        return !this.isPhoneNumValid;
    }

    /**
     * @description function called when the phone input is valid to decide if the form is for inscription or authentication
     */
    isRegistration(phone) {
        if (this.isPhoneValid(phone)) {
            //On teste si le tél existe dans la base
            var tel = "+" + this.index + phone;
            this.dataProviderService.getUserByPhone(tel, this.projectTarget).then((data:{status:string,data:{length:number}}) => {
                if (!data || data.status == "failure") {
                    console.log(data);
                    this.globalService.showAlertValidation("VitOnJob", "Serveur non disponible ou problème de connexion.");
                    return;
                }
                if (!data || data.data.length == 0) {
                    this.showEmailField = true;
                    this.email = "";
                    this.libelleButton = "S'inscrire";
                } else {
                    this.email = data.data[0]["email"];
                    this.libelleButton = "Se connecter";
                    this.showEmailField = false;
                }
            });
        } else {
            //ça sera toujours une connexion
            this.showEmailField = true;
            this.libelleButton = "S'inscrire";
            this.email = "";
        }
    }

    /**
     * @description validate the phone format
     */
    isPhoneValid(tel) {
        if (this.phone) {
            var phone_REGEXP = /^0/;
            //check if the phone number start with a zero
            var isMatchRegex = phone_REGEXP.test(tel);
            if (Number(tel.length) == 9 && !isMatchRegex) {
                console.log('phone number is valid');
                return true;
            }
            else
                return false;
        } else
            return false;
    }

    /**
     * @description validate the email format
     */
    showEmailError() {
        if (this.email)
            return !(this.validationDataService.checkEmail(this.email));
        else
            return false
    }

    /**
     * @description show error msg if password is not valid
     */
    showPassword1Error() {
        if (this.password1)
            return this.password1.length < 6;
    }

    /**
     * @description check if the password and its confirmation are the same
     */
    showPassword2Error() {
        if (this.password2)
            return this.password2 != this.password1;
    }


    /**
     * @description return to the home page
     */
    goBack() {
        this.nav.rootNav.setRoot(HomePage)
    }

    displayPasswordAlert() {
        if (!this.phone || !this.isPhoneValid(this.phone)) {
            this.globalService.showAlertValidation("Vit-On-Job", "Veuillez saisir un numéro de téléphone valide.");
            return;
        }
        if (this.phone && this.isPhoneValid(this.phone) && this.showEmailField) {
            this.globalService.showAlertValidation("Vit-On-Job", "Le numéro que vous avez saisi ne correspond à aucun compte enregistré. Veuillez créer un compte.");
            return;
        }

        let confirm = Alert.create({
            title: "Vit-On-Job",
            message: "Votre mot de passe est sur le point d'être réinitialisé. Voulez-vous le recevoir par SMS ou par email?",
            buttons: [
                {
                    text: 'SMS',
                    handler: () => {
                        console.log('SMS selected');
                        this.passwordForgotten("sms", "");
                        let toast = Toast.create({
                            message: "Votre mot de passe a été réinitialisé. Vous recevrez un SMS avec un nouveau mot de passe d'ici peu.",
                            duration: 5000
                        });
                        this.nav.present(toast);
                    }
                },
                {
                    text: 'Email',
                    handler: () => {
                        console.log('Email selected');
                        this.passwordForgotten("email", this.email);
                        let toast = Toast.create({
                            message: "Votre mot de passe a été réinitialisé. Vous recevrez un courrier électronique avec un nouveau mot de passe d'ici peu.",
                            duration: 5000
                        });
                        this.nav.present(toast);
                    }
                }
            ]
        });
        this.nav.present(confirm);

    }


    passwordForgotten(canal, email) {
        let loading = Loading.create({
            content: ` 
			<div>
			<img src='img/loading.gif' />
			</div>
			`,
            spinner: 'hide'
        });
        this.nav.present(loading);
        var tel = "+" + this.index + this.phone;
        this.authService.setNewPassword(tel).then((data) => {
            if (!data) {
                loading.dismiss();
                this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
                return;
            }
            if (data && data.password.length != 0) {
                let newPasswd = data.password;
                if (canal == 'sms') {
                    debugger;
                    this.authService.updatePasswordByPhone(tel, md5(newPasswd),"Oui").then((data) => {
                        if (!data) {
                            loading.dismiss();
                            this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
                            return;
                        }
                        this.authService.sendPasswordBySMS(tel, newPasswd).then((data) => {
                            if (!data || data.status != 200) {
                                loading.dismiss();
                                this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
                                return;
                            }
                            loading.dismiss();
                            //this.globalService.showAlertValidation("Vit-On-Job", "Votre mot de passe a été réinitialisé. Vous allez le recevoir par SMS.");
                        });
                    });
                }
                else {
                    this.authService.updatePasswordByMail(email, md5(newPasswd),"Oui").then((data) => {
                        if (!data) {
                            loading.dismiss();
                            this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
                            return;
                        }
                        this.authService.sendPasswordByEmail(email, newPasswd).then((data) => {
                            if (!data || data.status != 200) {
                                loading.dismiss();
                                this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
                                return;
                            }
                            loading.dismiss();
                            //this.globalService.showAlertValidation("Vit-On-Job", "Votre mot de passe a été réinitialisé. Vous allez le recevoir par email.");
                        });
                    });
                }
            }
        })
    }
}
