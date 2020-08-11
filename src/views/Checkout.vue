<template>
    <div class="checkout">
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <router-link :to="{name:'ProjectOrderPage',params:{projectId:projectId,shareCode:shareCode}}" class="back"><i
                class="fal fa-angle-left"></i> Back to Your Order Page
        </router-link>

        <h1>Checkout</h1>

        <div class="checkoutSections mt-5">
            <div class="columns" v-if="!emptyOrNull(orderInfo)">
                <div class="column is-6 mr-4">
                    <div class="personalInfo">
                        <div class="columns alignFlexCenter">
                            <div class="column is-2">
                                <strong class="semiBold">Contact</strong>
                            </div>

                            <div class="column">
                                <span class="input customInput focusInput">{{orderInfo.email}}</span>
                            </div>
                        </div>

                        <div class="columns alignFlexCenter">
                            <div class="column is-2">
                                <strong class="semiBold">Ship to</strong>
                            </div>

                            <div class="column">
                                <span class="input customInput focusInput">{{orderInfo.address}}</span>
                            </div>
                        </div>

                        <div class="columns alignFlexCenter">
                            <div class="column is-2">
                                <strong class="semiBold">Method</strong>
                            </div>

                            <div class="column">
                            <span class="input customInput focusInput">
                                {{(orderInfo.shipping_method == "self_pick") ? 'STORE PICK UP' : orderInfo.shipping_method+" Shipping" | uppercase}}
                                {{ orderInfo.shipping_method == 'standard' ? orderInfo.standard_shipping :
                                orderInfo.shipping_method == 'express' ? orderInfo.express_shipping : '0.00' | currency }}
                            </span>
                            </div>
                        </div>
                    </div>

                    <template v-if="orderInfo.grand_total > 0">
                        <div class="mt-4 innerHeading">Payment</div>
                        <p>All transactions are secure and encrypted.</p>

                        <div class="innerBoxBordered mt-3">
                            <div class="innerHeading acceptedPayments">Accepted Payment Types</div>
                            <b-form-group label="Billing address same as shipping" class="flexElem mb-2 mt-2" label-for="set_base_price">
                                <b-form-checkbox v-model="same_address" name="same_address" switch style="cursor: pointer; margin-left: 20px"></b-form-checkbox>
                            </b-form-group>
                            <template>
                                <div class="columns is-multiline mt-3">
                                    <div class="column is-12 pb-0">
                                        <div class="innerHeading">
                                            Card Information
                                        </div>
                                    </div>

                                </div>
                                <div class="columns">
                                    <div class="column pt-0">
                                        <b-form-input v-model="name_on_card" name="name_on_card" id="name_on_card"
                                                      placeholder="Name On Card"
                                                      class="input customInput"
                                                      v-validate="'required'"
                                                      :class="[errors.first('name_on_card') ? 'field_error' : '']"
                                        ></b-form-input>
                                        <b-popover v-if="errors.first('name_on_card')" :target="'name_on_card'"
                                                   triggers="hover focus"
                                                   :content="errors.first('name_on_card')"
                                        >
                                        </b-popover>
                                    </div>
                                </div>
                                <div class="columns">
                                    <div class="column pb-0">
                                        <b-form-group label-for="address" invalid-feedback="Address is required">
                                            <b-form-input name="address" v-model="credit_card_info.address" id="address" placeholder="Address"
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
                                            <b-form-input name="city" v-model="credit_card_info.city" id="city" placeholder="City"
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
                                        <b-form-group label-for="country" invalid-feedback="Country is required">
                                            <b-form-select v-model="credit_card_info.country" :options="countries" name="country" id="country" v-validate="'required'"
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
                                            <b-form-select v-model="credit_card_info.region" :options="regions" id="region" v-validate="'required'"
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
                                            <b-form-input name="zip_code" v-model="credit_card_info.zip_code" placeholder="Zip Code" id="zip_code"
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
                            </template>
                            <hr class="medium">
                            <b-alert variant="danger" show v-if="serverErrors.length > 0">
                                <ul>
                                    <li v-for="serverError in serverErrors">{{serverError}}</li>
                                </ul>
                            </b-alert>
                            <div class="columns">
                                <div class="column pb-0">
                                    <label for="credit_card_no">CREDIT CARD NUMBER</label>
                                </div>
                            </div>

                            <div class="columns">
                                <div class="column pt-0">
                                    <b-form-input v-model="credit_card_no" name="credit_card_no" id="credit_card_no"
                                                  placeholder="7777 8888 9999 0000"
                                                  class="input customInput"
                                                  v-validate="'required|max:16'"
                                                  :class="[errors.first('credit_card_no') ? 'field_error' : '']"
                                    ></b-form-input>
                                    <b-popover v-if="errors.first('credit_card_no')" :target="'credit_card_no'"
                                               triggers="hover focus"
                                               :content="errors.first('credit_card_no')"
                                    >
                                    </b-popover>
                                </div>
                            </div>

                            <div class="columns">
                                <div class="column is-6">
                                    <div class="columns">
                                        <div class="column pb-0">
                                            <label for="cvv_code">CVV CODE</label>
                                        </div>
                                    </div>

                                    <div class="columns">
                                        <div class="column pt-0">
                                            <b-form-input v-model="cvv_code" name="cvv_code" id="cvv_code"
                                                          placeholder="777"
                                                          class="input customInput"
                                                          v-validate="'required|numeric|min:3|max:3'"
                                                          :class="[errors.first('cvv_code') ? 'field_error' : '']"
                                            ></b-form-input>
                                            <b-popover v-if="errors.first('cvv_code')" :target="'cvv_code'"
                                                       triggers="hover focus"
                                                       :content="errors.first('cvv_code')"
                                            >
                                            </b-popover>
                                        </div>
                                    </div>
                                </div>

                                <div class="column is-6">
                                    <div class="columns">
                                        <div class="column pb-0">
                                            <label for="card_expiry">Exp Date</label>
                                        </div>
                                    </div>

                                    <div class="columns">
                                        <div class="column pt-0">
                                            <vue-date data-vv-name="card_expiry" v-model="card_expiry" id="card_expiry" v-validate="'required'"
                                                      :input-class="{'field_error':errors.first('card_expiry'),'input customInput':true}"
                                                      :clear-button="true" :clear-button-icon="'fas fa-times'" placeholder="Select Date"
                                                      :disabled-dates="datepicker.disabledDates" :format="customFormatter" :minimum-view="'month'"></vue-date>
                                            <b-popover v-if="errors.first('card_expiry')" :target="'card_expiry'"
                                                       triggers="hover focus"
                                                       :content="errors.first('card_expiry')"
                                            >
                                            </b-popover>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="column is-6 ml-4">
                    <div class="columns is-multiline is-mobile alignFlexCenter">
                        <div class="column mt-4">
                            <div class="innerHeading">{{orderInfo.product_title | capitalize }}</div>
                        </div>

                        <div class="column mt-4 text-right">
                            <div class="innerHeading">
                                {{orderInfo.first_order_check ? orderInfo.base_price  : orderInfo.total_price | currency}}
                            </div>
                        </div>
                    </div>

                    <template v-if="(orderInfo.quantity > 1 && orderInfo.quantity < 10) && orderInfo.set_base_price && orderInfo.include_base_price">
                        <hr class="medium mt-0 mb-0">
                        <div style="text-align: center; margin-bottom: 15px">
                            <div class="columns is-multiline noTextBreak" style="display: inline-flex">
                                <div class="column is-full">
                                    <div class="columns is-multiline is-mobile alignFlexCenter">
                                        <div class="column mt-4">
                                            <div class="innerHeading">{{"1st Mozaix" }}</div>
                                        </div>

                                        <div class="column mt-4">
                                            <div class="innerHeading">{{"1 X $" + orderInfo.base_price}}</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="column is-full">
                                    <template v-if="orderInfo.quantity > 1">
                                        <div class="columns is-multiline is-mobile alignFlexCenter">
                                            <div class="column mt-4">
                                                <div class="innerHeading">{{"2 - "+ orderInfo.quantity + " Mozaix"}}</div>
                                            </div>

                                            <div class="column mt-4">
                                                <div class="innerHeading">{{parseInt(orderInfo.quantity) -1 +" X $" + orderInfo.selected_product_price}}</div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <hr class="medium mt-0 mb-0">
                    </template>

                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0" v-if="orderInfo.total_discount > 0">
                        <div class="column mt-4">
                            <div class="innerHeading">Discount</div>
                        </div>

                        <div class="column mt-4 text-right">
                            <div class="innerHeading"><b>-</b>{{orderInfo.total_discount | currency}}</div>
                        </div>
                    </div>

                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0" v-if="orderInfo.express_production">
                        <div class="column mt-4">
                            <div class="innerHeading">Express Production</div>
                        </div>

                        <div class="column mt-4 text-right">
                            <div class="innerHeading">{{orderInfo.express_production_price | currency}}</div>
                        </div>
                    </div>
                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column mt-4">
                            <div class="innerHeading">Subtotal</div>
                        </div>

                        <div class="column mt-4 text-right">
                            <div class="innerHeading">{{orderInfo.before_tax_sub_total | currency}}</div>
                        </div>
                    </div>
                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column mt-4">
                            <div class="innerHeading">
                                <template v-if="orderInfo.north_caroline_tax">Tax (7.25%)</template>
                                <template v-if="orderInfo.united_states_tax">Tax (7.50%)</template>
                            </div>
                        </div>

                        <div class="column mt-4 text-right">
                            <div class="innerHeading">
                                <template v-if="orderInfo.north_caroline_tax"> {{orderInfo.north_caroline_tax | currency}}</template>
                                <template v-if="orderInfo.united_states_tax"> {{orderInfo.united_states_tax | currency}}</template>
                            </div>
                        </div>
                    </div>
                    <!--<hr class="medium mt-0 mb-0">-->

                    <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                        <div class="column ">
                            <div class="innerHeading">Shipping</div>
                        </div>

                        <div class="column text-right">
                            <div class="innerHeading">
                                {{ orderInfo.shipping_method == 'standard' ? orderInfo.standard_shipping :
                                orderInfo.shipping_method == 'express' ? orderInfo.express_shipping : '0.00'| currency }}
                            </div>
                        </div>
                    </div>
                    <hr class="medium">
                    <div class="columns is-multiline is-mobile mt-4 alignFlexCenter mb-0">
                        <div class="column ">
                            <div class="innerHeading">Total</div>
                        </div>

                        <div class="column text-right">
                            <div class="innerHeading">
                                <span style="font-size: 1.9rem">{{orderInfo.grand_total | currency}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="columns is-multiline is-mobile mt-3">
                        <div class="column">
                            <button class="customButtonLarge lightColor blockButton" @click="payNow($event)">
                                {{orderInfo.grand_total > 0 ? "Pay " : "Order "}} Now
                            </button>
                        </div>
                    </div>

                    <div class="columns mt-4 mb-0">
                        <div class="column">
                            <div class="innerHeading">
                                Need Help?
                            </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column pt-0">
                            <div class="text-muted">
                                If you need help, Please contact us at (704) 846-5588 and operational hours are M-F/9-5.
                            </div>
                        </div>
                    </div>

                    <div class="columns mt-3 mb-0">
                        <div class="column">
                            <div class="innerHeading">
                                Security
                            </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column pt-0">
                            <div class="text-muted">
                                Photomozaix takes your security to heart. We have been verified by Authorized.Net and
                                secured by GoDaddy.com.
                            </div>
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column">
                            <img src="../assets/authorize.jpg" alt="authorize.net">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const fb = require("../config/firebaseConfig.js");
    import Datepicker from 'vuejs-datepicker';
    export default {
        name: "Checkout",
        props: ["projectId", "shareCode"],
        components: {
            'vue-date':Datepicker
        },
        data() {
            return {
                credit_card_no: "",
                cvv_code: "",
                card_expiry: "",
                name_on_card: "",
                serverErrors: [],
                currentUser:{},
                same_address: false,
                credit_card_info: {
                    address:"",
                    city:"",
                    country:"United States",
                    region:null,
                    zip_code:null,
                },
                orderInfo:null,
                applied_coupon: null,
                datepicker:{
                    disabledDates: {
                        to: new Date()
                    }
                },
                projectSetting: null,
            }
        },
        watch:{
            same_address(newVal, oldVal) {
                let self = this;
                if(newVal == false) {
                    self.name_on_card = "";
                    self.credit_card_info = {
                        address:"",
                        city:"",
                        country:"United States",
                        region:null,
                        zip_code:null,
                    }
                    self.$cookies.remove("same_Address");
                } else {
                    self.name_on_card = self.orderInfo.first_name+" " +self.orderInfo.last_name;
                    self.credit_card_info.address = self.orderInfo.address;
                    self.credit_card_info.city = self.orderInfo.city;
                    setTimeout(() => {
                        self.credit_card_info.region = self.orderInfo.region;
                    },500)
                    self.credit_card_info.zip_code = self.orderInfo.zip_code;
                    self.$cookies.set("same_address", self.same_address, "15MIN");
                }
            }
        },
        created() {
            let self = this;
            self.fb.settingsCollection.get().then(settingQuerySnapShot => {
                if(settingQuerySnapShot.docs.length > 0) {
                    let setting_data = settingQuerySnapShot.docs[0].data();
                    setting_data["id"] = settingQuerySnapShot.docs[0].id;
                    self.projectSetting = setting_data;
                } else {
                    self.consoleData("project setting collection not found")
                    self.$router.push({name: "ProjectOrderPage", params:{
                            projectId: self.projectId
                        }})
                }

            }).then().catch(error => {
                self.consoleData("error getting current order number : "+error)
                self.$router.push({name: "ProjectOrderPage", params:{
                        projectId: self.projectId
                    }})
            })
            self.datepicker.disabledDates.to = self.$moment().endOf('day').subtract(1, 'day').toDate()
            self.removeFlashMessage("Checkout");
            self.currentUser = self.$helpers.getCurrentUser();
            if(self.emptyOrNull(self.currentUser)) {
                let message = self.$helpers.setMessage("success", "Your session has been expired. Please login again.", "Login")
                self.$store.commit("setFlashMessage", message);
                self.$eventHub.$emit('logout-user');
            }
            self.getOrderInfo();

            if(self.$session.has("same_address")) {
                self.same_address = self.$session.get("same_address");
                self.credit_card_info = self.$session.get("credit_card_info");
                self.$session.remove("same_address")
                self.$session.remove("credit_card_info")
            }

            self.validateShareCode();
        },
        methods: {
            payNow(event) {
                let self = this;
                if (self.orderInfo === undefined) {
                    let message = self.$helpers.setMessage("danger", "This transaction has already been completed.", "Dashboard")
                    self.$store.commit("setFlashMessage", message)
                    self.$router.push({name: "UserDashboard"})
                }
                self.$validator.validateAll().then(valid => {
                    //if validation fails
                    if (!valid) {
                        self.$helpers.consoleData("form Validation Fails while checking out")
                        return false;
                    } else {// form validated
                        /*validating coupon starts*/
                        if(self.emptyOrNull(self.currentUser)) {
                            let message = self.$helpers.setMessage("success", "Your session has been expired. Please login again.", "Login")
                            self.$store.commit("setFlashMessage", message);
                            self.$eventHub.$emit('logout-user');
                        }
                        if(self.$cookies.isKey("order_info")) {
                            self.showLoader = true;
                            if(self.orderInfo.discount_code) {
                                fb.couponsCollection.where("code", "==", self.orderInfo.discount_code).where("date_deleted", "==", null).get()
                                    .then((couponsQuerySnapShot) => {
                                        if(couponsQuerySnapShot.docs.length > 0) {
                                            let coupon_data = couponsQuerySnapShot.docs[0].data();
                                            coupon_data["id"] = couponsQuerySnapShot.docs[0].id;
                                            if(coupon_data.status == "Active") {
                                                if(coupon_data.coupon_products.length > 0){
                                                    let is_applicable = coupon_data.coupon_products.some((couponProduct) => {
                                                        return couponProduct == self.orderInfo.product_id
                                                    })
                                                    if(is_applicable) {
                                                        let currentDate = self.$moment().startOf('day');
                                                        let m_valid_till = self.$moment(coupon_data.valid_till.toDate())
                                                        let coupon_used_by_user = coupon_data.used_by.some((user_id) => user_id == self.currentUser.uid);
                                                        if(coupon_used_by_user) {
                                                            let message = "Coupon ( "+ self.orderInfo.discount_code+" ) already used.";
                                                            self.showErrorAndRedirect('Already Used', message);
                                                        } else if(coupon_data.used_by.length >= coupon_data.max_use) {
                                                            let message = "Coupon ( " + self.orderInfo.discount_code+ " ) max use limit exceeded.";
                                                            self.showErrorAndRedirect('Max Used', message);
                                                        } else if(m_valid_till.diff(currentDate, 'hours') <= 0) {
                                                            let message = "Coupon ( " + self.orderInfo.discount_code+ " ) has been expired.";
                                                            self.showErrorAndRedirect('Coupon Expired', message);
                                                        } else {
                                                            self.applied_coupon = coupon_data;
                                                            self.chargeCreditCard();
                                                        }
                                                    } else {
                                                        let message = "Coupon ( "+ self.orderInfo.discount_code+" ) can not be used for selected product.";
                                                        self.showErrorAndRedirect('Not Applicable', message);
                                                    }
                                                } else {
                                                    let message = "Coupon ( "+ self.orderInfo.discount_code+" ) can not be used for selected product.";
                                                    self.showErrorAndRedirect("Not Applicable", message);
                                                }
                                            } else {
                                                let title = 'Coupon '+coupon_data.status;
                                                let message = "Coupon Has Status "+coupon_data.status;
                                                self.showErrorAndRedirect(title, message);
                                            }
                                        } else {
                                            let message = "The Coupon ( " + self.orderInfo.discount_code +" ) Does Not Exist. Please Try Another";
                                            self.showErrorAndRedirect("Not Found", message);
                                        }
                                    }).catch((error) => {
                                    self.consoleData("error getting coupon code : " + error);
                                })
                            }
                            else {
                                self.chargeCreditCard();
                            }
                        } else {
                            let message = self.$helpers.setMessage("danger", "Your session has been expired. Please Order Again.", "ProjectOrderPage")
                            self.$store.commit("setFlashMessage", message)
                            self.$router.push({name: "ProjectOrderPage", params:{
                                    projectId: self.projectId,
                                    shareCode:self.shareCode
                                }})
                        }

                    }
                });
            },
            setObject() {
                let self = this;
                let shipping_charges = 0;
                if(self.orderInfo.shipping_method == "express") {
                    shipping_charges = self.orderInfo.express_shipping;
                } else if(self.orderInfo.shipping_method  == "standard") {
                    shipping_charges = self.orderInfo.standard_shipping;
                }
                let express_production_price = 0;
                if(self.orderInfo.express_production) {
                    express_production_price = self.orderInfo.express_production_price;
                }
                let data = {
                    user_uid: self.currentUser.uid,
                    project_id: self.orderInfo.projectId,
                    project_title: self.orderInfo.project_title,
                    project_photos_count: self.orderInfo.project_photos_count,
                    order_email: self.orderInfo.email,
                    first_name: self.orderInfo.first_name,
                    last_name: self.orderInfo.last_name,
                    address: self.orderInfo.address,
                    city: self.orderInfo.city,
                    country: self.orderInfo.country,
                    region: self.orderInfo.region,
                    zip_code: self.orderInfo.zip_code,
                    phone_no: self.orderInfo.phone_no,
                    quantity: self.orderInfo.quantity,
                    total_price: self.orderInfo.total_price,
                    discount_code: self.orderInfo.discount_code,
                    total_discount: self.orderInfo.total_discount,
                    sub_total: self.orderInfo.sub_total,
                    shipping_method: self.orderInfo.shipping_method,
                    shipping_charges: shipping_charges,
                    grand_total: self.orderInfo.grand_total,
                    express_production: express_production_price,
                    status: "Ordered"
                }
                return data;
            },
            validateShareCode() {
                let self = this;
                if (self.shareCode) {
                    fb.projectSharedCollection.where("share_code", "==", self.shareCode).where("date_deleted", "==", null).get()
                        .then((projectSharedInfo) => {
                            if (projectSharedInfo.docs.length > 0) {
                                let sharedProjectInfo = projectSharedInfo.docs[0].data();
                                sharedProjectInfo["id"] = projectSharedInfo.docs[0].id;
                                self.projectSharedInfo = sharedProjectInfo;
                                self.email = self.projectSharedInfo.share_with
                            } else {
                                self.projectSharedInfo = {};
                                self.$router.push({
                                    name: "OpenSharedProject",
                                    params: {
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
            chargeCreditCard() {
                let self = this;
                let url = process.env.VUE_APP_API_BASE_URL + "charge/credit_card";
                let card_expiry = self.$moment(self.card_expiry).format("MM/YY");
                let data = {
                    credit_card_no: self.credit_card_no,
                    cvv_code: self.cvv_code,
                    card_expiry: card_expiry,
                    amount: self.orderInfo.grand_total
                }
                data["first_name"] = self.orderInfo.first_name;
                data["last_name"] = self.orderInfo.last_name;
                data["address"] = self.credit_card_info.address;
                data["city"] = self.credit_card_info.city;
                data["state"] = self.credit_card_info.region;
                data["zip_code"] = self.credit_card_info.zip_code;
                data["country"] = self.credit_card_info.country;
                if(self.orderInfo.grand_total > 0) {
                    self.$http.post(url, data).then(response => {
                        let response_data = response.body;
                        self.serverErrors = [];
                        if (response_data.success) {
                            self.insertData();
                        } else {
                            if (response_data.code == "400") {
                                self.serverErrors = response_data.errors;
                                self.showLoader = false
                            } else if (response_data.code == "401") {
                                self.showLoader = false;
                                let errorMessage = "Error charging credit card";
                                if(response_data.errors && response_data.errors[0]) {
                                    errorMessage = response_data.errors[0]
                                }
                                self.simpleAlert({
                                    type: "error",
                                    title: response_data.message,
                                    text: errorMessage,
                                });
                            }
                        }

                    }, response => {
                        // error callback
                    });
                } else {
                    self.insertData();
                }
            },
            insertData() {
                let self = this;
                // let batch = fb.db.batch();
                let order_data = self.setObject();
                order_data["collage_uploaded"] = false;
                order_data["email_terms"] = self.getStringTerms(self.orderInfo.email);
                order_data["product_id"] = self.orderInfo.product_id;
                order_data["order_no"] = (self.projectSetting ? parseInt(self.projectSetting.last_order_no) : 1) + 1;
                order_data["comment"] = "";
                order_data["tracking_number"] = "";

                order_data = self.$helpers.addTimestamps(order_data);
                //add order info starts
                self.fb.ordersCollection.add(order_data).then((addedDoc) => {
                    const increment_last_order_no = self.fb.firestore.FieldValue.increment(1);
                    self.fb.settingsCollection.doc(self.projectSetting.id).update({
                        last_order_no: increment_last_order_no
                    })
                    //add order id column starts
                    self.fb.ordersCollection.doc(addedDoc.id).update({
                        order_id: addedDoc.id.toLowerCase()
                    }).then(() => {
                        self.consoleData("order id added in order object")
                        //sending new order email starts
                        self.$helpers.consoleData("Order Info Added");

                        let url = process.env.VUE_APP_API_BASE_URL + "new/order/email";
                        let newOrderData = {
                            order_id: addedDoc.id,
                            order_no: (self.projectSetting ? parseInt(self.projectSetting.last_order_no) : 1) + 1,
                            quantity:self.orderInfo.quantity,
                            order_total:self.orderInfo.grand_total,
                            address:self.orderInfo.address,
                            country:self.orderInfo.country,
                            city:self.orderInfo.city,
                            state:self.orderInfo.region,
                            zip_code:self.orderInfo.zip_code,
                            name:self.orderInfo.first_name + " "+ self.orderInfo.last_name,
                            email:self.orderInfo.email,
                            order_link: process.env.VUE_APP_BASE_URL+"admin/order/"+addedDoc.id+"/detail",
                            front_base_url: window.location.origin
                        }
                        self.$http.post(url, newOrderData).then(response => {
                            let response_data = response.body;
                        }, response => {
                            // error callback
                        });
                        //sending new order email ends
                        // updating users collection start
                        const increment = self.fb.firestore.FieldValue.increment(1);
                        const project_id = self.fb.firestore.FieldValue.arrayUnion(self.orderInfo.projectId);
                        self.fb.usersCollection.doc(self.currentUser.uid).update({
                            total_orders: increment,
                            ordered_projects: project_id,
                        }).then(() => {
                            self.consoleData("user total orders and ordered projects updated")
                            // update project status and total orders starts
                            fb.projectsCollection.doc(self.projectId).get().then((projectDoc) => {
                                let project_info = projectDoc.data();
                                let total_orders = parseInt(project_info.total_orders) + 1;
                                fb.projectsCollection.doc(self.projectId).update({
                                    status: "Ordered",
                                    total_orders: total_orders
                                }).then(() => {
                                    self.$helpers.consoleData("Project status with total orders updated")
                                    if(self.applied_coupon || self.shareCode) {
                                      if(self.applied_coupon && self.shareCode) {
                                          //update coupon collection starts
                                          fb.couponsCollection.doc(self.applied_coupon.id).update({
                                              used_by: fb.firestore.FieldValue.arrayUnion(self.currentUser.uid)
                                          }).then(() => {
                                              self.$helpers.consoleData("Updated coupon code used by field")
                                              //update sharedProject collection starts
                                              fb.projectSharedCollection.where("share_code", "==", self.shareCode).get()
                                                  .then((projectShareCodeSnapShot) => {
                                                      if (projectShareCodeSnapShot.docs.length > 0) {
                                                          let shareDoc = projectShareCodeSnapShot.docs[0];
                                                          fb.projectSharedCollection.doc(shareDoc.id).update({
                                                              used: true,
                                                              date_updated: new Date()
                                                          }).then(() => {
                                                              self.consoleData("project shared collection updated")
                                                              self.afterOrderCompleted();
                                                          }).catch((error) => {
                                                              self.consoleData("error updating share code : " + error);
                                                              self.showLoader = false
                                                          })
                                                      } else {
                                                          self.afterOrderCompleted();
                                                      }
                                                  }).catch((error) => {
                                                  self.consoleData("error getting share code doc: " + error);
                                                  self.showLoader = false
                                              })
                                              //update sharedProject collection ends
                                          }).catch((error) => {
                                              self.$helpers.consoleData("Error updating coupon code used by field: " + error)
                                              self.showLoader = false
                                          })
                                          //update coupon collection ends
                                      }


                                        //update coupon collection starts
                                        if (self.applied_coupon) {
                                            fb.couponsCollection.doc(self.applied_coupon.id).update({
                                                used_by: fb.firestore.FieldValue.arrayUnion(self.currentUser.uid)
                                            }).then(() => {
                                                self.$helpers.consoleData("Updated coupon code used by field")
                                                self.afterOrderCompleted();
                                            }).catch((error) => {
                                                self.$helpers.consoleData("Error updating coupon code used by field: " + error)
                                                self.showLoader = false
                                            })
                                        }
                                        //update coupon collection ends

                                        //update sharedProject collection starts
                                        if (self.shareCode) {
                                            fb.projectSharedCollection.where("share_code", "==", self.shareCode).get()
                                                .then((projectShareCodeSnapShot) => {
                                                    if (projectShareCodeSnapShot.docs.length > 0) {
                                                        let shareDoc = projectShareCodeSnapShot.docs[0];
                                                        let share_with = shareDoc.data().share_with;
                                                    if(Array.isArray(share_with)){
                                                        if(!(share_with.includes(self.currentUser.email))){
                                                            share_with.push(self.currentUser.email)
                                                        }
                                                    }else{
                                                        share_with = [];
                                                        share_with.push(self.currentUser.email);
                                                    }
                                                        fb.projectSharedCollection.doc(shareDoc.id).update({
                                                            used: true,
                                                            date_updated: new Date(),
                                                            share_with: share_with
                                                        }).then(() => {
                                                            self.consoleData("project shared collection updated")
                                                            self.afterOrderCompleted();
                                                        }).catch((error) => {
                                                            self.consoleData("error updating share code : " + error);
                                                            self.showLoader = false
                                                        })
                                                    } else {
                                                        self.afterOrderCompleted();
                                                    }
                                                }).catch((error) => {
                                                self.consoleData("error getting share code doc: " + error);
                                                self.showLoader = false
                                            })
                                        }
                                        //update sharedProject collection ends

                                     //shah
                                    } else {
                                        self.afterOrderCompleted();
                                    }


                                }).catch((error) => {
                                    self.$helpers.consoleData("error updating project status: "+error)
                                })
                            }).catch((error) => {
                                self.$helpers.consoleData("error getting project: " + error)
                                self.showLoader = false
                            })
                        // update project status and total orders ends
                        }).catch((error) => {
                            self.$helpers.consoleData("Error updating user total orders and ordered projects: " + error)
                            self.showLoader = false
                        })
                        // updating users collection ends
                    }).catch((error) => {
                        self.consoleData("error adding order id order object: "+error)
                    })
                    //add order id column ends

                }).catch((error) => {
                    self.$helpers.consoleData("Error adding order info : " + error)
                    self.showLoader = false
                });
                //add order info ends
                // batch.commit().then(function () {
                //     self.$helpers.consoleData("checkout batch completed");
                //     self.showLoader = false;
                //     self.orderInfo = null;
                //     self.$cookies.remove("order_info");
                //     self.$swal.fire({
                //         title: 'Order Placed',
                //         text: "Thank you for creating such a memorable keepsake for you to cherish for a lifetime!",
                //         type: 'success',
                //         allowOutsideClick: false,
                //         showCancelButton: false,
                //         confirmButtonText: 'OK'
                //     }).then((result) => {
                //         if (result.value) {
                //             self.$router.push({name: 'MyOrders'})
                //         }
                //     })
                // });
            },
            getOrderInfo() {
                let self = this;
                if(self.$cookies.isKey("order_info")) {
                    let order_info_string  = self.AES.decrypt(self.$cookies.get("order_info"), self.envKeys.order_encryption_key);
                    let order_info_object = JSON.parse(order_info_string.toString(self.UTF8));
                    if(self.projectId == order_info_object.projectId) {
                        self.orderInfo =  order_info_object;
                    } else {
                        self.$cookies.remove("order_info");
                        let route_params = {
                            projectId: self.projectId
                        };
                        if(self.shareCode) {
                            route_params["shareCode"] = self.shareCode
                        }
                        self.$router.push({
                            name:'ProjectOrderPage',
                            params:{
                                projectId:route_params,
                                shareCode:self.shareCode
                            }
                        });
                    }
                } else {
                    let message = self.$helpers.setMessage("danger", "Your session has been expired. Please Order Again.", "ProjectOrderPage")
                    self.$store.commit("setFlashMessage", message)
                    self.$router.push({name: "ProjectOrderPage", params:{
                        projectId: self.projectId,
                        shareCode:self.shareCode
                    }})
                }
            },
            customFormatter(date) {
                let self = this;
                return self.$moment(date).format('MM/YY');
            },
            afterOrderCompleted() {
                let self = this;
                self.showLoader = false;
                self.orderInfo = null;
                self.$cookies.remove("order_info");
                let message = self.$helpers.setMessage("success",
                    "Thank you for creating such a memorable keepsake for you to cherish for a lifetime!", "MyOrders")
                self.$store.commit("setFlashMessage", message)
                self.$swal.fire({
                    title: 'Order Placed',
                    text: "Thank you for creating such a memorable keepsake for you to cherish for a lifetime!",
                    type: 'success',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        self.$router.push({name: 'MyOrders'})
                    }
                })
            },
            showErrorAndRedirect(title, message) {
                let self = this;
                self.showLoader = false;
                self.orderInfo.discount_code = "";
                self.orderInfo.applied_coupon = null;
                if(self.$cookies.isKey("order_info")) {
                    self.$cookies.remove("order_info");
                    let encryptOrderData = self.AES.encrypt(JSON.stringify(self.orderInfo), self.envKeys.order_encryption_key);
                    self.$cookies.set("order_info", encryptOrderData.toString(), "15MIN");
                }
                self.$swal.fire({
                    type:'error',
                    title:title,
                    text:message,
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        self.$router.push({
                            name:'ProjectOrderPage',
                            params:{
                                projectId:self.projectId,shareCode:self.shareCode}
                        });
                    }
                })
            }
        }
    }
</script>
