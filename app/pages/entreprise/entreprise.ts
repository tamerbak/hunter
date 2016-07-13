import {NavController, Storage, LocalStorage, Modal} from 'ionic-angular';
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

    constructor(public nav: NavController,
                service:EmployersService) {
        //debugger;
        this.opportunity = {
            account : {
                fullName: '',
                tel: '',
                email: ''
            }
        };
        this.service = service;
        this.storage = new Storage(LocalStorage);
        this.storage.get('OPPORTUNITY').then(opp => {
            let obj = JSON.parse(opp);
            //debugger;
            if (obj) {
                this.opportunity = obj;
                /*this.opportunity.account = {
                 fullName: '',
                 tel: '',
                 email: ''
                 };*/
                this.service.loadEmployer(obj).then(o => {
                    this.opportunity.account = o;
                    if(!this.opportunity.account || this.opportunity.account.idAccount == 0){
                        this.opportunity.account = {
                            fullName : '',
                            tel:'',
                            email:''
                        };
                        this.noCompany = true;
                    }
                });
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
        this.service.saveEnterprise(this.opportunity).then(data => {
            //debugger;
            this.storage.set('OPPORTUNITY', JSON.stringify(this.opportunity));
        });
		this.noCompany = false;
        this.listShowed = false;
    }

    createCompany(){
        let modal = new Modal(ModalNewEntreprisePage);
        modal.onDismiss(company => {
            this.searchText = company.fullName;
            if(this.searchText.length>0)
                this.search();
        });
        this.nav.present(modal);

    }
}
