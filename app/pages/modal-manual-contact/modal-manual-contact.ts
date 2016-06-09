import {Component} from '@angular/core';
import {NavController, ViewController, Storage, LocalStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";


@Component({
    templateUrl: 'build/pages/modal-manual-contact/modal-manual-contact.html',
    providers : [OpportunitiesService]
})
export class ModalManualContactPage {
    viewCtrl : ViewController;
    contact : any;
    storage : any;
    opportunity : any;
    service : OpportunitiesService;

    constructor(public nav: NavController,
                viewCtrl : ViewController,
                service : OpportunitiesService) {
        this.service = service;
        this.storage = new Storage(LocalStorage);
        this.storage.get('OPP').then((result)=>{
            this.opportunity = JSON.parse((result));
        });
        this.viewCtrl = viewCtrl;
        this.contact = {
            id : 0,
            tel : '',
            email : '',
            deviceToken : '',
            concluded : false,
            seen : false,
            seenDate: '',
            firstName : '',
            lastName : '',
            title : ''
        };
    }

    saveNewContact(){
        this.service.addManuelCandidate(this.contact,this.opportunity).then((contact) =>{
            this.contact = contact;
            this.viewCtrl.dismiss(this.contact);
        });
    }

    cancelNewContact(){
        this.contact.id = 0;
        this.viewCtrl.dismiss(this.contact);
    }
}
