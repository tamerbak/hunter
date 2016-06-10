import {NavController, NavParams, Modal, Alert, SqlStorage} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {ModalNewCandidatePage} from "../modal-new-candidate/modal-new-candidate";
import {SMS} from "ionic-native/dist/index";
import {Component} from "@angular/core";
import {NotationService} from "../../providers/notation-service/notation-service";


@Component({
    templateUrl: 'build/pages/candidates/candidates.html',
    providers:[OpportunitiesService, NotationService]
})
export class CandidatesPage {
    opportunity:any;
    opportunitiesService : OpportunitiesService;
    candidates : any [];
    voidCandidates: boolean = true;
    storage : any;
    sqlStore : any;
    notationService : NotationService;
    account : any;

    constructor(public nav: NavController,
                public navParams : NavParams,
                opportunitiesService : OpportunitiesService,
                notationService : NotationService) {
        this.storage = new Storage(LocalStorage);
        this.sqlStore = new Storage(SqlStorage);
        this.notationService = notationService;
        this.opportunity = navParams.data.opportunity;
        this.opportunitiesService = opportunitiesService;
        this.opportunitiesService.loadOpportunityCandidates(this.opportunity).then((data)=>{
            this.voidCandidates = data.length == 0;
            this.candidates = data;
        });
        this.sqlStore.get('currentUser').then(data =>{
            this.account = JSON.parse(data);
        });
    }

    addNewCandidates(){
        let newCandidatePage = new Modal(ModalNewCandidatePage);
        newCandidatePage.onDismiss((candidate) =>{
            if(candidate && candidate.id>0){
                this.voidCandidates = false;
                this.candidates.push(candidate);
                if(candidate.createdAccount && candidate.createdAccount == true ){
                    this.notationService.notationJobyer(this.account.id);
                    let options = {
                        replaceLineBreaks: true,
                        android: {
                            intent: ''
                        }
                    };
                    let message = "Vous êtes invité à créer un compte sur href://www.vitonjob.com afin d'accéder à l'opportunité '"+this.opportunity.title+"'";
                    console.log(message);
                    SMS.send(candidate.tel, message, options);
                }
                let alert = Alert.create({
                    title: 'Invitation envoyée',
                    subTitle: 'Une invitation a été adressé à votre contact pour considérer cette opportunité',
                    buttons: ['OK']
                });
                this.nav.present(alert);
            }
        });
        this.storage.set('OPP',JSON.stringify(this.opportunity)).then(()=>{
            this.nav.present(newCandidatePage);
        });

    }
}
