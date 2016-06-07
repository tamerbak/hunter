import {Page, NavController, Storage, SqlStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {OpportunityContactPage} from "../opportunity-contact/opportunity-contact";
import {Component} from "@angular/core";
import {GlobalConfigs} from "../../configurations/globalConfigs";
import {Configs} from "../../configurations/configs";


@Component({
    templateUrl: 'build/pages/propositions/propositions.html',
    providers: [OpportunitiesService, GlobalConfigs]
})
export class PropositionsPage {
    invitations : any = [];
    service : OpportunitiesService;
    storage : any;
    constructor(public nav: NavController,
                service : OpportunitiesService, gc:GlobalConfigs) {
        let projectTarget = gc.getProjectTarget();
        // get config of selected target
        let config = Configs.setConfigs(projectTarget);
        this.themeColor = config.themeColor;
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
