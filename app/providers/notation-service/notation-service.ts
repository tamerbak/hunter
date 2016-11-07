import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Configs} from "../../configurations/configs";
import {Storage, SqlStorage} from 'ionic-angular';

/*
 Generated class for the NotationService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class NotationService {
    data: any = null;
    store : Storage;

    constructor(public http: Http) {
        this.store = new Storage(SqlStorage);
    }

    loadCurrentNotation(){
        let sql = "select coefficient_jobyer, coefficient_entreprise, coefficient_contrat from user_parametrage_des_notes " +
            "order by pk_user_parametrage_des_notes desc limit 1";
        return new Promise(resolve => {
            let headers = Configs.getHttpTextHeaders();
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    if(data.data && data.data.length>0){
                        this.data = {
                            jobyers : data.data[0].coefficient_jobyer,
                            employers : data.data[0].coefficient_entreprise,
                            contracts : data.data[0].coefficient_contrat
                        };
                    }

                    resolve(this.data);
                });
        });
    }

    notationJobyer(idAccount){
        this.store.get('NOTATION_PARAMETERS').then(data => {
            let params = JSON.parse(data);
            let sql = "insert into user_notes_hunters (created, type, note, fk_user_account) values " +
                "('"+this.sqlfy(new Date())+"', 'Nouveau compte jobyer', "+params.jobyers+", "+idAccount+")";
            console.log(sql);
            return new Promise(resolve => {
                let headers = Configs.getHttpTextHeaders();
                this.http.post(Configs.sqlURL, sql, {headers:headers})
                    .map(res => res.json())
                    .subscribe(data => {
                        console.log(JSON.stringify(data));
                        resolve(this.data);
                    });
            });
        });

    }

    notationEntreprise(idAccount){
        this.store.get('NOTATION_PARAMETERS').then(data => {
            let params = JSON.parse(data);
            let sql = "insert into user_notes_hunters (created, type, note, fk_user_account) values " +
                "('"+this.sqlfy(new Date())+"', 'Nouveau compte employeur', "+params.employers+", "+idAccount+")";
            debugger;
            return new Promise(resolve => {
                let headers = Configs.getHttpTextHeaders();
                this.http.post(Configs.sqlURL, sql, {headers:headers})
                    .map(res => res.json())
                    .subscribe(data => {
                        resolve(this.data);
                    });
            });
        });

    }

    sqlfy(date){
        let sdate = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        return sdate;
    }
}

