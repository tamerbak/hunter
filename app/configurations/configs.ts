import {Headers} from "@angular/http";
/**
 * Created by tim on 04/05/16.
 * Here we will define all configurations of both apps.
 * This is a factory pattern that returns the configurations of given target.
 */

interface AbstractConfigs {
    projectName:string;
    themeColor: string;
    inversedThemeColor : string;
    imageURL: string;
    highlightSentence : string;
    bgMenuURL: string;
    calloutURL : string;
    sqlURL : string;
    userImageURL: string;
    calendarTheme : number;
}

class EmployerConfigs implements AbstractConfigs {

    // Application title
    projectName:string = 'VitOnJob Employeur';
    // Application theme color
    themeColor: string = '#757575';
    // Application opposite theme color
    inversedThemeColor: string = '#757575';
    // VitOnJob Employer image
    imageURL: string = 'img/logo_employeur.png';
    // User employer image
    userImageURL = 'img/employer.png';
    bgMenuURL: string = 'img/bg_employer.png';
    highlightSentence : string = 'Trouvez vos jobyers immédiatement disponibles!';
    calloutURL : string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/business';
    sqlURL : string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/sql';
    calendarTheme: number = 4;
}

class JobyerConfigs implements AbstractConfigs {

    // Application title
    projectName:string = "VitOnJob Jobyer";
    // Application theme color
    themeColor: string = "#14baa6";
    // Application opposite theme color
    inversedThemeColor: string = '#757575';
    // VitOnJob Jobyer image
    imageURL: string = "img/logo_jobyer.png";
    // User employer image
    userImageURL = 'img/jobyer.png';
    bgMenuURL: string = 'img/bg_jobyer.png';
    highlightSentence : string = "Des milliers d'opportunités à proximité!";
    calloutURL : string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/business';
    sqlURL : string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/sql';
    calendarTheme: number = 5;
}

class HunterConfigs implements AbstractConfigs {

    // Application title
    projectName:string = "Vit-On-Job Hunter";
    // Application theme color
    themeColor: string = "#14baa6";
    // Application opposite theme color
    inversedThemeColor: string = '#757575';
    // VitOnJob Jobyer image
    imageURL: string = "img/logo_jobyer.png";
    // User employer image
    userImageURL = 'img/jobyer.png';
    bgMenuURL: string = 'img/bg_jobyer.png';
    highlightSentence : string = "Des milliers d'opportunités à proximité!";
    calloutURL : string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/business';
    sqlURL : string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/sql';
    calendarTheme: number = 5;
}


export class Configs {

    /*
    public static calloutURL:string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/business';
    public static sqlURL:string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/sql';
    public static yousignURL:string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/business';
    public static smsURL:string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/envoisms';
    public static emailURL:string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/envoimail';
    */
    
    public static calloutURL : string = 'https://app.vitonjob.com/api/business';
    public static sqlURL : string = 'https://app.vitonjob.com/api/sql';
    public static yousignURL : string = 'https://app.vitonjob.com/api/business';
    public static smsURL : string = 'https://app.vitonjob.com/api/envoisms';
    public static emailURL : string = 'https://app.vitonjob.com/api/envoimail';

    public static env: string = 'PROD'; //DEV

    public static getHttpJsonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", 'application/json');
        headers.append("Authorization", 'Basic aGFkZXM6NWV0Y2Fy');
        return headers;
    }

    public static getHttpTextHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", 'text/plain');
        headers.append("Authorization", 'Basic aGFkZXM6NWV0Y2Fy');
        return headers;
    }

    public static getHttpXmlHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", 'text/xml');
        headers.append("Authorization", 'Basic aGFkZXM6NWV0Y2Fy');
        return headers;
    }
    
    public static setConfigs(type:string):AbstractConfigs {
        if (type === "employer") {
            return new EmployerConfigs();
        } else if (type === "jobyer") {
            return new JobyerConfigs();
        } else if (type === "hunter") {
            return new HunterConfigs();
        }

        return null;
    }
}