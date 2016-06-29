import {Page, NavController, NavParams} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {Component} from "@angular/core";

declare var google;
@Component({
    templateUrl: 'build/pages/opportunity-contact/opportunity-contact.html',
    providers:[OpportunitiesService]
})
export class OpportunityContactPage {
    opportunity : any;
    service : OpportunitiesService;
    map : any;

    constructor(public nav: NavController,
                public navParams : NavParams,
                service : OpportunitiesService) {
        this.service = service;
        let opp = this.navParams.data.opp;
        let oid = opp.id;

        this.opportunity = {
            id : oid,
            title : opp.title,
            description : opp.description,
            candidatesCount : 0,
            activeOpportunity : true,
            lat : 0,
            lng : 0,
            creationDate : '',
            closureDate : '',
            picture : ''
        };

        this.service.loadOpportunitiesById(oid).then(opportunity =>{
            this.opportunity = opportunity;
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


    contactOpportunity(){

    }
}
