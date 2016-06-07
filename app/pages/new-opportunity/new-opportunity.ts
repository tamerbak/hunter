import {NavController, Alert, NavParams, Storage, SqlStorage, LocalStorage} from 'ionic-angular';
import {DatePicker, Camera} from "ionic-native/dist/index";
import {NgZone, Component} from "@angular/core";
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {CandidatesPage} from "../candidates/candidates";
import {OpportunitiesListPage} from "../opportunities-list/opportunities-list";
import {AdditionalDetailsPage} from "../additional-details/additional-details";


@Component({
    templateUrl: 'build/pages/new-opportunity/new-opportunity.html',
    providers : [OpportunitiesService]
})
export class NewOpportunityPage {
    opportunity : any;
    storage : any;
    lstore : any;
    constructor(public nav: NavController,
                public navParams : NavParams,
                private zone: NgZone,
                private opportunityService : OpportunitiesService) {
        this.storage = new Storage(SqlStorage);
        this.lstore = new Storage(LocalStorage);
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

        navigator.geolocation.getCurrentPosition(onSuccess.bind(this), onError.bind(this), posOptions);
    }

    saveOpportunity(){
        let date = new Date();
        this.opportunity.creationDate = (date.getDay()+1)+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        this.opportunity.candidatesCount = 0;
        this.storage.get('currentUser').then((value)=>{
            let user = JSON.parse(value);
            let idAccount = user.id;
            this.opportunityService.saveOpportunity(this.opportunity, idAccount).then((o)=>{
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
            message : "La sauvegarde des données a réussie, désirez vous fournir plus d'information et suggérer cette offre à vos contacts ?",
            buttons :[{
                text: 'Oui',
                handler: ()=> {
                    let navTransition = alert.dismiss();
                    this.lstore.set('OPPORTUNITY', JSON.stringify(this.opportunity)).then(data => {
                        this.nav.push(AdditionalDetailsPage);
                        navTransition.then(() => {
                            this.nav.pop();
                        });
                    });

                    return false;
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
