import {Page, NavController, NavParams, LocalStorage, Storage, Modal, SqlStorage, Alert} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {ModalNewCandidatePage} from "../modal-new-candidate/modal-new-candidate";
import {SMS} from "ionic-native/dist/index";
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
            this.opportunitiesService.loadOpportunityCandidates(this.opportunity).then((data)=>{
                this.voidCandidates = data.length == 0;
                this.candidates = data;
            });
        });
        this.sqlStore.get('currentUser').then(data =>{
            this.account = JSON.parse(data);
        });
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
                    let message = "Vous êtes invité à créer un compte sur www.vitonjob.com afin d'accéder à l'offre '"+this.opportunity.title+"'. Vous pouvez utiliser votre numéro de téléphone : "+candidate.tel+" et votre mot de passe temporaire : "+candidate.password;
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
                    let message = "Vous êtes invité à créer un compte sur www.vitonjob.com afin d'accéder à l'offre '"+this.opportunity.title+"'. Vous pouvez utiliser votre numéro de téléphone : "+candidate.tel+" et votre mot de passe temporaire : "+candidate.password;
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
}
