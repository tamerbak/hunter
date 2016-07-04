import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {NewOpportunityPage} from "../new-opportunity/new-opportunity";
import {OpportunityFillPage} from "../opportunity-fill/opportunity-fill";

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
    inviteMessage:string;
    isEmployerChoice:boolean;
    pushPicturePage: any;
    pushOfferPage: any;
    pushInvitePage : any;

    constructor(public nav:NavController, public viewCtrl:ViewController, public params:NavParams) {

        this.isEmployerChoice = params.get('isEmployerChoice');
        switch (this.isEmployerChoice) {
            case true :
                this.pictureMessage = "Je prends une photo";
                this.offerMessage = {
                    header: "Je saisis l'opportunité",
                    body:"Fiches entreprise, employeur et job"
                };
                this.inviteMessage = "J'invite un employeur";
                break;
            case false :
                this.pictureMessage = "Je prends une photo";
                this.offerMessage = {
                    header: "Je saisis la fiche Jobyer",
                    body:""
                };
                this.inviteMessage = "J'invite un jobyer";
                break;
        }

        this.pushPicturePage = NewOpportunityPage;
        this.pushOfferPage = OpportunityFillPage;

    }

    closeModal() {
        this.viewCtrl.dismiss();
    }
}
