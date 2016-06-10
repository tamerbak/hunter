/**
 * Created by tim on 04/05/16.
 * Here we will define all configurations of both apps.
 * This is a factory pattern that returns the configurations of given target.
 */
"use strict";
var EmployerConfigs = (function () {
    function EmployerConfigs() {
        // Application title
        this.projectName = 'VitOnJob Employeur';
        // Application theme color
        this.themeColor = '#757575';
        // Application opposite theme color
        // VitOnJob Employer image
        this.imageURL = 'img/logo_employeur.png';
        // User employer image
        this.userImageURL = 'img/employer.png';
        this.bgMenuURL = 'img/bg_employer.png';
        this.highlightSentence = 'Trouvez vos jobyers immédiatement disponibles!';
        this.calloutURL = 'http://ns389914.ovh.net/vitonjobv1/api/business';
        this.sqlURL = 'http://ns389914.ovh.net/vitonjobv1/api/sql';
    }
    return EmployerConfigs;
}());
var JobyerConfigs = (function () {
    function JobyerConfigs() {
        // Application title
        this.projectName = "VitOnJob Jobyer";
        // Application theme color
        this.themeColor = "#14baa6";
        // Application opposite theme color
        this.inversedThemeColor = '#757575';
        // VitOnJob Jobyer image
        this.imageURL = "img/logo_jobyer.png";
        // User employer image
        this.userImageURL = 'img/jobyer.png';
        this.bgMenuURL = 'img/bg_jobyer.png';
        this.highlightSentence = "Des milliers d'opportunités à proximité!";
        this.calloutURL = 'http://ns389914.ovh.net/vitonjobv1/api/business';
        this.sqlURL = 'http://ns389914.ovh.net/vitonjobv1/api/sql';
        this.calendarTheme = 5;
    }
    return JobyerConfigs;
}());
var Configs = (function () {
    function Configs() {
    }
    Configs.setConfigs = function (type) {
        if (type === "employer") {
            return new EmployerConfigs();
        }
        else if (type === "jobyer") {
            return new JobyerConfigs();
        }
        return null;
    };
    Configs.calloutURL = 'http://ns389914.ovh.net/vitonjobv1/api/business';
    Configs.sqlURL = 'http://ns389914.ovh.net/vitonjobv1/api/sql';
    Configs.yousignURL = 'http://ns389914.ovh.net:8080/vitonjobv1/api/business';
    Configs.smsURL = 'http://ns389914.ovh.net/vitonjobv1/api/sms';
    Configs.emailURL = 'http://ns389914.ovh.net/vitonjobv1/api/email';
    return Configs;
}());
exports.Configs = Configs;
//# sourceMappingURL=configs.js.map