var moment = require("moment")
import Vue from "vue"
import router from "../router"
import store from "../store"
import VueCookies from "vue-cookies"
const AES = require("crypto-js/aes");
const UTF8 = require("crypto-js/enc-utf8");
import eventsHub from "../events/EventsHub"
export default {
    envKeys:{
        user_encryption_key: process.env.VUE_APP_USER_ENCRYPTION_KEY
    },
    AES: AES,
    UTF8: UTF8,

    toggleSubMenu() {
        $(document).ready(function(){
            $(".hasChild").click(function(){
                $(this).next("ul").slideToggle();
                $(this).toggleClass("open")
            });
        })
    },
    addAttributesToObject(obj) {
        obj.deleted_at = null;
        obj.updated_at = new Date();
        return obj
    },
    getDate(format='YYYY-MM-DD HH:mm:ss') {
        return moment().format(format);
    },
    formatDate(date,format='YYYY-MM-DD HH:mm:ss') {
        return moment(date).format(format);
    },
    addTimestamps(object) {
        object["date_created"] = new Date();
        object["date_updated"] = new Date();
        object["date_deleted"] = null;
        return object
    },
    setUserObject(authenticatedUser, userDoc){
        let user_data = {
            displayName: authenticatedUser.displayName,
            email: authenticatedUser.email,
            emailVerified: authenticatedUser.emailVerified,
            phoneNumber: authenticatedUser.phoneNumber,
            photoURL: authenticatedUser.photoURL,
            uid: authenticatedUser.uid,
        }
        return {...user_data, ...userDoc};
    },
    testHelper(){
        console.log("this is testing console")
    },
    getCurrentUser(){
        let self = this;
        if(VueCookies.isKey("currentUser")) {
            let user_info_string  = self.AES.decrypt(VueCookies.get("currentUser"), self.envKeys.user_encryption_key);
            let user_info_object = JSON.parse(user_info_string.toString(self.UTF8));
            return user_info_object;
        } else {
            let emptyObject = {};
            return emptyObject;
        }

    },
    consoleData(message) {
        if(process.env.VUE_APP_CONSOLE_DATA) {
            console.log(message);
        }
    },
    formatDateQuery(date) {
        let start_date = new Date(date);
        start_date.setHours(0,0,0,0);
        let end_date = new Date(date);
        end_date.setHours(23,59,59,999);
        return {
            start_date: start_date,
            end_date: end_date
        }
    },
    bottomOfWindow() {
        let scrollTop = document.documentElement.scrollTop;
        let innerHeight = window.innerHeight;
        let offsetHeight = document.documentElement.offsetHeight;
        let bottomOfWindow = Math.ceil(scrollTop) + innerHeight === offsetHeight;
        /*this.consoleData("scroll position");
        this.consoleData(Math.ceil(scrollTop) + innerHeight);
        this.consoleData(offsetHeight)*/
        return bottomOfWindow;
    },
    emptyOrNull(value) {
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
    },
    getPreviousDate() {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return date
    },
    logOutUser() {
        let self = this;
        self.consoleData("Logging out user...");
        eventsHub.$emit("logout-user");
        store.dispatch("clearData");
        router.push({name:"LoginPage"})
    },
    getStringTerms(string, length=2) {
        let stringArray = string.split("")
        let stringTerms = []
        stringArray.forEach(function(character, cIdx) {
            for(let i = cIdx; i<stringArray.length; i++) {
                let tempArray = stringArray.slice(cIdx, i+1)
                if(tempArray.length > length) {
                    stringTerms.push(stringArray.slice(cIdx, i+1).join(""))
                }
            }
        })
        return stringTerms;
    },
    setMessage(type, message, component) {
        return {
            type: type,
            message: message,
            component: component
        }
    },
    removeColumnsFromUserObject(userObject) {
        delete userObject.name_terms;
        delete userObject.email_terms;
        delete userObject.ordered_projects;
        return userObject;
    }
}
