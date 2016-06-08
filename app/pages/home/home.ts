import {App, NavParams, NavController, Events, Storage, SqlStorage} from 'ionic-angular';
import {LoginsPage} from "../logins/logins";
import {NewOpportunityPage} from "../new-opportunity/new-opportunity";
import {Component} from "@angular/core";
import {NotationService} from "../../providers/notation-service/notation-service";

@Component({
    templateUrl: 'build/pages/home/home.html',
    providers : [NotationService]
})
export class HomePage {
    cnxBtnName : string;
    userIsConnected : boolean;
    storage : any;
    service : NotationService;
    constructor(private app: App,
                private nav: NavController,
                private navParams: NavParams,
                public events: Events,
                service : NotationService) {
        this.cnxBtnName = "Se connecter / S'inscrire";
        this.storage = new Storage(SqlStorage);
        this.service = service;
        this.service.loadCurrentNotation().then(notation => {
           this.storage.set('NOTATION_PARAMETERS',JSON.stringify(notation));
        });
        this.storage.get("currentUser").then((value) => {

            if(value){
                this.cnxBtnName = "Déconnexion";
                this.userIsConnected = true;
            }else{
                this.cnxBtnName = "Se connecter / S'inscrire";
                this.userIsConnected = false;
            }
        });


    }

    openLoginsPage() {
        if(this.userIsConnected){
            this.storage.set("currentUser", null);
            this.cnxBtnName = "Se connecter / S'inscrire";
            this.userIsConnected = false;
            this.events.publish('user:logout');
        }else{
            this.nav.push(LoginsPage);
        }
    }

    newOffer(){
        this.nav.push(NewOpportunityPage);
    }
}
