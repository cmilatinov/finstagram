export default class {

    static validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static dateDiffFromNow(date) {
        const day = 86400000, hour = 3600000, min = 60000;
        date = new Date(date);
        let diff = new Date() - date;
        return  Math.round(diff / day) > 0 ? `${Math.round(diff / day)}d` :
                Math.round(diff / hour) > 0 ? `${Math.round(diff / hour)}h` :
                `${Math.round(diff / min)}m`;
    }

}