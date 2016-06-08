import {Page, NavController} from 'ionic-angular';
import {Storage, SqlStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {OpportunityDetailsPage} from "../opportunity-details/opportunity-details";
import {Component} from "@angular/core";
import {GlobalConfigs} from "../../configurations/globalConfigs";
import {Configs} from "../../configurations/configs";

@Component({
    templateUrl: 'build/pages/opportunities-list/opportunities-list.html',
    providers: [OpportunitiesService, GlobalConfigs]
})
export class OpportunitiesListPage {

    opportunities:any = [];
    opportunityService:any;
    storage:any;

    constructor(public nav:NavController,
                opportunityService:OpportunitiesService, gc:GlobalConfigs) {
        debugger;
        let projectTarget = gc.getProjectTarget();
        // get config of selected target
        let config = Configs.setConfigs(projectTarget);
        this.themeColor = config.themeColor;
        this.opportunityService = opportunityService;
        this.storage = new Storage(SqlStorage);
        this.storage.get('currentUser').then((value)=> {
            let user = JSON.parse(value);
            let idAccount = user.id;
            this.opportunityService.loadOpportunitiesByAccountId(idAccount).then(ops => {
                this.opportunities = ops;
            });
        });
    }

    expandOpportunity(opportunity) {
        this.nav.push(OpportunityDetailsPage, {opportunity: opportunity});
    }
}
