import {Page, NavController, NavParams} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {CandidatesPage} from "../candidates/candidates";
import {isUndefined} from "ionic-angular/util";

@Page({
    templateUrl: 'build/pages/opportunity-details/opportunity-details.html',
    providers: [OpportunitiesService]
})
export class OpportunityDetailsPage {
    opportunity : any;
    service : OpportunitiesService;
    map: any;
    save : boolean = true;
    contact : boolean = false;
    

    constructor(public nav: NavController,
                public navParams: NavParams,
                service : OpportunitiesService) {
        this.service = service;
        this.opportunity = navParams.data.opportunity;
    }

    onPageLoaded() {
        console.log('page loaded');
        this.loadMap();
    }

    loadMap() {
        debugger;
        let latLng = new google.maps.LatLng(this.opportunity.lat, this.opportunity.lng);

        let mapOptions = {
            center: latLng,
            zoom:15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        let address = new google.maps.LatLng(this.opportunity.lat, this.opportunity.lng);
        let addresses = [address];
        let bounds = new google.maps.LatLngBounds();
        this.addMarkers(addresses, bounds);

    }

    saveOpportunityChanges(){

        if(!this.opportunity.activeOpportunity && (this.opportunity.closureDate == '' || isUndefined(this.opportunity.closureDate))){
            let date = new Date();
            this.opportunity.closureDate = (date.getDate()+1)+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        }

        this.service.updateOpportunity(this.opportunity);

    }

    getOpportunityContacts(){
        this.nav.push(CandidatesPage,{opportunity : this.opportunity});
    }
}
