import {App, Platform, MenuController, Storage, SqlStorage, Events, Nav, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ViewChild, Component} from "@angular/core";
import {OpportunitiesListPage} from "./pages/opportunities-list/opportunities-list";
import {PropositionsPage} from "./pages/propositions/propositions";


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
            {title : "Accueil", component : HomePage, icon:"home", isBadged:false}
        ];

        this.loggedInPages = [
            {title : "Accueil", component : HomePage, icon:"home", isBadged:false},
            {title : "Opportunités", component : OpportunitiesListPage, icon:"list", isBadged:false},
            {title : "Invitations", component : PropositionsPage, icon:"contacts", isBadged:false}
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

        if(page.title == 'Déconnexion' ){
            this.storage.set("currentUser", null);
            this.events.publish('user:logout');
        }
        this.nav.setRoot(page.component);
    }
}

ionicBootstrap(Hunter, [], {
    backButtonText: "Retour"
});