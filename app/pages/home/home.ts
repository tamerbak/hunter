import {Page, IonicApp, IonicApp, NavParams, NavController, Loading, Modal, Events, Storage, SqlStorage} from 'ionic-angular';
import {LoginsPage} from "../logins/logins";
import {NewOpportunityPage} from "../new-opportunity/new-opportunity";

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  cnxBtnName : string;
  userIsConnected : boolean;
  storage : any;

  constructor(private app: IonicApp,
              private nav: NavController,
              private navParams: NavParams,
              public events: Events) {
    this.cnxBtnName = "Connexion";
    this.storage = new Storage(SqlStorage);

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
