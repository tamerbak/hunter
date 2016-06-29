import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Configs} from '../configurations/configs';

/**
	* @author Amal ROCHD
	* @description web service access point for loading data from server
	* @module Authentication
*/

@Injectable()
export class LoadListService {
	configuration:any;
	http:any;
	data:any;
	constructor(http: Http) {
		this.http = http;
	}
	
	/**
		* @description load a list of countries with their codes
		* @return JSON results in the form of {country name, country code}
	*/
	loadCountries(){
		//  Init project parameters
		var sql = "SELECT nom, indicatif_telephonique FROM user_pays ORDER BY nom";

	    return new Promise(resolve => {
	      let headers = new Headers();
	      headers.append("Content-Type", 'text/plain');
	      this.http.post(Configs.sqlURL, sql, {headers:headers})
	          .map(res => res.json())
	          .subscribe(data => {
	            this.data = data;
	            resolve(this.data);
	          });
	    });
	}
	
	/**
		* @description load a list of nationalities
		* @return JSON results
	*/
	loadNationalities() {
		//  Init project parameters
		var sql = "select pk_user_nationalite, libelle from user_nationalite";
		
		return new Promise(resolve => {
			let headers = new Headers();
			headers.append("Content-Type", 'text/plain');
			this.http.post(Configs.sqlURL, sql, {headers:headers})
			.map(res => res.json())
			.subscribe(data => {
	            this.data = data;
	            console.log(this.data);
	            resolve(this.data);
			});
		})
	}
}