import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Configs} from "../../configurations/configs";

/*
 Generated class for the EmployersService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class EmployersService {
    accounts: any = null;
    opportunity: any;
    account : any;

    constructor(public http: Http) {}

    seekAccounts(query){
        let encodedArg = btoa(query);

        let payload = {
            'class': 'fr.protogen.masterdata.model.CCallout',
            id: 146,
            args: [{
                'class': 'fr.protogen.masterdata.model.CCalloutArguments',
                label: 'Contact to create',
                value: encodedArg
            }]
        };
        return new Promise(resolve => {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            let headers = new Headers();
            headers.append("Content-Type", 'application/json');
            this.http.post(Configs.calloutURL, JSON.stringify(payload), {headers: headers})
                .map(res => res.json())
                .subscribe(data => {
                    debugger;
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    this.accounts = data;
                    resolve(this.accounts);
                });
        });
    }

    saveEnterprise(opportunity){
        let sql = "update user_opportunite set fk_user_entreprise="+opportunity.account.idEntreprise+" where pk_user_opportunite="+opportunity.id;
        
        console.log('UPDATE OPPORTUNITY SQL : '+sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    this.opportunity = opportunity;
                    resolve(this.opportunity);
                });
        });
    }

    loadEmployer(opportunity){
        let sql = "SELECT user_account.pk_user_account, user_entreprise.pk_user_entreprise, user_employeur.pk_user_employeur, " +
            "user_account.email, user_account.telephone, user_entreprise.nom_ou_raison_sociale, user_employeur.nom, user_employeur.prenom " +
            "FROM public.user_entreprise, public.user_employeur, public.user_account " +
            "WHERE user_entreprise.fk_user_account = user_account.pk_user_account " +
            "AND user_entreprise.fk_user_employeur = user_employeur.pk_user_employeur " +
            "AND user_entreprise.pk_user_entreprise in (select fk_user_entreprise from user_opportunite where pk_user_opportunite="+opportunity.id+")";
        console.log('Get account data SQL : '+sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    this.account = {
                        idAccount : 0,
                        idEntreprise : 0,
                        idEmployer : 0,
                        fullName : '',
                        companyName : '',
                        tel : '',
                        email : ''
                    };

                    if(data.data && data.data.length >0){
                        let row = data.data[0];
                        this.account = {
                            idAccount : row.pk_user_account,
                            idEntreprise : row.pk_user_entreprise,
                            idEmployer : row.pk_user_employeur,
                            fullName : row.nom+' '+row.prenom,
                            companyName : row.nom_ou_raison_sociale,
                            tel : row.telephone,
                            email : row.email
                        };
                    }

                    resolve(this.account);
                });
        });
    }

    saveNewAccount(account){
        let sql = "insert into user_account (email, mot_de_passe, telephone, role, est_employeur) values " +
            "('"+account.email+"', 'Hgtze', '"+account.tel+"', 'employeur', 'OUI') returning pk_user_account";
        console.log(sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    if(data.data && data.data.length>0){
                        account.id = data.data[0].pk_user_account;
                        this.saveNewEmployer(account);
                    }

                    resolve(account);
                });
        });
    }

    saveNewEmployer(account){
        let sql = "insert into user_employeur (nom, prenom, titre) values ('"+account.fullName+"','','') returning pk_user_employeur";
        console.log(sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    if(data.data && data.data.length>0){
                        this.saveNewEntreprise(account, data.data[0].pk_user_employeur);
                    }

                    resolve(account);
                });
        });
    }

    saveNewEntreprise(account, idEmployeur){
        let sql = "insert into user_entreprise (nom_ou_raison_sociale, fk_user_account, fk_user_employeur) values " +
            "('"+account.fullName+"',"+account.id+","+idEmployeur+") returning pk_user_entreprise";

        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    resolve(account);
                });
        });
    }
}

