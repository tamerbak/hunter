import {Component} from '@angular/core';
import {NavController, Storage, LocalStorage, SqlStorage, ViewController, Alert} from 'ionic-angular';
import {EmployersService} from "../../providers/employers-service/employers-service";
import {NotationService} from "../../providers/notation-service/notation-service";
import {SMS} from "ionic-native/dist/index";
import {ValidationDataService} from "../../providers/validation-data.service";
import {LoadListService} from "../../providers/load-list.service";

@Component({
    templateUrl: 'build/pages/modal-new-entreprise/modal-new-entreprise.html',
    providers:[EmployersService, NotationService, ValidationDataService, LoadListService]
})
export class ModalNewEntreprisePage {
    service : EmployersService;
    store : Storage;
    sqlStore : Storage;
    company : any;
    opportunity : any;
    viewCtrl : ViewController;
    notationService : NotationService;
    currentUser : any;
	isEmailValid = true;
	isPhoneNumValid = true;
	index: number;
	pays = [];

    constructor(public nav: NavController,
                service : EmployersService,
                notationService : NotationService,
                viewCtrl: ViewController,
				private validationDataService: ValidationDataService,
				private loadListService: LoadListService) {
        this.service = service;
        this.notationService = notationService;
        this.viewCtrl = viewCtrl;
        this.store = new Storage(LocalStorage);
        this.sqlStore = new Storage(SqlStorage);
        this.company = {
            fullName : '',
            tel : '',
            email : '',
            siret : ''
        };

        this.store.get('OPPORTUNITY').then(opp =>{
            this.opportunity = JSON.parse(opp);
        });

        this.sqlStore.get('currentUser').then(data =>{
            debugger;
           this.currentUser = JSON.parse(data);
        });
		this.index = 33;
		//load countries list
		this.loadListService.loadCountries().then((data:{data:any}) => {
			this.pays = data.data;
		});
    }

    saveNewCompany(){
        this.service.saveNewAccount(this.index, this.company).then(c =>{
            this.notationService.notationEntreprise(this.currentUser.id);
            this.company = c;
            let options = {
                replaceLineBreaks: true,
                android: {
                    intent: ''
                }
            };
            let message = " Pour recruter plus rapidement la personne dont vous avez besoin, je vous invite à créer votre compte sur www.vitonjob.com. Vous pouvez utiliser votre numéro de téléphone : "+this.company.tel+" et votre mot de passe temporaire : Hgtze";
            console.log(message);
            SMS.send(this.company.tel, message, options);
            this.viewCtrl.dismiss(this.company);
        });
    }

    cancelNewCompany(){
        this.company.fullName='';
        this.viewCtrl.dismiss(this.company);
    }
	
	watchPhone(e){
		if (e.target.value) {
			this.isPhoneNumValid = false;
			if (e.target.value.substring(0,1) == '0') {
				e.target.value = e.target.value.substring(1, e.target.value.length);
			}
			if (e.target.value.includes('.')) {
				e.target.value = e.target.value.replace('.', '');
			}
			if(e.target.value.length > 9){
				e.target.value = e.target.value.substring(0, 9);
			}
			if (e.target.value.length == 9) {
				this.isPhoneNumValid = true;
			}
		}else{
			this.isPhoneNumValid = true;
		}
	}
	checkEmail(e){
		if(e.target.value)
		this.isEmailValid = (this.validationDataService.checkEmail(e.target.value));
		else
		this.isEmailValid = true;
	}
	
	/**
		* @description Display the list of countries in an alert
	*/
	doRadioAlert() {
		let alert = Alert.create();
		alert.setTitle('Choisissez votre pays');
		for (let p of this.pays) {
			alert.addInput({
				type: 'radio',
				label: p.nom,
				value: p.indicatif_telephonique,
				//france code by default checked
				checked: p.indicatif_telephonique == '33'
			});
		}
		alert.addButton('Annuler');
		alert.addButton({
			text: 'Ok',
			handler: data => {
				console.log('Radio data:', data);
				this.index = data;
			}
		});
		this.nav.present(alert);
	}
	
	isBtnDisabled() {
		return ((!this.isEmailValid && this.company.email) || (!this.isPhoneNumValid && this.company.tel))
	}
}
