import Vue from "vue";
import Vuex from "vuex";

const fb = require("./config/firebaseConfig.js");
import helpers from "./helpers"
import router from "./router"
import VueCookies from 'vue-cookies'
const AES = require("crypto-js/aes");
const UTF8 = require("crypto-js/enc-utf8");
import VueSession from "vue-session"

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        currentUser: {},
        userProfile: {},
        globalMessage:{},
        flashMessage:{},
        showSideBar:true
    },
    actions: {
        clearData({commit}) {
            commit("setCurrentUser", {});
            commit("setUserProfile", {});
        },
        fetchUserProfile({commit, state}) {
            fb.usersCollection
                .doc(state.currentUser.uid)
                .get()
                .then(res => {
                    commit("setUserProfile", res.data());
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mutations: {
        toggleSideBar(state, val){
            state.showSideBar = !state.showSideBar;
        },
        setFlashMessage(state, val){
            state.flashMessage = val;
        },
        clearFlashMessage(state){
            state.flashMessage = {};
        },
        setCurrentUser(state, val) {
            state.currentUser = val;
            if(helpers.emptyOrNull(val)) {
                VueCookies.remove("currentUser");
            } else {
                let updatedVal = helpers.removeColumnsFromUserObject(val);
                let encryptUserData = AES.encrypt(JSON.stringify(updatedVal), process.env.VUE_APP_USER_ENCRYPTION_KEY);
                VueCookies.set("currentUser", encryptUserData.toString(), process.env.VUE_APP_USER_LOGGED_OUT_TIME+"MIN")
            }
        },
        setUserProfile(state, val) {
            state.userProfile = val;
        },
        setGlobalMessage(state, val){
            state.globalMessage = val;
        }
    }
});
export default store
