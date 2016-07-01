import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {NewOpportunityPage} from "../new-opportunity/new-opportunity";

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
                this.pictureMessage = "J'ai une photo";
                this.offerMessage = {
                    header: "Saisir l'offre",
                    body:"Fiches entreprise et employeur"
                };
                this.inviteMessage = "Inviter un employeur";
                break;
            case false :
                this.pictureMessage = "J'ai une photo";
                this.offerMessage = {
                    header: "Saisir la fiche Jobyer",
                    body:""
                };
                this.inviteMessage = "Inviter un jobyer";
                break;
        }

        this.pushPicturePage = NewOpportunityPage;

    }

    closeModal() {
        this.viewCtrl.dismiss();
    }
}
