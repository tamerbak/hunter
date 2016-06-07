import {Page, NavController} from 'ionic-angular';
import {EmployersService} from "../../providers/employers-service/employers-service";


@Page({
    templateUrl: 'build/pages/entreprise/entreprise.html',
    providers: [EmployersService]
})
export class EntreprisePage {
    searchText : string;
    accounts : any = [];
    service : EmployersService;
    constructor(public nav: NavController,
                service:EmployersService) {
        this.service = service;
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

    }
}
