import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {NewOpportunityPage} from "../new-opportunity/new-opportunity";
import {OpportunityFillPage} from "../opportunity-fill/opportunity-fill";
import {JobyerNewPage} from "../jobyer-new/jobyer-new";
import {ContactsPage} from "../contacts/contacts";
import {EntreprisePage} from "../entreprise/entreprise";

/*
 Generated class for the ModalChoicePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/modal-choice/modal-choice.html',
})
export class ModalChoicePage {
    pictureMessage:string;
    offerMessage:{header:string, body:string};
    personMessage:{header:string, body:string};
    inviteMessage:{header:string, body:string};
    isEmployerChoice:boolean;
    pushPicturePage: any;
    pushOfferPage: any;
    pushInvitePage : any;
    pushPersonPage : any;
    paramsOfferPage: any;

    constructor(public nav:NavController, public viewCtrl:ViewController, public params:NavParams) {

        this.isEmployerChoice = params.get('isEmployerChoice');
        switch (this.isEmployerChoice) {
            case true :
                this.pictureMessage = "Je prends en photo une opportunité";
                this.personMessage = {
                    header: "J'enregistre l'employeur",
                    body:"Emetteur de l'opportunité"
                };
                this.offerMessage = {
                    header: "Je saisis l'opportunité",
                    body:"Job et horaire"
                };
                this.inviteMessage = {
                    header: "J'invite un jobyer",
                    body:"Qui correspond à l'opportunité"
                };
                this.pushOfferPage = OpportunityFillPage;
                this.paramsOfferPage = {target: 'Employeur'};
                break;
            case false :
                this.pictureMessage = "Je prends en photo une opportunité";
                this.personMessage = {
                    header: "J'enregistre le jobyer",
                    body:"Emetteur de l'opportunité"
                };
                this.offerMessage = {
                    header: "Je saisis la compétence",
                    body:"Job et disponibilité"
                };
                this.inviteMessage = {
                    header: "J'invite un employeur",
                    body:"Qui correspond à l'opportunité"
                };
                this.pushOfferPage = JobyerNewPage;
                this.paramsOfferPage = {target: 'Jobyer'};
                break;
        }

        this.pushInvitePage = ContactsPage;
        this.pushPersonPage = EntreprisePage;
        this.pushPicturePage = NewOpportunityPage;


    }

    closeModal() {
        this.viewCtrl.dismiss();
    }
}
