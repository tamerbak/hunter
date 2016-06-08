import {Component} from '@angular/core';
import {NavController, Storage, LocalStorage, ViewController} from 'ionic-angular';
import {EmployersService} from "../../providers/employers-service/employers-service";

@Component({
    templateUrl: 'build/pages/modal-new-entreprise/modal-new-entreprise.html',
    providers:[EmployersService]
})
export class ModalNewEntreprisePage {
    service : EmployersService;
    store : Storage;
    company : any;
    opportunity : any;
    viewCtrl : ViewController;

    constructor(public nav: NavController,
                service : EmployersService,
                viewCtrl: ViewController) {
        this.service = service;
        this.viewCtrl = viewCtrl;
        this.store = new Storage(LocalStorage);
        this.company = {
            fullName : '',
            tel : '',
            email : ''
        };

        this.store.get('OPPORTUNITY').then(opp =>{
            this.opportunity = JSON.parse(opp);
        });

    }

    saveNewCompany(){
        this.service.saveNewAccount(this.company).then(c =>{
            this.company = c;
            this.viewCtrl.dismiss(this.company);
        });
    }
}
