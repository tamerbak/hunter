import {Component} from '@angular/core';
import {NavController, ViewController, Storage, LocalStorage, Alert} from 'ionic-angular';
import {OpportunitiesService} from "../../providers/opportunities-service/opportunities-service";
import {ValidationDataService} from "../../providers/validation-data.service";
import {LoadListService} from "../../providers/load-list.service";

@Component({
    templateUrl: 'build/pages/modal-manual-contact/modal-manual-contact.html',
    providers : [OpportunitiesService, ValidationDataService, LoadListService]
})
export class ModalManualContactPage {
    viewCtrl : ViewController;
    contact : any;
    storage : any;
    opportunity : any;
    service : OpportunitiesService;
	isEmailValid = true;
	isPhoneNumValid = true;
	index: int;
	pays = [];

    constructor(public nav: NavController,
                viewCtrl : ViewController,
                service : OpportunitiesService, 
				private validationDataService: ValidationDataService,
				private loadListService: LoadListService) {
        this.service = service;
        this.storage = new Storage(LocalStorage);
        this.storage.get('OPP').then((result)=>{
            this.opportunity = JSON.parse((result));
        });
        this.viewCtrl = viewCtrl;
        this.contact = {
            id : 0,
			tel : '',
            email : '',
            deviceToken : '',
            concluded : false,
            seen : false,
            seenDate: '',
            firstName : '',
            lastName : '',
            title : ''
        };
		this.index = 33;
		//load countries list
		this.loadListService.loadCountries('employer').then((data) => {
			this.pays = data.data;
		});
    }

    saveNewContact(){
        this.service.addManuelCandidate(this.index, this.contact,this.opportunity).then((contact) =>{
            this.contact = contact;
            this.viewCtrl.dismiss(this.contact);
        });
    }

    cancelNewContact(){
        this.contact.id = 0;
        this.viewCtrl.dismiss(this.contact);
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
		return ((!this.isEmailValid && this.contact.email) || (!this.isPhoneNumValid && this.contact.tel))
	}
}