import {NavController, NavParams, Tabs, Loading} from 'ionic-angular';
import {LoadListService} from "../../providers/load-list.service";
import {Configs} from '../../configurations/configs';
import {GlobalConfigs} from '../../configurations/globalConfigs';
import {SqlStorageService} from "../../providers/sql-storage.service";
import {AuthenticationService} from "../../providers/authentication.service";
import {Storage, SqlStorage} from 'ionic-angular';
import {GlobalService} from "../../providers/global.service";
import {Component} from '@angular/core';
import {HomePage} from "../home/home";

/**
	* @author Amal ROCHD
	* @description update civility information
	* @module Authentication
*/
@Component({
	templateUrl: 'build/pages/civility/civility.html',
	providers: [GlobalConfigs, LoadListService, SqlStorageService, AuthenticationService, GlobalService]
})
export class CivilityPage {
	title: string;
	lastname: string;
	firstname: string;
	currentUser;
	titlePage: string;
	
	/**
		* @description While constructing the view, we load the list of nationalities, and get the currentUser passed as parameter from the connection page, and initiate the form with the already logged user
	*/
	constructor(public nav: NavController, private authService: AuthenticationService,
	public gc: GlobalConfigs, private loadListService: LoadListService, private sqlStorageService: SqlStorageService, params: NavParams, private globalService: GlobalService) {
		// Set global configs
		// Get target to determine configs
		this.projectTarget = gc.getProjectTarget();
		this.storage = new Storage(SqlStorage);
		
		// get config of selected target
		let config = Configs.setConfigs(this.projectTarget);
		
		// Set local variables and messages
		this.themeColor = config.themeColor;
		this.isEmployer = (this.projectTarget == 'employer');
		this.params = params;
		this.currentUser = this.params.data.currentUser;
		this.titlePage = "Page civilité";
		
		//in case of user has already signed up
		this.initCivilityForm();
	}
	
	/**
		* @description initiate the civility form with the data of the logged user
	*/
	initCivilityForm(){
		this.storage.get("currentUser").then((value) => {
			if(value){
				this.currentUser = JSON.parse(value);
				this.title = this.currentUser.titre;
				this.lastname = this.currentUser.nom;
				this.firstname = this.currentUser.prenom;
			}
		});
	}
	/**
		* @description update civility information for employer and jobyer
	*/
	updateCivility(){
		let loading = Loading.create({
			content: ` 
			<div>
			<img src='img/loading.gif' />
			</div>
			`,
			spinner : 'hide'
		});
		this.nav.present(loading);
		if(this.isEmployer){
			//get the role id
			var employerId = this.currentUser.employer.id;
			//get entreprise id of the current employer
			var entrepriseId = this.currentUser.employer.entreprises[0].id;
			// update employer
			this.authService.updateEmployerCivility(this.title, this.lastname, this.firstname, employerId, entrepriseId)
			.then((data) => {
				if (!data || data.status == "failure") {
					console.log(data.error);
					loading.dismiss();
					this.globalService.showAlertValidation("VitOnJob", "Erreur lors de la sauvegarde des données");
					return;
					}else{
					// data saved
					console.log("response update civility : " + data.status);
					this.currentUser.titre = this.title;
					this.currentUser.nom = this.lastname;
					this.currentUser.prenom = this.firstname;
					// PUT IN SESSION
					this.storage.set('currentUser', JSON.stringify(this.currentUser));
					loading.dismiss();
					//redirecting to personal address tab
					this.nav.rootNav.setRoot(HomePage);
				}
			});
			}else{
			//get the role id
			var jobyerId = this.currentUser.jobyer.id;
			// update jobyer
			this.authService.updateJobyerCivility(this.title, this.lastname, this.firstname, jobyerId)
			.then((data) => {
				if (!data || data.status == "failure") {
					console.log(data.error);
					loading.dismiss();
					this.globalService.showAlertValidation("VitOnJob", "Erreur lors de la sauvegarde des données");
					return;
					}else{
					// data saved
					console.log("response update civility : " + data.status);
					this.currentUser.titre = this.title;
					this.currentUser.nom = this.lastname;
					this.currentUser.prenom = this.firstname;
					// PUT IN SESSION
					this.storage.set('currentUser', JSON.stringify(this.currentUser));
					loading.dismiss();
					//redirecting to personal address tab
					this.nav.rootNav.setRoot(HomePage);
				}
			});
		}
		
	}
	
	/**
		* @description function called to decide if the validate button should be disabled or not
	*/
	isUpdateDisabled(){
		return (!this.title || !this.firstname || !this.lastname);
	}
}