import {App, Platform, MenuController, Storage, SqlStorage, Events, Nav, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ViewChild, Component, enableProdMode} from "@angular/core";
import {OpportunitiesListPage} from "./pages/opportunities-list/opportunities-list";
import {PropositionsPage} from "./pages/propositions/propositions";
import {LoginsPage} from "./pages/logins/logins";


@Component({
    templateUrl: 'build/menu.html',
})
export class Hunter {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = HomePage;
    pages : Array<{title : string, component : any, icon : string, isBadged: boolean}>;
    loggedInPages : Array<{title : string, component : any, icon : string, isBadged: boolean}>;
    loggedOutPages : Array<{title : string, component : any, icon : string, isBadged: boolean}>;
    storage : any;

    currentUser:any;
    userName:string;
    userMail:string;


    constructor(platform: Platform,
                private app: App,
                private menu: MenuController,
                public events: Events) {
        platform.ready().then(() => {
            StatusBar.styleDefault();
        });
        this.storage = new Storage(SqlStorage);

        this.loggedOutPages = [
            {title : "Publier une Offre", component : HomePage, icon:"md-share", isBadged:false},
            {title : "Se connecter / S'inscrire", component : LoginsPage, icon:"log-in", isBadged:false}
        ];

        this.loggedInPages = [
            {title : "Publier une Offre", component : HomePage, icon:"md-share", isBadged:false},
            {title : "Mes offres publiées", component : OpportunitiesListPage, icon:"ios-share-outline", isBadged:false},
            {title : "Mes offres reçues", component : PropositionsPage, icon:"ios-download-outline", isBadged:false},
            {title : "Se déconnecter", component : HomePage, icon:"log-out", isBadged:false}
        ];


        this.listenToLoginEvents();

    }

    listenToLoginEvents() {
        //verify if the user is already connected
        this.storage.get("currentUser").then((value) => {

            if(value){
                this.currentUser = JSON.parse(value);
                this.userName = this.currentUser.titre+' '+this.currentUser.prenom+' '+this.currentUser.nom;
                this.userMail = value.email;
                this.enableMenu(true);
            }else{

                this.enableMenu(false);
            }
        });
        this.events.subscribe('user:login', () => {
            this.storage.get("currentUser").then((value) => {
                
                this.currentUser = JSON.parse(value);
                this.userName = this.currentUser.titre+' '+this.currentUser.prenom+' '+this.currentUser.nom;
                this.userMail = value.email;
                this.enableMenu(true);
            });
        });

        this.events.subscribe('user:logout', () => {
            
            this.userName = '';
            this.userMail = '';
            this.enableMenu(false);
        });
    }

    enableMenu(loggedIn) {
        this.menu.enable(loggedIn, "loggedInMenu");
        this.menu.enable(!loggedIn, "loggedOutMenu");
    }

    openPage(page) {
        this.menu.close();

        if(page.title == 'Se déconnecter' ){
            this.storage.set("currentUser", null);
            this.events.publish('user:logout');
        }
        this.nav.setRoot(page.component);
    }
}

enableProdMode();
ionicBootstrap(Hunter, [], {
    backButtonText: "Retour"
});