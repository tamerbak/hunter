import {NavController, Storage, Modal, NavParams, Toast, Platform, Loading, SqlStorage} from "ionic-angular";
import {EmployersService} from "../../providers/employers-service/employers-service";
import {Component} from "@angular/core";
import {ModalNewEntreprisePage} from "../modal-new-entreprise/modal-new-entreprise";
import {ModalManualContactPage} from "../modal-manual-contact/modal-manual-contact";
import {AppAvailability, InAppBrowser} from "ionic-native";
import {AuthenticationService} from "../../providers/authentication.service";
import {GlobalService} from "../../providers/global.service";
import {GlobalConfigs} from "../../configurations/globalConfigs";

declare function md5();

@Component({
    templateUrl: 'build/pages/entreprise/entreprise.html',
    providers: [EmployersService, AuthenticationService, GlobalService]
})
export class EntreprisePage {
    searchText:string;
    accounts:any = [];
    opportunity:any;
    service:EmployersService;
    storage:any;
    noCompany:boolean = false;
    listShowed:boolean = false;
    accountFound:boolean = true;
    loadingSearch:boolean = false;
    target:string;
    noResultMessage:string;
    isEmpInstalled:boolean = false;
    isJobInstalled:boolean = false;
    user:any;
    authService:any;
    globalService:any;
    platform:any;

    constructor(public nav:NavController,
                service:EmployersService, params:NavParams, _platform:Platform,
                _authService:AuthenticationService, _globalService:GlobalService) {

        let app;
        this.target = params.get('target');
        this.authService = _authService;
        this.globalService = _globalService;
        this.platform = _platform;

        if (this.platform.is('ios')) {
            app = (this.target === 'Employeur') ? 'employeur://' : 'jobyer://';
        } else if (this.platform.is('android')) {
            app = (this.target === 'Employeur') ? 'com.manaona.vitonjob.employeur' : 'com.manaona.vitonjob.jobyer';
        }

        AppAvailability.check(app)
            .then(
                () => {
                    if (this.target === 'Employeur')
                        this.isEmpInstalled = true;
                    else this.isJobInstalled = true;
                },
                () => {
                    if (this.target === 'Employeur')
                        this.isEmpInstalled = false;
                    else this.isJobInstalled = false;
                }
            );

        this.opportunity = {
            account: {
                fullName: '',
                tel: '',
                email: ''
            }
        };


        if (this.target === 'Employeur')
            this.noResultMessage = 'Aucune entreprise ne correspond à la recherche.';
        else
            this.noResultMessage = 'Aucun jobyer ne correspond à la recherche.';
        this.service = service;
        this.storage = new Storage(SqlStorage);

        this.storage.get('currentUser').then((value)=> {
            this.user = JSON.parse(value);
        });

        this.storage.get('OPPORTUNITY').then(opp => {
            let obj = JSON.parse(opp);
            if (obj) {
                console.log(obj);
                this.opportunity = obj;
                /*this.opportunity.account = {
                 fullName: '',
                 tel: '',
                 email: ''
                 };*/
                /*this.service.loadEmployer(obj).then(o => {
                 this.opportunity.account = o;
                 if(!this.opportunity.account || this.opportunity.account.idAccount == 0){
                 this.opportunity.account = {
                 fullName : '',
                 tel:'',
                 email:''
                 };
                 this.noCompany = true;
                 }
                 });*/
            } else {
                this.opportunity.account = {
                    fullName: '',
                    tel: '',
                    email: ''
                };
                this.noCompany = true;
            }

        });
    }

    openMarket() {
        let downloadURL:string = "";
        if (this.platform.is('ios')) {
            downloadURL = (this.target === 'Employeur')? 'https://itunes.apple.com/fr/app/vitonjob-employeur/id1083552836?mt=8' : 'https://itunes.apple.com/fr/app/vitonjob-jobyer/id1125594700?mt=8';
        } else if (this.platform.is('android')) {
            downloadURL = (this.target === 'Employeur')? 'market://details?id=com.manaona.vitonjob.employeur' : 'market://details?id=com.manaona.vitonjob.jobyer';
        }
        let browser = InAppBrowser.open(downloadURL, '_system');
    }

    popScreen() {
        this.nav.pop();
    }

    search() {
        this.loadingSearch = true;
        this.service.seekAccounts(this.searchText).then(accounts=> {
            this.accounts = accounts;
            this.accountFound = this.accounts.length > 0;
            this.listShowed = true;
            this.loadingSearch = false;
        });
    }

    selectAccount(account) {
        this.opportunity.account = account;
        this.storage.set('OPPORTUNITY', JSON.stringify(this.opportunity));
        /*this.service.saveEnterprise(this.opportunity).then(data => {
         this.storage.set('OPPORTUNITY', JSON.stringify(this.opportunity));
         });*/
        this.noCompany = false;
        this.listShowed = false;
        this.presentToast(this.target + ' est bien enregistré');
    }

    createCompany() {
        //todo launch new jobyer modal
        if (this.target === 'Employeur') {
            let modal = new Modal(ModalNewEntreprisePage);
            modal.onDismiss(company => {
                this.searchText = company.fullName;
                if (this.searchText.length > 0)
                    this.search();
            });
            this.nav.present(modal);
        } else {
            let modal = new Modal(ModalManualContactPage);
            modal.onDismiss(company => {
                this.searchText = company.firstName + ' ' + company.lastName;
                if (this.searchText.length > 0)
                    this.search();
            });
            this.nav.present(modal);
        }


    }

    presentToast(message) {
        let toast = Toast.create({
            message: message,
            duration: 3000
        });

        toast.onDismiss(() => {
            console.log('Dismissed toast');
        });

        this.nav.present(toast);
    }

    sendPassword() {
        let loading = Loading.create({
            content: ` 
			<div>
			<img src='img/loading.gif' />
			</div>
			`,
            spinner: 'hide'
        });
        this.nav.present(loading);
        let tel = this.opportunity.tel;
        this.authService.setNewPassword(tel, this.target, this.user.id).then((data) => {
            if (!data) {
                loading.dismiss();
                this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
                return;
            }
            if (data && data.password.length != 0) {
                let newPassword = data.password;
                this.authService.sendPasswordBySMS(tel, newPassword).then((data) => {
                    if (!data || data.status != 200) {
                        loading.dismiss();
                        this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
                        return;
                    }
                    loading.dismiss();
                });
            }
        })
    }
}
