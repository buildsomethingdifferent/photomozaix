<template>
    <div class="checkout">
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <b-alert  :show="isFlashMessage('ProjectOrderPage')" dismissible @dismissed="dismissAlert"
                  :variant="$store.state.flashMessage.type">
            {{$store.state.flashMessage.message}}
        </b-alert>
        <h1>Checkout</h1>

        <div class="checkoutSections mt-5">
            <div class="columns">
                <div class="column is-6 mr-4">
                    <div class="columns">
                        <div class="column pb-0">
                            <b-form-group label="Email" class="innerHeading" label-for="email"
                                          invalid-feedback="Email is required">
                                <b-form-input v-model="email" name="email" id="email" placeholder="Email"
                                              class="input customInput grayBg inputEmailIcon leftIcon"
                                              v-validate="'required|email'"
                                              :class="[errors.first('email') ? 'field_error' : '']"
                                              :disabled="!$helpers.emptyOrNull(currentUser)"
                                              @change="checkUser"
                                ></b-form-input>
                                <b-popover v-if="errors.first('email')" :target="'email'" triggers="hover focus"
                                        :content="errors.first('email')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>

                        <div class="column pb-0" v-if="$helpers.emptyOrNull(currentUser)" ref="passwordDiv">
                            <b-form-group label="Password" class="innerHeading" label-for="password"
                                          invalid-feedback="Password is required">
                                <b-form-input type="password" v-model="password" name="password" id="password" placeholder="Password"
                                              class="input customInput grayBg inputPasswordIcon leftIcon"
                                              v-validate="'required'"
                                              :class="[errors.first('password') ? 'field_error' : '']"
                                              @change="checkUser"
                                ></b-form-input>
                                <b-popover v-if="errors.first('password')" :target="'password'" triggers="hover focus"
                                           :content="errors.first('password')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                    </div>

                    <div class="columns is-multiline mt-3">
                        <div class="column is-12 pb-0">
                            <div class="innerHeading">
                                Shipping Address Information
                            </div>
                        </div>
                        <div class="column pb-0">
                            <b-form-group label-for="first_name" invalid-feedback="First Name is required">
                                <b-form-input type="text" v-model="first_name" name="first_name" id="first_name" placeholder="First Name"
                                              class="input customInput grayBg inputUserIcon leftIcon"
                                              v-validate="'required'"
                                              :class="[errors.first('first_name') ? 'field_error' : '']"
                                ></b-form-input>
                                <b-popover v-if="errors.first('first_name')" :target="'first_name'" triggers="hover focus"
                                           :content="errors.first('first_name')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                        <div class="column pb-0">
                            <b-form-group label-for="last_name" invalid-feedback="Last Name is required">
                                <b-form-input type="text" v-model="last_name" name="last_name" id="last_name" placeholder="Last Name"
                                              class="input customInput grayBg inputUserIcon leftIcon"
                                              v-validate="'required'"
                                              :class="[errors.first('last_name') ? 'field_error' : '']"
                                >
                                </b-form-input>
                                <b-popover v-if="errors.first('last_name')" :target="'last_name'" triggers="hover focus"
                                           :content="errors.first('last_name')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column pb-0">
                            <b-form-group label-for="address" invalid-feedback="Address is required">
                                <b-form-input name="address" v-model="address" id="address" placeholder="Address"
                                              class="input customInput grayBg inputLocationIcon leftIcon"
                                              v-validate="'required'"
                                              :class="[errors.first('address') ? 'field_error' : '']"
                                >
                                </b-form-input>
                                <b-popover v-if="errors.first('address')" :target="'address'" triggers="hover focus"
                                           :content="errors.first('address')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column pb-0">
                            <b-form-group label-for="city" invalid-feedback="City is required">
                                <b-form-input name="city" v-model="city" id="city" placeholder="City"
                                              class="input customInput grayBg inputLocationIcon leftIcon"
                                              v-validate="'required'"
                                              :class="[errors.first('city') ? 'field_error' : '']"
                                >
                                </b-form-input>
                                <b-popover v-if="errors.first('city')" :target="'city'" triggers="hover focus"
                                           :content="errors.first('city')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column pb-0">
                            <b-form-group label-for="country" invalid-feedback="City is required">
                                <b-form-select v-model="country" :options="countries" name="country" id="country" v-validate="'required'"
                                               data-vv-name="country" :class="[errors.first('country') ? 'field_error' : '', 'input grayBg customInput']"
                                               ref="countryDropdown">
                                </b-form-select>
                                <b-popover v-if="errors.first('country')" :target="'country'" triggers="hover focus"
                                           :content="errors.first('country')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                        <div class="column pb-0">
                            <b-form-group label-for="region" invalid-feedback="Region is required">
                                <b-form-select v-model="region" :options="regions" id="region" v-validate="'required'"
                                               data-vv-name="region"  :class="[errors.first('region') ? 'field_error' : '', 'input grayBg customInput']" ref="regionDropdown">
                                </b-form-select>
                                <b-popover v-if="errors.first('region')" :target="'region'" triggers="hover focus"
                                           :content="errors.first('region')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                        <div class="column pb-0">
                            <b-form-group label-for="zip_code" invalid-feedback="Zip Code is required">
                                <b-form-input name="zip_code" v-model="zip_code" placeholder="Zip Code" id="zip_code"
                                              v-mask="'99999'" class="input customInput grayBg" v-validate="'required|maskCompleted'"
                                              :class="[errors.first('zip_code') ? 'field_error' : '']"
                                >
                                </b-form-input>
                                <b-popover v-if="errors.first('zip_code')" :target="'zip_code'" triggers="hover focus"
                                           :content="errors.first('zip_code')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column pb-0">
                            <b-form-group label-for="phone_no" invalid-feedback="Phone No. is required">
                                <b-form-input type="text" name="phone_no" v-model="phone_no" placeholder="Phone Number"
                                              class="input customInput grayBg inputPhoneIcon leftIcon" id="phone_no"
                                              v-validate="'required|maskCompleted'" v-mask="'\+1 (999)-999-9999'"
                                              :class="[errors.first('phone_no') ? 'field_error' : '']"
                                >
                                </b-form-input>
                                <b-popover v-if="errors.first('phone_no')" :target="'phone_no'" triggers="hover focus"
                                           :content="errors.first('phone_no')"
                                >
                                </b-popover>
                            </b-form-group>
                        </div>
                    </div>
                </div>
                <div class="column is-6 ml-4">
                    <div class="columns mt-4 is-multiline is-mobile alignFlexCenter">
                        <div class="column pb-0 is-6">
                            <div class="innerHeading linkColor">Product Name</div>
                        </div>

                        <div class="column is-3 pb-0 text-center">
                            <div class="innerHeading linkColor">Qty</div>
                        </div>

                        <div class="column is-3 pb-0 text-right">
                            <div class="innerHeading linkColor">Price</div>
                        </div>
                    </div>
                    <hr class="medium mt-0">

                    <div class="columns is-multiline is-mobile alignFlexCenter">
                        <div class="column is-6">
                            <div class="innerHeading" v-if="selectedProduct">{{selectedProduct.title | capitalize }}</div>
                        </div>

                        <div class="column is-3 text-center">
                            <b-form-input type="number" v-model="quantity" min="1"
                                          class="input grayBg customInput" name="quantity" id="quantity"
                                          v-validate="'required|numeric|min_value:1'"
                                          :class="[errors.first('quantity') ? 'field_error' : '']"
                                          @change="calculatePrice('yes')" @keydown="checkQuantity"
                            >
                            </b-form-input>
                            <b-popover v-if="errors.first('quantity')" :target="'quantity'" triggers="hover focus"
                                       :content="errors.first('quantity')"
                            >
                            </b-popover>
                        </div>

                        <div class="column is-3 text-right">
                            <div class="innerHeading" style="word-break: break-all;word-wrap: break-word">{{mozaix_price | currency }}</div>
                        </div>
                    </div>

                    <hr class="medium mt-0">

                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column is-9">
                            <div class="innerHeading">Discount</div>
                        </div>
                        <div class="column is-3 text-right" v-if="total_discount > 0">
                            <div class="innerHeading">-{{total_discount | currency}}</div>
                        </div>
                    </div>

                    <div class="columns is-multiline is-mobile alignFlexCenter">
                        <div class="column is-9">
                            <b-form-input name="discount_code" v-model="discount_code" @change="checkCoupon"
                                          placeholder="Discount Code" class="input customInput"
                            ></b-form-input>
                        </div>

                        <div class="column is-3">
                            <b-button variant="info" class="customButtonMedium width_200 lightColor" @click="checkCoupon('yes')">APPLY</b-button>
                        </div>
                    </div>
                   <!-- <hr class="medium mt-0 mb-0">-->
                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column ">
                            <div class="innerHeading">
                                <p style="font-size: 13px; font-weight: bold">Normal production time is 3-5 business days plus shipping time</p>
                                <p>
                                    Express Production
                                    <span title="Express production is 1-2 business days." style="cursor: pointer; color:#7359a6">?</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="columns mt-2 is-multiline is-mobile alignFlexCenter">
                        <div class="column is-12 pb-0">
                            <div style="border:1px solid #ccc" class="p-3 veryLightGrayBg">
                                <b-form-checkbox v-model="express_production" name="express_production" class="fullWidthRadio"
                                              @change="calculatePrice" switch>
                                    <div class="flexElem" style="justify-content: space-between;">
                                        Add Express Production ({{express_production_price | currency}})
                                        <span v-if="express_production">
                                            {{express_production_price | currency}}
                                        </span>
                                    </div>
                                </b-form-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column mt-4">
                            <div class="innerHeading">Subtotal</div>
                        </div>

                        <div class="column mt-4 text-right">
                            <div class="innerHeading">{{before_tax_sub_total | currency}}</div>
                        </div>
                    </div>
                    <div v-if="north_caroline_tax || united_states_tax"  class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column mt-4">
                            <div class="innerHeading">
                                <template v-if="north_caroline_tax">Tax (7.25%)</template>
                                <template v-if="united_states_tax">Tax (7.50%)</template>
                            </div>
                        </div>

                        <div class="column mt-4 text-right">
                            <div class="innerHeading">
                                <template v-if="north_caroline_tax"> {{north_caroline_tax | currency}}</template>
                                <template v-if="united_states_tax"> {{united_states_tax | currency}}</template>
                            </div>
                        </div>
                    </div>

                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column ">
                            <div class="innerHeading">Shipping Method</div>
                        </div>
                    </div>

                    <div class="columns mt-2 is-multiline is-mobile alignFlexCenter">
                        <div class="column is-12 pb-0">
                            <div style="border:1px solid #ccc; border-bottom:none" class="p-3 veryLightGrayBg" @click="showAddress">
                                <b-form-radio v-model="shipping_method" name="shipping_method" class="fullWidthRadio"
                                    value="self_pick" @change="calculatePrice">
                                    <div class="flexElem" style="justify-content: space-between;">
                                        <span>Pick Up From Store
                                            <small @click.prevent="showAddress" v-if="shipping_method == 'self_pick'"
                                            style="cursor: pointer; color:#7359a6"><b>(Show Address)</b></small></span>
                                        <span>{{0.00 | currency}}</span>
                                    </div>
                                </b-form-radio>
                            </div>
                        </div>
                        <div class="column is-12 pt-0 pb-0">
                            <div style="border:1px solid #ccc;" class="p-3 veryLightGrayBg">
                                <b-form-radio v-model="shipping_method" name="shipping_method" class="fullWidthRadio"
                                    value="standard" @change="calculatePrice">
                                    <div class="flexElem" style="justify-content: space-between;">
                                        <span>Standard Shipping
                                            <span style="cursor: pointer; color:#7359a6" title="(USPS 3-4 days)">?</span>
                                        </span>
                                        <span>{{standard_shipping | currency}}</span>
                                    </div>
                                </b-form-radio>
                            </div>
                        </div>

                        <div class="column is-12 pt-0">
                            <div style="border:1px solid #ccc; border-top:none" class="p-3 veryLightGrayBg">
                                <b-form-radio v-model="shipping_method" name="shipping_method" class="fullWidthRadio"
                                      value="express" @change="calculatePrice">
                                    <div class="flexElem" style="justify-content: space-between;">
                                        <span>
                                            Express Shipping
                                            <span style="cursor: pointer; color:#7359a6" title="USPS Express 1-2 days depending on area, overnight not guaranteed.">?</span>
                                        </span>
                                        <span>{{express_shipping | currency}}</span>
                                    </div>
                                </b-form-radio>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column ">
                            <div class="innerHeading">Total</div>
                        </div>

                        <div class="column text-right">
                            <div class="innerHeading">
                                <span style="font-size: 1.9rem">{{grand_total | currency}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="columns is-multiline is-mobile mt-3">
                        <div class="column">
                            <button class="customButtonLarge blockButton lightColor" @click="checkout">CHECKOUT</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    const fb = require("../config/firebaseConfig.js");
    export default {
        name: "ProjectOrderPage",
        props:["projectId", "shareCode"],
        data() {
            return {
                currentUser:{},
                project:null,
                email:"",
                password:"",
                first_name:"",
                last_name:"",
                address:"",
                city:"",
                country:"United States",
                region:null,
                zip_code:null,
                phone_no:null,
                quantity: 1,
                total_price: 0.00,
                first_order_check: true,
                discount_code: "",
                total_discount: 0.00,
                mozaix_price: "",
                sub_total: "",
                price_before_shipping: "",
                before_tax_sub_total: "",
                shipping_method: "standard",
                standard_shipping: "",
                express_shipping: "",
                grand_total: 0.00,
                applied_coupon:null,
                projectSharedInfo:{},
                product_title:"",
                united_states_tax: "",
                north_caroline_tax: "",
                express_production: "",
                express_production_price: 0,
                set_base_price: false,
                base_price: 0,
                include_base_price: false,
                reorder_project: false,
                foundProducts: [],
                productsWithMaxQuantity: [],
                baseProduct: null,
                selectedProduct: null,
            }
        },
        watch:{
            region(newVal, oldVal) {
                let self =this;
                self.united_states_tax = "";
                self.north_caroline_tax = "";
                self.calculatePrice();
            }
        },
        created(){
            let self = this;
            self.removeFlashMessage(self.$options.name);
            self.getOrderInfo();
            // self.checkCoupon("no", false);
            self.validateShareCode();
            self.currentUser = self.$helpers.getCurrentUser();
            if(!self.emptyOrNull(self.currentUser)) {
                self.checkReorderingProject();
                self.email = self.currentUser.email;
                self.first_name = self.currentUser.first_name;
                self.last_name = self.currentUser.last_name;
                self.address = self.currentUser.address;
                self.city = self.currentUser.city;
                self.country = self.currentUser.country ? self.currentUser.country : "United States";
                self.region = self.currentUser.region;
                self.zip_code = self.currentUser.zip_code;
                self.phone_no = self.currentUser.phone_no;
            }
        },
        mounted(){
            let self  = this;
            let docRef = fb.projectsCollection.doc(self.projectId);
            docRef.get().then((projectDoc) => {
                if(projectDoc.exists) {
                    let project_data = projectDoc.data();
                    if(project_data.date_deleted == null) {
                        project_data["id"] = projectDoc.id
                        self.project = project_data;
                    } else {
                        self.$helpers.consoleData("Project does not exist or has been deleted");
                        if(!self.emptyOrNull(self.currentUser)) {
                            if(self.currentUser == "customer") {
                                let message = self.$helpers.setMessage("danger", "The requested project does not exist", "Dashboard")
                                self.$store.commit("setFlashMessage", message);
                                self.$router.push({name: "UserDashboard"})
                            } else {
                                let message = self.$helpers.setMessage("danger", "The requested project does not exist", "AdminDashboard")
                                self.$store.commit("setFlashMessage", message);
                                self.$router.push({name: "AdminDashboard"})
                            }
                        } else {
                            let message = self.$helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
                            self.$store.commit("setFlashMessage", message);
                            self.$helpers.logOutUser()
                        }
                    }
                } else {
                    self.$helpers.consoleData("Project does not exist");
                    if(!self.emptyOrNull(self.currentUser)) {
                        if(self.currentUser == "customer") {
                            let message = self.$helpers.setMessage("danger", "The requested project does not exist", "Dashboard")
                            self.$store.commit("setFlashMessage", message);
                            self.$router.push({name: "UserDashboard"})
                        } else {
                            let message = self.$helpers.setMessage("danger", "The requested project does not exist", "AdminDashboard")
                            self.$store.commit("setFlashMessage", message);
                            self.$router.push({name: "AdminDashboard"})
                        }
                    } else {
                        let message = self.$helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
                        self.$store.commit("setFlashMessage", message);
                        self.$helpers.logOutUser()
                    }
                }
            }).catch((error) => {
                self.$helpers.consoleData("error getting project : "+ error)
            })
            self.currentUser = self.$helpers.getCurrentUser();
            self.calculatePrice()
        },
        methods: {
            checkout() {
                let self = this;
                self.$validator.validateAll().then(valid => {
                    //if validation fails
                    if (!valid) {
                        self.$helpers.consoleData("form Validation Fails while checking out")
                        return false;
                    } else {// form validated
                        self.showLoader = true;
                        if(!self.emptyOrNull(self.currentUser)) {
                            if(self.currentUser.first_name != self.first_name|| self.currentUser.last_name != self.last_name ) {
                                self.updateProjects();
                            }
                            let contact_info = {
                                contact_email:self.email.toLowerCase(),
                                first_name: self.first_name.toLowerCase(),
                                last_name: self.last_name.toLowerCase(),
                                address: self.address,
                                city: self.city,
                                country: self.country ? self.country : "United States",
                                region: self.region,
                                zip_code: self.zip_code,
                                phone_no: self.phone_no,
                                date_updated: new Date()
                            }
                            let name = self.first_name.toLowerCase() + " " + self.last_name.toLowerCase();
                            contact_info["name_terms"]  =  self.getStringTerms(name);
                            contact_info["email_terms"]  =  self.getStringTerms(self.email.toLowerCase());
                            fb.usersCollection.doc(self.currentUser.uid).update(contact_info).then(() =>  {
                                self.$helpers.consoleData("user contact information saved.")
                                if(!self.emptyOrNull(self.currentUser)) {
                                    self.refreshCurrentUser(self.currentUser.uid);
                                }
                                let ordered_data = self.setObject();
                                ordered_data["north_caroline_tax"] = self.north_caroline_tax;
                                ordered_data["united_states_tax"]  = self.united_states_tax;
                                ordered_data["product_title"] = self.selectedProduct.title;
                                ordered_data["projectId"] = self.projectId;
                                ordered_data["shareCode"] = self.shareCode;
                                ordered_data["set_base_price"] = self.set_base_price;
                                ordered_data["base_price"] = self.base_price;
                                ordered_data["include_base_price"] = self.include_base_price;
                                ordered_data["selected_product_price"] = self.selectedProduct.price;
                                ordered_data["project_title"] = self.project.title;
                                ordered_data["project_photos_count"] = self.project.total_photos;
                                ordered_data["product_id"] = self.selectedProduct.id;
                                let encryptOrderData = self.AES.encrypt(JSON.stringify(ordered_data), self.envKeys.order_encryption_key);
                                self.$cookies.set("order_info", encryptOrderData.toString(), "15MIN");
                                self.showLoader = false;
                                self.$router.push({
                                    name:'Checkout',
                                    params:{projectId: self.projectId, shareCode:self.shareCode}
                                });
                            }).catch((error) => {
                                self.showLoader = false;
                                self.$helpers.consoleData("error saving user contact information :" + error)
                            })
                        } else {
                            self.simpleAlert({
                                type:"error",
                                text: "Please login or sign up before checkout"
                            });
                            self.showLoader = false;
                        }


                    }
                });
            },
            checkCoupon(btnClicked='no', showSuccessAlert=true){
                let self = this;
                self.applied_coupon = null;
                self.total_discount = 0.00;
                if(btnClicked == 'yes') {
                    if(self.emptyOrNull(self.currentUser)) {
                        self.simpleAlert({
                            type: "error",
                            text: "Please login or sign up first to apply coupon"
                        })
                        return false;
                    }
                    if(!self.discount_code) {
                        self.simpleAlert({
                            type:'error',
                            title:'Coupon Code Missing',
                            text:"Please type coupon code and then click to apply."
                        })
                        self.calculatePrice();
                        return false;
                    }
                }
                let discount_code = self.discount_code;
                if(self.discount_code) {
                    self.showLoader = true;
                    fb.couponsCollection.where("code", "==", discount_code).where("date_deleted", "==", null).get()
                        .then((couponsQuerySnapShot) => {
                        if(couponsQuerySnapShot.docs.length > 0) {
                            let coupon_data = couponsQuerySnapShot.docs[0].data();
                            coupon_data["id"] = couponsQuerySnapShot.docs[0].id;
                            if(coupon_data.status == "Active") {
                                if(coupon_data.coupon_products.length > 0) {
                                    let is_applicable = coupon_data.coupon_products.some((couponProduct) => {
                                        return couponProduct == self.selectedProduct.id
                                    })
                                    if(is_applicable) {
                                        let currentDate = self.$moment().startOf('day');
                                        let m_valid_till = self.$moment(coupon_data.valid_till.toDate())
                                        let coupon_used_by_user = coupon_data.used_by.some((user_id) => user_id == self.currentUser.uid);
                                        if(coupon_used_by_user) {
                                            self.simpleAlert({
                                                type:'error',
                                                title:'Already Used',
                                                text:"Coupon ( "+ self.discount_code+" ) already used."
                                            })
                                            self.removeCoupon();
                                        } else if(coupon_data.used_by.length >= coupon_data.max_use) {
                                            self.simpleAlert({
                                                type:'error',
                                                title:'Max Used',
                                                text:"Coupon ( " + self.discount_code+ " ) max use limit exceeded."
                                            })
                                            self.removeCoupon();
                                        } else if(m_valid_till.diff(currentDate, 'hours') <= 0) {
                                            self.simpleAlert({
                                                type:'error',
                                                title:'Coupon Expired',
                                                text:"Coupon ( " + self.discount_code+ " ) has been expired."
                                            })
                                            self.removeCoupon();
                                        } else {
                                            if(showSuccessAlert) {
                                                self.simpleAlert({
                                                    type:'success',
                                                    title:'Applied',
                                                    text:"Coupon ( " + self.discount_code+ " ) Applied."
                                                })
                                            }
                                            self.applied_coupon = coupon_data;
                                        }
                                    } else {
                                        self.simpleAlert({
                                            type:'error',
                                            title:'Not Applicable',
                                            text:"Coupon ( "+ self.discount_code+" ) can not be used for selected product."
                                        })
                                        self.removeCoupon();
                                    }
                                } else {
                                    self.simpleAlert({
                                        type:'error',
                                        title:'Not Applicable',
                                        text:"Coupon ( "+ self.discount_code+" ) can not be used for selected product."
                                    })
                                    self.removeCoupon();
                                }
                            } else {
                                self.simpleAlert({
                                    type:'error',
                                    title:'Coupon '+coupon_data.status,
                                    text:"Coupon Has Been "+coupon_data.status
                                })
                                self.removeCoupon();
                            }
                        } else {
                            self.simpleAlert({
                                type:'error',
                                title:'Not Found',
                                text:"Coupon ( " + self.discount_code +" ) Does Not Exist."
                            })
                            self.removeCoupon();
                        }
                        self.calculatePrice();
                    }).catch((error) => {
                        self.consoleData("error getting coupon code : " + error);
                    })
                } else {
                    self.calculatePrice();
                }
            },
            setObject(obj= null) {
                let self = this;
                if(obj) {
                    self.email = obj.email;
                    self.first_name = obj.first_name;
                    self.last_name = obj.last_name;
                    self.address = obj.address;
                    self.city = obj.city;
                    self.country = obj.country ? obj.country : "United States";
                    self.region = obj.region;
                    self.zip_code = obj.zip_code;
                    self.phone_no = obj.phone_no;
                    self.quantity = obj.quantity;
                    self.total_price = obj.total_price;
                    self.discount_code = obj.discount_code;
                    self.total_discount = obj.total_discount;
                    self.before_tax_sub_total = self.before_tax_sub_total;
                    self.sub_total = obj.sub_total;
                    self.shipping_method = obj.shipping_method;
                    self.standard_shipping = obj.standard_shipping;
                    self.express_shipping = obj.express_shipping;
                    self.grand_total = obj.grand_total;
                    self.north_caroline_tax = obj.north_caroline_tax;
                    self.united_states_tax = obj.united_states_tax;
                    self.product_title = obj.product_title;
                    self.projectId = obj.projectId;
                    self.shareCode = obj.shareCode;
                    self.express_production = obj.express_production;
                    self.express_production_price = obj.express_production_price;
                } else {
                    let data = {
                        email:self.email,
                        first_name:self.first_name,
                        last_name:self.last_name,
                        address:self.address,
                        city:self.city,
                        country:self.country ? self.country : "United States",
                        region:self.region,
                        zip_code:self.zip_code,
                        phone_no:self.phone_no,
                        quantity:self.quantity,
                        total_price:self.total_price,
                        first_order_check:self.first_order_check,
                        discount_code:self.discount_code,
                        total_discount:self.total_discount,
                        before_tax_sub_total:self.before_tax_sub_total,
                        sub_total:self.sub_total,
                        shipping_method:self.shipping_method,
                        standard_shipping:self.standard_shipping,
                        express_shipping:self.express_shipping,
                        grand_total:self.grand_total,
                        express_production:self.express_production,
                        express_production_price:self.express_production_price
                    }
                    return data;
                }
            },
            calculatePrice(resetCoupon=false) {
                let self =this;
                if(resetCoupon == 'yes') {
                    self.removeCoupon();
                }
                self.first_order_check = false;
                self.showLoader = true;
                self.foundProducts = [];
                self.productsWithMaxQuantity = [];
                self.baseProduct = null;
                self.selectedProduct = null;
                self.north_caroline_tax = ""
                if(isNaN(parseInt(self.quantity)) || !self.quantity || parseInt(self.quantity) <= 0) {
                    self.quantity = 1;
                }
                fb.productsCollection.where("date_deleted", "==", null).get()
                    .then((productsQuerySnapShot) => {
                        /*finding product with maximum quantity starts*/
                        self.getProductsWithMaximumQuantity(productsQuerySnapShot);
                        /*finding product with maximum quantity ends*/
                        productsQuerySnapShot.forEach((productDoc) => {
                            let product = productDoc.data();
                            product["id"] = productDoc.id;
                            let min_range_check = parseInt(product.min_quantity) <= parseInt(self.quantity);
                            let max_range_check = parseInt(product.max_quantity) >= parseInt(self.quantity);
                            if(min_range_check && max_range_check) {
                                self.foundProducts.push(product);
                            }
                            if(product.set_base_price) {
                                self.baseProduct = product;
                                self.base_price = product.price;
                                self.set_base_price = product.set_base_price;
                            }
                        })/*end foreach*/
                        //let selectedProduct = null;
                        if(self.foundProducts.length > 0) {
                            //if user is reordering project. then find product with reorder price
                            if(self.reorder_project) {
                                self.foundProducts.forEach((sProduct) => {
                                    if(sProduct.is_reorder == true) {
                                        self.selectedProduct = sProduct;
                                    }
                                })
                                //if product reorder price is not available then find original product
                                if(self.selectedProduct == null) {
                                    self.foundProducts.forEach((sProduct) => {
                                        if(sProduct.is_reorder == false) {
                                            self.selectedProduct = sProduct;
                                        }
                                    })
                                }
                            } else {
                                //if user ordering prodect for first time then find original product
                                self.foundProducts.forEach((sProduct) => {
                                    if(sProduct.is_reorder == false) {
                                        self.selectedProduct = sProduct;
                                    }
                                })
                            }
                        }
                        //if product not found within selected quantity then select product with maximum quantity
                        if(self.selectedProduct == null) {
                            //if user is reordering project. then find product having maximum quantity and reorder price
                            if(self.reorder_project) {
                                self.productsWithMaxQuantity.forEach((maxQuantityProduct) => {
                                    if(maxQuantityProduct.is_reorder  == true) {
                                        self.selectedProduct = maxQuantityProduct;
                                    }
                                })
                                //if product having maximum quantity and reorder price is not available then
                                // find original product with maximum quantity
                                if(self.selectedProduct == null) {
                                    self.productsWithMaxQuantity.forEach((maxQuantityProduct) => {
                                        if(maxQuantityProduct.is_reorder  == false) {
                                            self.selectedProduct = maxQuantityProduct;
                                        }
                                    })
                                }
                            } else {
                                //if user not reordering project then find original product with maximum quantity
                                self.productsWithMaxQuantity.forEach((maxQuantityProduct) => {
                                    if(maxQuantityProduct.is_reorder  == false) {
                                        self.selectedProduct = maxQuantityProduct;
                                    }
                                })
                            }
                        }
                        self.product_title = self.selectedProduct.product_title;
                        self.express_production_price = self.selectedProduct.express_production;
                        let total_price = 0;
                        if(self.selectedProduct.include_base_price && self.baseProduct) {
                            self.include_base_price = true;
                            self.express_shipping = self.selectedProduct.express_shipping
                            self.standard_shipping = self.selectedProduct.standard_shipping
                            let total_quantity = JSON.stringify(self.quantity);
                            total_quantity = JSON.parse(total_quantity);
                            total_quantity = parseInt(total_quantity) - 1;
                            total_price = parseFloat(self.selectedProduct.price) * parseInt(total_quantity);
                            total_price = parseFloat(total_price) + parseFloat(self.baseProduct.price);
                        } else {
                            self.include_base_price = false;
                            self.express_shipping = self.selectedProduct.express_shipping
                            self.standard_shipping = self.selectedProduct.standard_shipping
                            total_price = parseFloat(self.selectedProduct.price) * parseInt(self.quantity)
                        }
                        self.mozaix_price = total_price
                        self.total_price = total_price;
                        let shipping_added = false;
                        if(self.applied_coupon) {
                            let coupon_type = self.applied_coupon.type;
                            let coupon_value = self.applied_coupon.value;
                            if(coupon_type == "percent") {
                                let percent = parseFloat(self.applied_coupon.value) / 100;
                                self.total_discount = parseFloat(self.total_price) * parseFloat(percent)
                                self.sub_total = parseFloat(self.total_price) - parseFloat(self.total_discount);
                            } else {
                                self.total_discount = self.applied_coupon.value;
                                self.sub_total = parseFloat(self.total_price) - parseFloat(self.total_discount);
                            }
                        } else {
                            self.sub_total = parseFloat(self.total_price) + parseFloat("0");
                        }
                        let negative_sub_total = 1;
                        if(self.sub_total < 0) {
                            negative_sub_total = JSON.stringify(self.sub_total);
                            negative_sub_total = parseFloat(JSON.parse(self.sub_total));
                            self.sub_total = 0;
                        }
                        if(self.express_production) {
                            self.sub_total = parseFloat(self.express_production_price) + parseFloat(self.sub_total);
                        }
                        self.before_tax_sub_total = JSON.stringify(self.sub_total);
                        self.before_tax_sub_total = parseFloat(JSON.parse(self.sub_total));
                        if(self.region == "North Carolina" && parseFloat(self.sub_total) > 0 ) {
                            let percent = parseFloat(self.sub_total) * (parseFloat('7.25')/parseFloat('100'));
                            self.north_caroline_tax = parseFloat(percent) + 1;
                            self.north_caroline_tax = parseFloat(self.north_caroline_tax) - 1;
                            self.north_caroline_tax = parseFloat(self.north_caroline_tax).toFixed(2);
                            self.sub_total = parseFloat(self.sub_total) + parseFloat(self.north_caroline_tax);
                        }
                        if(self.reorder_project == false && self.quantity == 1 && self.shipping_method == "standard" &&
                            self.standard_shipping && self.standard_shipping > 0 && negative_sub_total < 0) {
                            shipping_added = true;
                            self.total_price = parseFloat(self.standard_shipping) + parseFloat(negative_sub_total);
                            self.first_order_check = true;
                        }
                        if(shipping_added == false) {
                            if(self.shipping_method == "express") {
                                self.grand_total = parseFloat(self.sub_total) + parseFloat(self.express_shipping)
                            } else if(self.shipping_method  == "standard") {
                                self.grand_total = parseFloat(self.sub_total) + parseFloat(self.standard_shipping)
                            } else {
                                self.grand_total = parseFloat(self.sub_total) + parseFloat("0.00")
                            }
                        } else {
                            self.grand_total = parseFloat(self.total_price) + parseFloat(self.sub_total);
                        }
                        self.grand_total = self.grand_total.toFixed(2);
                        if(self.grand_total <=0 ) {
                            self.grand_total = 0.00;
                        }
                        self.showLoader = false;
                    }).catch((error) => {
                        self.showLoader = false;
                        self.consoleData("error calculating price : "+error)
                    })
            },
            checkUser() {
                let self = this;
                if(self.email && self.password) {
                    self.showLoader = true;
                    fb.usersCollection.where("email", "==", self.email.toLowerCase()).get().then((userQuerySnapShot) => {
                        if(userQuerySnapShot.docs.length > 0) {
                            fb.auth.signInWithEmailAndPassword(self.email,self.password)
                                .then(user => {
                                    fb.usersCollection.doc(user.user.uid).get().then((res) => {
                                        let result = res.data();
                                          result = self.$helpers.setUserObject(user.user, result);
                                          result = self.removeColumnsFromUserObject(result)
                                          self.currentUser = result;
                                          self.$store.commit("setCurrentUser", self.currentUser)
                                        if(!self.emptyOrNull(self.currentUser)) {
                                            self.email = self.currentUser.email;
                                            self.first_name = self.currentUser.first_name;
                                            self.last_name = self.currentUser.last_name;
                                            self.address = self.currentUser.address;
                                            self.city = self.currentUser.city;
                                            self.country = self.currentUser.country ? self.currentUser.country : "United States";
                                            self.region = self.currentUser.region;
                                            self.zip_code = self.currentUser.zip_code;
                                            self.phone_no = self.currentUser.phone_no;
                                        }
                                        self.showLoader = false;
                                        self.$swal.fire({
                                            title: "Logged In",
                                            text: "You have been successfully logged in",
                                            type: 'success',
                                            allowOutsideClick: false,
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                self.$eventHub.$emit('login-user');
                                                //self.$router.go();
                                            }
                                        })
                                    })
                                }).catch(error => {
                                self.showLoader = false;
                                self.simpleAlert({
                                    type: "error",
                                    text: "You have entered incorrect password"
                                })
                            });
                        } else {
                            fb.auth
                                .createUserWithEmailAndPassword(self.email, self.password)
                                .then(user => {
                                    let user_personal_info = {
                                        email: self.email.toLowerCase(),
                                        password: self.password,
                                        user_type: "customer",
                                        total_orders: 0,
                                        ordered_projects: [],
                                    }
                                    user_personal_info["email_terms"]  =  self.getStringTerms(self.email.toLowerCase());
                                    fb.usersCollection
                                        .doc(user.user.uid).set(self.$helpers.addTimestamps(user_personal_info))
                                        .then(() => {
                                            let result = self.$helpers.setUserObject(user.user, user_personal_info);
                                            self.currentUser = result;
                                            self.$store.commit("setCurrentUser", self.currentUser)
                                            self.consoleData("User account created.");
                                            self.showLoader = false;
                                            self.$swal.fire({
                                                title: 'Signed up',
                                                text: "Your account has been created. Your password is "+self.password,
                                                type: 'success',
                                                allowOutsideClick: false,
                                                showCancelButton: false,
                                                confirmButtonText: 'OK'
                                            }).then((result) => {
                                                if (result.value) {
                                                    self.$eventHub.$emit('login-user');
                                                    //self.$router.go();
                                                }
                                            })
                                        })
                                        .catch(error => {
                                            self.showLoader = false;
                                            self.consoleData("Error creating user doc : "+error);
                                        });
                                })
                                .catch(error => {
                                    self.showLoader = false;
                                    self.consoleData("error creating user account : "+error);
                                });
                        }
                    }).catch((error) => {
                        self.showLoader = false;
                        self.consoleData("error getting user from email: "+error);
                    })
                }
            },
            validateShareCode() {
                let self = this;
                if(self.shareCode) {
                    fb.projectSharedCollection.where("share_code", "==", self.shareCode).where("date_deleted", "==", null).get()
                        .then((projectSharedInfo) => {
                            if(projectSharedInfo.docs.length > 0) {
                                let sharedProjectInfo = projectSharedInfo.docs[0].data();
                                sharedProjectInfo["id"] = projectSharedInfo.docs[0].id;
                                self.projectSharedInfo = sharedProjectInfo;
                                self.email = self.projectSharedInfo.share_with[0]
                            } else {
                                self.projectSharedInfo = {};
                                self.$router.push({
                                    name: "OpenSharedProject",
                                    params:{
                                        projectId: self.projectId,
                                        shareCode: self.shareCode
                                    }
                                })
                            }
                        }).catch((error) => {
                        self.consoleData("error getting shared code information: " + error);
                    })
                }
            },
            checkQuantity(e) {
                let self = this;
                const key = e.key;
                if(key != "Backspace" && key != "Delete" && key != "ArrowUp" && key != "ArrowDown"
                    && key != "ArrowLeft" && key != "ArrowRight" && key != "Tab" ) {
                    if(isNaN(parseInt(key))) {
                        e.preventDefault();
                    }
                }
            },
            showAddress() {
                let self = this;
                self.$swal({
                    type: "info",
                    html:
                        "<p class='normal'>By choosing in store pick up, your PhotoMozaix will NOT be mailed and you must pick up at retail location:</p>" +
                        "<address class='mt-3 medium text-center'>Create A Video <br>" +
                        "8300 Fairview Road  <br>" +
                        "Mint Hill, NC  28227</address>",
                })
            },
            getOrderInfo() {
                let self = this;
                if(self.$cookies.isKey("order_info")) {
                    let order_info_string  = self.AES.decrypt(self.$cookies.get("order_info"), self.envKeys.order_encryption_key);
                    let order_info_object = JSON.parse(order_info_string.toString(self.UTF8));
                    if(self.projectId == order_info_object.projectId) {
                        self.setObject(order_info_object);
                        if( order_info_object.discount_code) {
                            fb.couponsCollection.where("code", "==", order_info_object.discount_code).where("date_deleted", "==", null).get()
                                .then((couponsQuerySnapShot) => {
                                    if(couponsQuerySnapShot.docs.length > 0) {
                                        let coupon_data = couponsQuerySnapShot.docs[0].data();
                                        coupon_data["id"] = couponsQuerySnapShot.docs[0].id;
                                        self.applied_coupon = coupon_data;
                                    } else {
                                        self.removeCoupon();
                                    }
                                })
                        }
                    } else {
                        self.$cookies.remove("order_info");
                    }
                }
            },
            updateProjects() {
                let self = this;
                self.fb.projectsCollection.where("user", "==", self.currentUser.uid).get().then((projectsQuerySnapShot) => {
                    projectsQuerySnapShot.forEach((projectDoc) => {
                        let name = self.first_name + " " + self.last_name;
                        let name_terms = self.getStringTerms(name);
                        self.fb.projectsCollection.doc(projectDoc.id).update({
                            user_name:name, name_terms:name_terms
                        }).then(() => {
                            self.consoleData("in project user name updated")
                        }).catch((error) => {
                            self.consoleData("error updating user name in projects: "+ error)
                        })
                    })
                }).then(() => {
                    self.consoleData("user projects retrieved")
                }).catch((error) => {
                    self.consoleData("error updating user projects: "+error)
                })
            },
            checkReorderingProject() {
                let self = this;
                self.fb.usersCollection.doc(self.currentUser.uid).get().then((userQuerySnapShot) => {
                    let user_data = userQuerySnapShot.data();
                    user_data["uid"] = userQuerySnapShot.id;
                    //self.currentUser = user_data;
                    self.reorder_project = user_data.ordered_projects.some((ordered_project) => {
                        return ordered_project == self.projectId
                    })
                })
            },
            removeCoupon() {
                let self = this;
                self.discount_code = "";
                self.total_discount = 0.00;
                self.applied_coupon = null;
            },
            getProductsWithMaximumQuantity(productsQuerySnapShot) {
                let self = this;
                let productWithMaxQuantity = null;
                productsQuerySnapShot.forEach((fProductDoc) => {
                    let product = fProductDoc.data();
                    product["id"] = fProductDoc.id;
                    if(productWithMaxQuantity) {
                        if(parseInt(product.max_quantity) >= parseInt(productWithMaxQuantity.max_quantity)) {
                            productWithMaxQuantity = product;
                        }
                    } else {
                        productWithMaxQuantity = product
                    }
                })
                if(productWithMaxQuantity) {
                    productsQuerySnapShot.forEach((fProductDoc) => {
                        let product = fProductDoc.data();
                        product["id"] = fProductDoc.id;
                        if(productWithMaxQuantity.max_quantity == product.max_quantity) {
                            self.productsWithMaxQuantity.push(product);
                        }
                    })
                }
            }
        }
    }
</script>
