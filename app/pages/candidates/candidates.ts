import {Page, NavController, NavParams, Modal, Alert} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {ModalNewCandidatePage} from "../modal-new-candidate/modal-new-candidate";
import {SMS} from "ionic-native/dist/index";


@Page({
    templateUrl: 'build/pages/candidates/candidates.html',
    providers:[OpportunitiesService]
})
export class CandidatesPage {
    opportunity:any;
    opportunitiesService : OpportunitiesService;
    candidates : any [];
    voidCandidates: boolean = true;
    storage : any;

    constructor(public nav: NavController,
                public navParams : NavParams,
                opportunitiesService : OpportunitiesService) {
        this.storage = new Storage(LocalStorage);
        this.opportunity = navParams.data.opportunity;
        this.opportunitiesService = opportunitiesService;
        this.opportunitiesService.loadOpportunityCandidates(this.opportunity).then((data)=>{
            this.voidCandidates = data.length == 0;
            this.candidates = data;
        });
    }

    addNewCandidates(){
        let newCandidatePage = new Modal(ModalNewCandidatePage);
        newCandidatePage.onDismiss((candidate) =>{
            if(candidate && candidate.id>0){
                this.voidCandidates = false;
                this.candidates.push(candidate);
                if(candidate.createdAccount){
                    let options = {
                        replaceLineBreaks: true,
                        android: {
                            intent: ''
                        }
                    };
                    let message = "Vous êtes invité à créer un compte sur href://www.vitonjob.com afin d'accéder à l'offre '"+this.opportunity.title+"'";
                    console.log(message);
                    SMS.send(candidate.tel, message, options);
                }
                let alert = Alert.create({
                    title: 'Invitation envoyée',
                    subTitle: 'Une invitation a été adressé à votre contact pour considérer cette offre',
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
