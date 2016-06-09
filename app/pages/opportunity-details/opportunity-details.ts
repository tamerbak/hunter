import {NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {CandidatesPage} from "../candidates/candidates";
import {isUndefined} from "ionic-angular/util";
import {AdditionalDetailsPage} from "../additional-details/additional-details";
import {Component} from "@angular/core";

@Component({
    templateUrl: 'build/pages/opportunity-details/opportunity-details.html',
    providers: [OpportunitiesService]
})
export class OpportunityDetailsPage {
    opportunity : any;
    service : OpportunitiesService;
    map: any;
    save : boolean = true;
    contact : boolean = false;

    storage : any;

    constructor(public nav: NavController,
                public navParams: NavParams,
                service : OpportunitiesService) {
        this.service = service;
        this.storage = new Storage(LocalStorage);
        this.opportunity = navParams.data.opportunity;
        this.service.loadOpportunitiesById(this.opportunity.id).then(opp=>{
            this.loadMap();
        });
    }

    loadMap() {

        let latLng = new google.maps.LatLng(this.opportunity.lat, this.opportunity.lng);

        let mapOptions = {
            center: latLng,
            zoom:15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        let mapElement = document.getElementById("map");
        this.map = new google.maps.Map(mapElement, mapOptions);
        let address = new google.maps.LatLng(this.opportunity.lat, this.opportunity.lng);
        let bounds = new google.maps.LatLngBounds();
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: address
        });
        bounds.extend(marker.position);
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

    moreData(){
        this.storage.set('OPPORTUNITY', JSON.stringify(this.opportunity)).then(result =>{
            this.nav.push(AdditionalDetailsPage,{opportunity : this.opportunity});
        });
    }
}
