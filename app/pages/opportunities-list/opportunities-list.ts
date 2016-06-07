import {Page, NavController} from 'ionic-angular';
import {Storage, SqlStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {OpportunityDetailsPage} from "../opportunity-details/opportunity-details";
import {Component} from "@angular/core";

@Component({
    templateUrl: 'build/pages/opportunities-list/opportunities-list.html',
    providers : [OpportunitiesService]
})
export class OpportunitiesListPage {

    opportunities : any=[];
    opportunityService:any;
    storage:any;

    constructor(public nav: NavController,
                opportunityService : OpportunitiesService) {
        this.opportunityService = opportunityService;
        this.storage = new Storage(SqlStorage);
        this.storage.get('currentUser').then((value)=>{
            let user = JSON.parse(value);
            let idAccount = user.id;
            this.opportunityService.loadOpportunitiesByAccountId(idAccount).then(ops => {
                this.opportunities = ops;
            });
        });

    }

    expandOpportunity(opportunity){
        this.nav.push(OpportunityDetailsPage,{opportunity : opportunity});
    }
}
