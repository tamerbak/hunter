import {Component} from '@angular/core';
import {NavController, Storage, LocalStorage, SqlStorage, ViewController} from 'ionic-angular';
import {EmployersService} from "../../providers/employers-service/employers-service";
import {NotationService} from "../../providers/notation-service/notation-service";
import {SMS} from "ionic-native/dist/index";

@Component({
    templateUrl: 'build/pages/modal-new-entreprise/modal-new-entreprise.html',
    providers:[EmployersService, NotationService]
})
export class ModalNewEntreprisePage {
    service : EmployersService;
    store : Storage;
    sqlStore : Storage;
    company : any;
    opportunity : any;
    viewCtrl : ViewController;
    notationService : NotationService;
    currentUser : any;

    constructor(public nav: NavController,
                service : EmployersService,
                notationService : NotationService,
                viewCtrl: ViewController) {
        this.service = service;
        this.notationService = notationService;
        this.viewCtrl = viewCtrl;
        this.store = new Storage(LocalStorage);
        this.sqlStore = new Storage(SqlStorage);
        this.company = {
            fullName : '',
            tel : '',
            email : '',
            siret : ''
        };

        this.store.get('OPPORTUNITY').then(opp =>{
            this.opportunity = JSON.parse(opp);
        });

        this.sqlStore.get('currentUser').then(data =>{
            debugger;
           this.currentUser = JSON.parse(data);
        });

    }

    saveNewCompany(){
        this.service.saveNewAccount(this.company).then(c =>{
            this.notationService.notationEntreprise(this.currentUser.id);
            this.company = c;
            let options = {
                replaceLineBreaks: true,
                android: {
                    intent: ''
                }
            };
            let message = " Pour recruter plus rapidement la personne dont vous avez besoin, je vous invite à créer votre compte sur www.vitonjob.com. Vous pouvez utiliser votre numéro de téléphone : "+this.company.tel+" et votre mot de passe temporaire : Hgtze";
            console.log(message);
            SMS.send(this.company.tel, message, options);
            this.viewCtrl.dismiss(this.company);
        });
    }

    cancelNewCompany(){
        this.company.fullName='';
        this.viewCtrl.dismiss(this.company);
    }
}
