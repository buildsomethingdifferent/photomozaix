import Vue from "vue"
import store from "../store";
import router from "../router";
import helpers from "../helpers";
const fb = require("../config/firebaseConfig");
const AES = require("crypto-js/aes");
const UTF8 = require("crypto-js/enc-utf8");

Vue.mixin({
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
                user_encryption_key: process.env.VUE_APP_USER_ENCRYPTION_KEY,
                order_encryption_key: process.env.VUE_APP_ORDER_ENCRYPTION_KEY,
                logout_encryption_key: process.env.VUE_APP_USER_LOGGED_OUT_TIME,
            },
            draggable:true,
            showSideBar: true,
            countries: [{
                text:"United States", value:"United States"
            }],
            regions:[
                {
                    text:"Select State", value:null
                },
                {
                    text:"A laska", value:"A laska"
                },
                {
                    text:"Alabama", value:"Alabama"
                },
                {
                    text:"Arkansas", value:"Arkansas"
                },
                {
                    text:"Arizona", value:"Arizona"
                },
                {
                    text:"California", value:"California"
                },
                {
                    text:"Colorado", value:"Colorado"
                },
                {
                    text:"Connecticut", value:"Connecticut"
                },
                {
                    text:"District of Columbia", value:"District of Columbia"
                },
                {
                    text:"Delaware", value:"Delaware"
                },
                {
                    text:"Florida", value:"Florida"
                },
                {
                    text:"Georgia", value:"Georgia"
                },
                {
                    text:"Hawaii", value:"Hawaii"
                },
                {
                    text:"Iowa", value:"Iowa"
                },
                {
                    text:"Idaho", value:"Idaho"
                },
                {
                    text:"Illinois", value:"Illinois"
                },
                {
                    text:"Indiana", value:"Indiana"
                },
                {
                    text:"Kansas", value:"Kansas"
                },
                {
                    text:"Kentucky", value:"Kentucky"
                },
                {
                    text:"Louisiana", value:"Louisiana"
                },
                {
                    text:"Massachusetts", value:"Massachusetts"
                },
                {
                    text:"Maryland", value:"Maryland"
                },
                {
                    text:"Maine", value:"Maine"
                },
                {
                    text:"Michigan", value:"Michigan"
                },
                {
                    text:"Minnesota", value:"Minnesota"
                },
                {
                    text:"Missouri", value:"Missouri"
                },
                {
                    text:"Mississippi", value:"Mississippi"
                },
                {
                    text:"Montana", value:"Montana"
                },
                {
                    text:"North Carolina", value:"North Carolina"
                },
                {
                    text:"North Dakota", value:"North Dakota"
                },
                {
                    text:"Nebraska", value:"Nebraska"
                },
                {
                    text:"New Hampshire", value:"New Hampshire"
                },
                {
                    text:"New Jersey", value:"New Jersey"
                },
                {
                    text:"New Mexico", value:"New Mexico"
                },
                {
                    text:"Nevada", value:"Nevada"
                },
                {
                    text:"New York", value:"New York"
                },
                {
                    text:"Ohio", value:"Ohio"
                },
                {
                    text:"Oklahoma", value:"Oklahoma"
                },
                {
                    text:"Oregon", value:"Oregon"
                },
                {
                    text:"Pennsylvania", value:"Pennsylvania"
                },
                {
                    text:"Rhode Island", value:"Rhode Island"
                },
                {
                    text:"South Carolina", value:"South Carolina"
                },
                {
                    text:"South Dakota", value:"South Dakota"
                },
                {
                    text:"Tennessee", value:"Tennessee"
                },
                {
                    text:"Texas", value:"Texas"
                },
                {
                    text:"Utah", value:"Utah"
                },
                {
                    text:"Virginia", value:"Virginia"
                },
                {
                    text:"Vermont", value:"Vermont"
                },
                {
                    text:"Washington", value:"Washington"
                },
                {
                    text:"Wisconsin", value:"Wisconsin"
                },
                {
                    text:"West Virginia", value:"West Virginia"
                },
                {
                    text:"Wyoming", value:"Wyoming"
                },
            ]
        };
    },
    computed: {
        authUser: {
            get() {
               return this.currentUser;
            },
            set() {
                let self = this;
                let currentUser = self.getCurrentUser();
                if(self.emptyOrNull(currentUser)) {
                    self.isAuth = false;
                    return {}
                } else {
                    self.isAuth = true;
                    return currentUser;
                }
            }
        }
    },
    watch:{
        showLoader(newVal, oldVal) {
            if(newVal) {
                $("body").addClass("loaderOpen")
            } else {
                $("body").removeClass("loaderOpen")
            }
        }
    },
    methods: {
        getCurrentUser() {
            let self = this;
            if(self.$cookies.isKey("currentUser")) {
                self.isAuth = true;
                let user_info_string  = self.AES.decrypt(self.$cookies.get("currentUser"), self.envKeys.user_encryption_key);
                let user_info_object = JSON.parse(user_info_string.toString(self.UTF8));
                self.authUser = true;
                return user_info_object;
            } else {
                self.isAuth = false;
                return {};
            }
        },
        countDownChanged(dismissCountDown) {
            let self = this;
            self.dismissCountDown = dismissCountDown;
        },
        dismissAlert() {
            let self = this;
            self.dismissCountDown = 0;
            self.pageMessages = [];
            self.$store.commit("clearFlashMessage")
        },
        simpleAlert(obj) {
            let self = this;
            let alert_obj = {
                type: obj.type ? obj.type : 'success',
                text: obj.text ? obj.text : ""
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
        logOutUser() {
            let self = this;
            self.consoleData("Logging out user...");
            self.$store.dispatch("clearData");
            self.$router.push({name:"LoginPage"})
        },
        refreshCurrentUser(uid) {
            let self  =  this;
            fb.usersCollection.doc(uid).get().then((userQuerySnapShot) => {
                let user = userQuerySnapShot.data();
                user["uid"] = userQuerySnapShot.id;
                user = self.removeColumnsFromUserObject(user);
                this.$store.commit("setCurrentUser", user);
            })
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
        arrayToObject(value) {
            if(value.constructor.name == 'Array') {
               if(value.length > 0) {
                   let arrayObj =  value.reduce(function(obj, index) {
                       obj[index] = true;
                       return obj;
                   }, {});
                   return arrayObj;
               } else {
                   console.warn("Empty array is given to arrayToObject method ")
               }
            } else {
                console.error("arrayToObject method accepts array. But "+value.constructor.name + " is given");
            }
        },

        isFlashMessage(componentName) {
            let self =this;
            if(!self.$helpers.emptyOrNull(self.$store.state.flashMessage) &&
                self.$store.state.flashMessage.component == componentName) {
                return true;
            } else {
                return false;
            }
        },
        isFloat: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();;
            } else {
                return true;
            }
        },
        isInteger: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (evt.which != 8 && evt.which != 0 && (evt.which < 48 || evt.which > 57)) {
                evt.preventDefault()
            } else {
                return true;
            }
        },
        removeFlashMessage(componentName) {
            let self = this;
            if(!self.emptyOrNull(self.$store.state.flashMessage)) {
                if(self.$store.state.flashMessage.component != componentName) {
                    self.$store.commit("clearFlashMessage");
                }
            }
        },
        removeColumnsFromUserObject(userObject) {
            delete userObject.name_terms;
            delete userObject.email_terms;
            delete userObject.ordered_projects;
            return userObject;
        },
        toggleSideBar() {
            let self = this;
           self.$store.commit("toggleSideBar")
        }
    }
})
