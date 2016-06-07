import {Page, NavController, ViewController, NavParams} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {Contacts} from "ionic-native/dist/index";
import {Component} from "@angular/core";


@Component({
    templateUrl: 'build/pages/modal-new-candidate/modal-new-candidate.html',
    providers:[OpportunitiesService]
})
export class ModalNewCandidatePage {
    opportunity : any;
    service : OpportunitiesService;
    viewCtrl : ViewController;
    contact : any;
    storage : any;
    contactInfo : any;
    candidates : any = [];

    constructor(public nav: NavController,
                public navParams : NavParams,
                service : OpportunitiesService,
                viewCtrl: ViewController) {
        this.storage = new Storage(LocalStorage);
        this.storage.get('OPP').then((result)=>{
            this.opportunity = JSON.parse((result));
        });

        this.service = service;
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

    seekContact(evt){
        this.contactInfo = evt.target.value;
        this.candidates = [];
        Contacts.find(['*'], {filter: this.contactInfo}).then((contacts) => {
            console.log(contacts);
            for(let i = 0 ; i < contacts.length ; i++){
                let c = {
                    displayName:contacts[i].displayName,
                    tel : ''
                };
                if(contacts[i].phoneNumbers && contacts[i].phoneNumbers.length>0){
                    c.tel = contacts[i].phoneNumbers[0].value;
                }
                this.candidates.push(c);
            }

        });
    }

    selectContact(c){
        this.service.addCandidate(c,this.opportunity).then((contact) =>{
            this.contact = contact;
            this.viewCtrl.dismiss(this.contact);
        });
    }

    cancelAdding(){
        this.contact.id = 0;
        this.viewCtrl.dismiss(this.contact);
    }

}
