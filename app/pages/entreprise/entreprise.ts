import {NavController, Storage, LocalStorage} from 'ionic-angular';
import {EmployersService} from "../../providers/employers-service/employers-service";
import {Component} from "@angular/core";


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

    constructor(public nav: NavController,
                service:EmployersService) {
        debugger;
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
            debugger;
            this.opportunity = JSON.parse(opp);
            if(!this.opportunity.account){
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
        this.service.seekAccounts(this.searchText).then(accounts=>{
            this.accounts = accounts;
        });
    }

    selectAccount(account){
        this.opportunity.account = account;
        this.service.saveEnterprise(this.opportunity).then(data => {
            this.storage.set('OPPORTUNITY', JSON.stringify(this.opportunity));
        });
    }
}
