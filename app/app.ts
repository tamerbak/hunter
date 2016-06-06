import {App, Platform, IonicApp, MenuController, Storage, SqlStorage, Events, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ViewChild} from "@angular/core";
import {OpportunitiesListPage} from "./pages/opportunities-list/opportunities-list";


@App({
    templateUrl: 'build/menu.html',
    config: {backButtonText : "Retour"} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
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
                private app: IonicApp,
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
            {title : "Opportunités", component : OpportunitiesListPage, icon:"list", isBadged:false}
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
