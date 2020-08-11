import Vue from "vue"
const fb = require("../config/firebaseConfig");
const AES = require("crypto-js/aes");
const UTF8 = require("crypto-js/enc-utf8");

export default {
    data() {
        return {
            dismissSecs: 10,
            dismissCountDown: 0,
            pageMessage:"",
            pageMessageType: "default",
            showLoader:false,
            loaderName:'ball-spin-fade-loader',
            isAuth:false,
            fb:fb,
            AES:AES,
            UTF8:UTF8,
            envKeys:{
                user_encryption_key: process.env.VUE_APP_USER_ENCRYPTION_KEY
            }
        };
    },
    methods: {
        getCurrentUser() {
            let self = this;
            if(self.$cookies.isKey("currentUser")) {
                let user_info_string  = self.AES.decrypt(self.$cookies.get("currentUser"), self.envKeys.user_encryption_key);
                let user_info_object = JSON.parse(user_info_string.toString(self.UTF8));
                self.authUser = true;
                return user_info_object;
            } else {
                self.authUser = false;
                return {};
            }
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown;
        },
        dismissAlert() {
            let self = this;
            self.dismissCountDown = 0;
            self.pageMessages = [];
        },
        simpleAlert(obj) {
            let self = this;
            let alert_obj = {
                type: obj.type ? obj.type : 'success',
                text: obj.text ? obj.text : "This is testing"
            }
            if(obj.title) {
                alert_obj["title"] = obj.title
            }
            self.$swal.fire(alert_obj)
        },
        consoleData(message) {
            if(process.env.VUE_APP_CONSOLE_DATA) {
                console.log(message);
            }
        },
        emptyorNull(value) {
            if(value == null ){
                return true;
            }else if(value.constructor.name == 'Object') {
                if(Object.keys(value).length > 0) {
                    return false;
                } else {
                    return true;
                }
            } else if(value.constructor.name == 'Array') {
                if(value.length > 0) {
                    return false;
                } else {
                    return true;
                }
            } else if(value.constructor.name == 'String') {
                if(value.length > 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                console.error("The checking value should be of type null, object, array, or string");
                console.error("The emptyOrNull method got "+value.constructor.name+ "Instead of above mentioned types");
            }
        }
    }
}
