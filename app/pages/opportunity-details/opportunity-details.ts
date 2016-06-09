import {NavController, NavParams, Storage, LocalStorage, Alert} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {CandidatesPage} from "../candidates/candidates";
import {isUndefined} from "ionic-angular/util";
import {AdditionalDetailsPage} from "../additional-details/additional-details";
import {Component, OnInit} from "@angular/core";
import {OpportunitiesListPage} from "../opportunities-list/opportunities-list";
import {DatePicker} from "ionic-native/dist/index";

@Component({
    templateUrl: 'build/pages/opportunity-details/opportunity-details.html',
    providers: [OpportunitiesService]
})
export class OpportunityDetailsPage implements OnInit{
    opportunity : any;
    service : OpportunitiesService;
    map: any;
    save : boolean = true;
    contact : boolean = false;
    style:any;

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

    ngOnInit() {
        if (this.opportunity.closureDate.length == 0) {
            this.style = {
                color: '#999',
                'font-size': '1.6rem',
                'margin-top': '2em'
            };
            if (document.getElementById('dynamicItem').children[0])
                document.getElementById('dynamicItem').children[0].setAttribute('style', '');
        } else {
            if (document.getElementById('dynamicItem').children[0])
                document.getElementById('dynamicItem').children[0].setAttribute('style', 'border-bottom: 2px solid #757575');
            this.style = {
                color: '#999',
                'font-size': '1.3rem',
                'margin-top': '0',
                'margin-bottom': '1.5rem'
            }
        }
    }

    showDatePicker(type:string) {
        DatePicker.show({
            date: new Date(),
            mode: type,
            androidTheme: 5
        }).then(date=> {
            this.opportunity.closureDate = (date.getDate()) + '/' + (parseInt(date.getMonth()) + 1) + '/' + date.getFullYear();
            if (document.getElementById('dynamicItem').children[0])
                document.getElementById('dynamicItem').children[0].setAttribute('style', 'border-bottom: 2px solid #757575');
            this.style = {
                color: '#999',
                'font-size': '1.3rem',
                'margin-top': '0',
                'margin-bottom': '1.5rem'
            }
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

    deleteOpportunity () {
        let confirm = Alert.create({
            title: "Suppression",
            message: "Êtes-vous sûr de vouloir supprimer cette offre?",
            buttons: [
                {
                    text: 'Non',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Oui',
                    handler: () => {
                        console.log('Agree clicked');
                        this.service.deleteOpportunityById(this.opportunity.id).then( ()=>{
                            this.nav.setRoot(OpportunitiesListPage);
                        });
                    }
                }
            ]
        });

        this.nav.present(confirm);
    }
}
