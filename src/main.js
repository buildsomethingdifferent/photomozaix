import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";
import VueSweetalert2 from "vue-sweetalert2";
var WebFont = require("webfontloader");

Vue.use(VueSweetalert2);

import helpers from "./helpers"
const helpersConst = {
  install (Vue, options) {
    Vue.prototype.$helpers = helpers;
  }
};
Vue.use(helpersConst);

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
/*installing jquery globally*/
import 'expose-loader?$!expose-loader?jQuery!jquery';

import VueResource from 'vue-resource'
Vue.use(VueResource);

import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
Validator.extend('maskCompleted', {
  params: [], // list of parameter names
  validate(value) {
    return (value.indexOf("_") > -1) ? false : true;
  },
  getMessage: field => 'Invalid '+field+".",
});
import veeDictionary from "./dictionary/VeeValidateDictionary"
Validator.localize(veeDictionary);
Vue.use(VeeValidate, {
  fieldsBagName: 'vvFields'
});

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

require("./mixins/globalMixin")

import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect)

import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';

Vue.use(VueLoaders);

WebFont.load({
  typekit: {
    id: "hie3uwh"
  },
  timeout: 2000
});
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import "./styles/main.scss";

import VueMoment from 'vue-moment'
Vue.use(VueMoment)
/*import EventsHub from "./events/EventsHub"*/
import IdleVue from 'idle-vue'
/*const eventsHub = new Vue()*/
import eventsHub from "./events/EventsHub"
Vue.prototype.$eventHub = eventsHub;
let timeInterval = parseInt(process.env.VUE_APP_USER_LOGGED_OUT_TIME);
timeInterval = parseInt(timeInterval) * 60000; //time in milliseconds
const options = {
  eventEmitter: eventsHub,
  idleTime: timeInterval,
  store
}

Vue.use(IdleVue, options)

import VueSession from 'vue-session'
Vue.use(VueSession)

import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {});

const VueInputMask = require('vue-inputmask').default

Vue.use(VueInputMask)

import VueDragscroll from 'vue-dragscroll'
Vue.use(VueDragscroll)


const fb = require("./config/firebaseConfig.js");

Vue.config.productionTip = false;

if( process.env.VUE_APP_NODE_ENV == "production" && window.location.protocol === 'http:') {
  let href = window.location.href.split('://')[1]
  href = 'https://'+href;
  window.location.replace(href)
} else {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}


/*fb.auth.onAuthStateChanged(user => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});*/

