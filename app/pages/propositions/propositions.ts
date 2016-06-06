import {Page, NavController, Storage, SqlStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {OpportunityContactPage} from "../opportunity-contact/opportunity-contact";


@Page({
    templateUrl: 'build/pages/propositions/propositions.html',
    providers: [OpportunitiesService]
})
export class PropositionsPage {
    invitations : any = [];
    service : OpportunitiesService;
    storage : any;
    constructor(public nav: NavController,
                service : OpportunitiesService) {
        this.service = service;
        this.storage = new Storage(SqlStorage);
        this.storage.get('currentUser').then((value)=>{
            let user = JSON.parse(value);
            let idAccount = user.id;
            this.service.loadInvitationsByAccountId(idAccount).then(data => {
                this.invitations = data;
            });
        });
    }

    expandOpportunity(invitation){
        invitation.seen = true;
        this.service.seeInvitation(invitation).then(invitation => {
            this.nav.push(OpportunityContactPage, {opp : invitation.opportunity});
        });
    }
}
