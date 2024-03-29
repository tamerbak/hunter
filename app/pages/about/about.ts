import {Component} from "@angular/core";
import {AppVersion} from "ionic-native/dist/index";
import {GlobalConfigs} from "../../configurations/globalConfigs";
import {Configs} from "../../configurations/configs";
import {HomePage} from "../home/home";
import {Platform, NavController} from "ionic-angular/index";


@Component({
    templateUrl: 'build/pages/about/about.html',
    providers: [GlobalConfigs]
})
export class AboutPage {

    releaseDate: string;
    appName: string;
    version: string;
    versionCode: string;
    versionNumber: string;
    logo: string;
    projectName: string;
    isEmployer: boolean;
    themeColor: string;
    push:any;
    nav:NavController;

    constructor(gc: GlobalConfigs, platform: Platform, _nav:NavController) {

        this.nav = _nav;
        let monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];
        let date = new Date();
        this.releaseDate = "14 Novembre 2016"; //date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
        //this.appName = AppVersion.getAppName();
        //this.version = AppVersion.getPackageName();
        this.push = HomePage;

        let config = Configs.setConfigs(gc.getProjectTarget());
        this.themeColor = config.themeColor;
        this.logo = config.imageURL;
        this.projectName = config.projectName;
        this.isEmployer = (gc.getProjectTarget() === 'employer');

        AppVersion.getVersionNumber().then(_version => {
            this.versionNumber = _version;
            this.versionCode = '';
            if (platform.is('ios')) {
                AppVersion.getVersionCode().then(_build => {
                    this.versionCode = ' (' + _build + ')';
                });
            }
        });

    }

    goBack() {
        this.nav.setRoot(this.push);
    }
}
