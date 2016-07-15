import {Page, NavController, NavParams, LocalStorage, Storage, Modal, SqlStorage, Alert, Toast} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {ModalNewCandidatePage} from "../modal-new-candidate/modal-new-candidate";
import {SMS, Contacts} from "ionic-native/dist/index";
import {Component} from "@angular/core";
import {NotationService} from "../../providers/notation-service/notation-service";
import {ModalManualContactPage} from "../modal-manual-contact/modal-manual-contact";

@Component({
    templateUrl: 'build/pages/contacts/contacts.html',
    providers:[OpportunitiesService, NotationService]
})
export class ContactsPage {
    opportunity:any;
    opportunitiesService : OpportunitiesService;
    candidates : any [];
    voidCandidates: boolean = true;
    storage : any;
    sqlStore : any;
    account : any;
    notationService : NotationService;
    contact : any;
    contactInfo : any;

    constructor(public nav: NavController,
                public navParams : NavParams,
                notationService : NotationService,
                opportunitiesService : OpportunitiesService) {
        this.storage = new Storage(LocalStorage);
        this.sqlStore = new Storage(SqlStorage);
        this.notationService = notationService;
        this.opportunitiesService = opportunitiesService;
        this.storage.get('OPPORTUNITY').then(opp => {
            this.opportunity = JSON.parse(opp);
            this.opportunitiesService.loadOpportunityCandidates(this.opportunity).then((data: {length:number})=>{
                this.voidCandidates = data.length == 0;
                this.candidates = <any> data;
            });
        });
        this.sqlStore.get('currentUser').then(data =>{
            this.account = JSON.parse(data);
        });

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

    addNewCandidates(){
        let newCandidatePage = new Modal(ModalNewCandidatePage);
        newCandidatePage.onDismiss((candidate) =>{
            if(candidate && candidate.id>0){
                this.notationService.notationJobyer(this.account.id);
                this.voidCandidates = false;
                this.candidates.push(candidate);
                if(candidate.createdAccount){
                    let options = {
                        replaceLineBreaks: true,
                        android: {
                            intent: ''
                        }
                    };
                    let message = "Vous êtes invité à créer un compte sur www.vitonjob.com afin d'accéder à l'opportunité '"+this.opportunity.title+"'. Vous pouvez utiliser votre numéro de téléphone : "+candidate.tel+" et votre mot de passe temporaire : "+candidate.password;
                    console.log(message);
                    SMS.send(candidate.tel, message, options);
                }
                let alert = Alert.create({
                    title: 'Invitation envoyée',
                    subTitle: 'Une invitation a été adressé à votre contact',
                    buttons: ['OK']
                });
                this.nav.present(alert);
            }
        });
        this.storage.set('OPP',JSON.stringify(this.opportunity)).then(()=>{
            this.nav.present(newCandidatePage);
        });

    }

    addManualCandidate(){
        let newCandidatePage = new Modal(ModalManualContactPage);
        newCandidatePage.onDismiss((candidate) =>{
            if(candidate && candidate.id>0){
                this.notationService.notationJobyer(this.account.id);
                this.voidCandidates = false;
                this.candidates.push(candidate);
                if(candidate.createdAccount){
                    let options = {
                        replaceLineBreaks: true,
                        android: {
                            intent: ''
                        }
                    };
                    let message = "Vous êtes invité à créer un compte sur www.vitonjob.com afin d'accéder à l'opportunité '"+this.opportunity.title+"'. Vous pouvez utiliser votre numéro de téléphone : "+candidate.tel+" et votre mot de passe temporaire : "+candidate.password;
                    console.log(message);
                    SMS.send(candidate.tel, message, options);
                }
                let alert = Alert.create({
                    title: 'Invitation envoyée',
                    subTitle: 'Une invitation a été adressé à votre contact',
                    buttons: ['OK']
                });
                this.nav.present(alert);
            }
        });
        this.storage.set('OPP',JSON.stringify(this.opportunity)).then(()=>{
            this.nav.present(newCandidatePage);
        });
    }

    popScreen(){
        this.nav.pop();
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

        this.presentToast('Une invitation a été adressée à votre contact');
        this.opportunitiesService.addCandidate(c,this.opportunity).then((contact) =>{
            this.contact = contact;
            if(this.contact && this.contact.id>0){
                this.notationService.notationJobyer(this.account.id);
                this.voidCandidates = false;
                this.candidates.push(this.contact);
                if(this.contact.createdAccount){
                    let options = {
                        replaceLineBreaks: true,
                        android: {
                            intent: ''
                        }
                    };
                    let message = "Vous êtes invité à créer un compte sur www.vitonjob.com afin d'accéder à l'opportunité '"+this.opportunity.title+"'. Vous pouvez utiliser votre numéro de téléphone : "+this.contact.tel+" et votre mot de passe temporaire : "+this.contact.password;
                    console.log(message);
                    SMS.send(this.contact.tel, message, options);
                }
                /*let alert = Alert.create({
                    title: 'Invitation envoyée',
                    subTitle: 'Une invitation a été adressé à votre contact',
                    buttons: ['OK']
                });
                this.nav.present(alert);*/
            }
        });
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
