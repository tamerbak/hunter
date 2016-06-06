import {Page, NavController, Alert, NavParams, Storage, SqlStorage} from 'ionic-angular';
import {DatePicker, Camera} from "ionic-native/dist/index";
import {NgZone} from "@angular/core";
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {CandidatesPage} from "../candidates/candidates";
import {OpportunitiesListPage} from "../opportunities-list/opportunities-list";


@Page({
    templateUrl: 'build/pages/new-opportunity/new-opportunity.html',
    providers : [OpportunitiesService]
})
export class NewOpportunityPage {
    opportunity : any;
    storage : any;
    constructor(public nav: NavController,
                public navParams : NavParams,
                private zone: NgZone,
                private opportunityService : OpportunitiesService) {
        this.storage = new Storage(SqlStorage);
        this.opportunity = {
            id : 0,
            title : '',
            description : '',
            candidatesCount : '',
            activeOpportunity : 'OUI',
            lat : 49.003814,
            lng : 2.569684,
            creationDate : '',
            closureDate : '',
            picture : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYDDgMz2Qb0swAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAgSURBVGje7cEBAQAAAIIg/69uSEABAAAAAAAAAADAowEnQgAB2mBYUwAAAABJRU5ErkJggg=='
        };
    }

    showDatePicker(type:string) {
        DatePicker.show({
            date: new Date(),
            mode: type
        }).then(date=>{
            this.opportunity.closureDate = (date.getDay()+1)+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        });
    }

    takePicture(){
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            this.zone.run(()=>{
                // imageData is a base64 encoded string
                this.opportunity.picture = "data:image/jpeg;base64," + imageData;
            });
        }, (err) => {
            console.log(err);
        });
    }

    saveOpp(){
        /*debugger;
         let posOptions = {maximumAge: 0, timeout: 50000, enableHighAccuracy: false };
         let onSuccess = function(position){
         this.opportunity.lat = position.coords.latitude;
         this.opportunity.lng = position.coords.longitude;
         this.saveOpportunity();
         };

         let onError = function(err){
         this.opportunity.lat = 0;
         this.opportunity.lng = 0;
         console.log('Error while getting location');
         console.log(err.code);
         console.log(err.message);
         console.log(JSON.stringify(err));
         this.saveOpportunity();
         };

         navigator.geolocation.getCurrentPosition(onSuccess.bind(this), onError.bind(this), posOptions);*/
        this.opportunity.lat = 0;
        this.opportunity.lng = 0;
        this.saveOpportunity();
    }

    saveOpportunity(){
        let date = new Date();
        this.opportunity.creationDate = (date.getDay()+1)+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        this.opportunity.candidatesCount = 0;
        this.storage.get('currentUser').then((value)=>{
            let user = JSON.parse(value);
            let idAccount = user.id;
            this.opportunityService.saveOpportunity(this.opportunity, idAccount).then((o)=>{
                debugger;
                this.opportunity = o;
                if(o.id >0){
                    this.successfulSave();
                } else {
                    this.unsuccessfulSave();
                }
            });
        });

    }

    successfulSave(){
        let alert = Alert.create({
            title : 'Vitonjob Hunter',
            message : "La sauvegarde des données a réussie désirez vous suggérer cette opportunité à vos contact ?",
            buttons :[{
                text: 'Oui',
                handler: ()=> {
                    this.nav.push(CandidatesPage, {opportunity: this.opportunity});
                    return true;
                }
            },{
                text: 'Non',
                role: 'cancel',
                handler: ()=> {
                    this.nav.setRoot(OpportunitiesListPage);
                    return true;
                }
            }]
        });
        this.nav.present(alert);
    }

    unsuccessfulSave(){
        let alert = Alert.create({
            title : 'Vitonjob Hunter',
            message : "La sauvegarde des données a échoué veuillez réssayer ultérieurement",
            buttons :[{
                text : 'OK',
                handler:()=>{
                    return true;
                }
            }]
        });
        this.nav.present(alert);
    }
}
