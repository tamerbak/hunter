import {NavController, Storage, LocalStorage, Modal, NavParams, Toast} from 'ionic-angular';
import {EmployersService} from "../../providers/employers-service/employers-service";
import {Component} from "@angular/core";
import {ModalNewEntreprisePage} from "../modal-new-entreprise/modal-new-entreprise";


@Component({
    templateUrl: 'build/pages/entreprise/entreprise.html',
    providers: [EmployersService]
})
export class EntreprisePage {
    searchText : string;
    accounts : any = [];
    opportunity : any;
    service : EmployersService;
    storage : any;
    noCompany : boolean = false;
    listShowed: boolean = false;
    accountFound: boolean = true;
    loadingSearch: boolean = false;
    target:string;
    noResultMessage: string;

    constructor(public nav: NavController,
                service:EmployersService, params: NavParams) {
        //debugger;
        this.opportunity = {
            account : {
                fullName: '',
                tel: '',
                email: ''
            }
        };
        this.target = params.get('target');
        if (this.target === 'Employeur')
            this.noResultMessage = 'Aucune entreprise ne correspond à la recherche.';
        else
            this.noResultMessage = 'Aucun jobyer ne correspond à la recherche.';
        this.service = service;
        this.storage = new Storage(LocalStorage);
        this.storage.get('OPPORTUNITY').then(opp => {
            let obj = JSON.parse(opp);
            //debugger;
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
                    fullName : '',
                    tel:'',
                    email:''
                };
                this.noCompany = true;
            }

        });
    }

    popScreen(){
        this.nav.pop();
    }

    search(){
        this.loadingSearch = true;
        this.service.seekAccounts(this.searchText).then(accounts=>{
            this.accounts = accounts;
                this.accountFound = this.accounts.length > 0;
            this.listShowed = true;
            this.loadingSearch = false;
        });
    }

    selectAccount(account){
        this.opportunity.account = account;
        this.storage.set('OPPORTUNITY', JSON.stringify(this.opportunity));
        /*this.service.saveEnterprise(this.opportunity).then(data => {
            //debugger;
            this.storage.set('OPPORTUNITY', JSON.stringify(this.opportunity));
        });*/
		this.noCompany = false;
        this.listShowed = false;
        this.presentToast(this.target + ' est bien enregistré');
    }

    createCompany(){
        //todo launch new jobyer modal
        let modal = new Modal(ModalNewEntreprisePage);
        modal.onDismiss(company => {
            this.searchText = company.fullName;
            if(this.searchText.length>0)
                this.search();
        });
        this.nav.present(modal);

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
}
