import {Page, NavController} from 'ionic-angular';
import {EmployersService} from "../../providers/employers-service/employers-service";


@Page({
    templateUrl: 'build/pages/entreprise/entreprise.html',
    providers: [EmployersService]
})
export class EntreprisePage {
    searchText : string;
    accounts : any = [];
    opportunity : any;
    service : EmployersService;
    storage : any;

    constructor(public nav: NavController,
                service:EmployersService) {
        this.service = service;
        this.storage.get('OPPORTUNITY').then(opp => {
            this.opportunity = JSON.parse(opp);
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
