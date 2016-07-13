import {App, Platform, MenuController, Storage, SqlStorage, Events, Nav, ionicBootstrap} from 'ionic-angular';
import {StatusBar, Deeplinks} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ViewChild, Component, enableProdMode} from "@angular/core";
import {OpportunitiesListPage} from "./pages/opportunities-list/opportunities-list";
import {PropositionsPage} from "./pages/propositions/propositions";
import {LoginsPage} from "./pages/logins/logins";

declare var cordova;
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
    tokens:any;


    constructor(platform: Platform,
                private app: App,
                private menu: MenuController,
                public events: Events) {

        this.tokens = {
            android:'41e4ff2103da80bd84a997a996c2a8e7',
            ios:'f515ee4ad2dffe2bb3bdac575d10bdbd'
        };

        platform.ready().then(() => {

            if ((<any>window).cordova){
                StatusBar.styleDefault();

                // Convenience to route with a given nav
                Deeplinks.routeWithNavController(this.nav, {
                    //'/home': HomePage,
                    '/opportunities' : OpportunitiesListPage
                    //'/universal-links-test': AboutPage,
                    //'/products/:productId': ProductPage
                }).subscribe((match) => {
                    console.log('Successfully routed', match);
                }, (nomatch) => {
                    console.warn('Unmatched Route', nomatch);
                });

                // instabug plugin
                cordova.plugins.instabug.activate(
                    {
                        android: this.tokens.android,
                        ios: this.tokens.ios
                    },
                    'button',
                    {
                        commentRequired: true,
                        emailRequired: true,
                        shakingThresholdAndroid: '1.5',
                        shakingThresholdIPhone: '1.5',
                        shakingThresholdIPad: '0.6',
                        enableIntroDialog: false,
                        floatingButtonOffset: '200',
                        setLocale: 'french',
                        colorTheme: 'light'
                    },
                    function () {
                        console.log('Instabug initialized.');
                    },
                    function (error) {
                        console.log('Instabug could not be initialized - ' + error);
                    }
                );
            }
        });
        this.storage = new Storage(SqlStorage);

        this.loggedOutPages = [
            {title : "Publier une opportunité", component : HomePage, icon:"md-share", isBadged:false},
            {title : "Se connecter / S'inscrire", component : LoginsPage, icon:"log-in", isBadged:false}
        ];

        this.loggedInPages = [
            {title : "Publier une opportunité", component : HomePage, icon:"md-share", isBadged:false},
            {title : "Opportunités publiées", component : OpportunitiesListPage, icon:"ios-share-outline", isBadged:false},
            {title : "Opportunités reçues", component : PropositionsPage, icon:"ios-download-outline", isBadged:false},
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
                this.userMail = this.currentUser.email;
                this.enableMenu(true);
            }else{

                this.enableMenu(false);
            }
        });
        this.events.subscribe('user:login', () => {
            this.storage.get("currentUser").then((value) => {
                
                this.currentUser = JSON.parse(value);
                this.userName = this.currentUser.titre+' '+this.currentUser.prenom+' '+this.currentUser.nom;
                this.userMail = this.currentUser.email;
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