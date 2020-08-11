<template>
    <div>
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <b-alert
                :show="dismissCountDown"
                dismissible
                :variant="pageMessageType"
                @dismissed="dismissAlert"
                @dismiss-count-down="countDownChanged"
        >
            {{pageMessage}}
        </b-alert>
        <b-modal ref="addUpdateCouponModal" id="addUpdateCouponModal" :title="updateId ? 'Update Coupon' : 'Add Coupon'" :hide-footer="true"
                 no-close-on-esc no-close-on-backdrop @close="modalAction('hide')"
        >
            <div class="columns is-multiple mt-2">
                <div class="column is-6 pb-0">
                    <b-form-group label="Title" label-for="title" invalid-feedback="Title is required">
                        <b-form-input name="title" id="title" v-model="title" class="input customInput" v-validate="'required'"
                                      :class="[errors.first('title') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('title')" :target="'title'" triggers="hover focus"
                                   :content="errors.first('title')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>

                <div class="column is-6 pb-0">
                    <b-form-group label="Code" label-for="code" invalid-feedback="code is required">
                        <b-form-input name="code" id="code" v-model="code" class="input customInput"
                                      v-if="updateId" disabled
                        ></b-form-input>
                        <b-form-input name="code" id="code" v-model="code" class="input customInput"
                                      v-validate="'required'" v-else=""
                                      :class="[errors.first('code') ? 'field_error' : '']" @change="checkCode"
                        ></b-form-input>
                        <b-popover v-if="errors.first('code')" :target="'code'" triggers="hover focus"
                                   :content="errors.first('code')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>

            <div class="columns is-multiple">
                <div class="column is-6 pb-0">
                    <b-form-group label="Type"  label-for="type" invalid-feedback="Coupon type is required">
                        <b-form-select name="type" id="type" v-model="type" :options="couponTypes" class="input customInput"
                                       v-validate="'required'" :class="[errors.first('type') ? 'field_error' : '']">

                        </b-form-select>
                    </b-form-group>
                    <b-popover v-if="errors.first('type')" :target="'type'" triggers="hover focus"
                               :content="errors.first('type')"
                    >
                    </b-popover>
                </div>

                <div class="column is-6 pb-0">
                    <b-form-group label="Value" label-for="value" invalid-feedback="Coupon value is required">
                        <b-form-input name="value" id="value" v-model="value" class="input customInput" v-validate="'required|decimal:2'"
                                      :class="[errors.first('value') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('value')" :target="'value'" triggers="hover focus"
                                   :content="errors.first('value')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>

            <div class="columns is-multiple">
                <div class="column is-6 pb-0">
                    <b-form-group label="Max Use" label-for="max_use" invalid-feedback="Coupon max_use is required">
                        <b-form-input name="max_use" id="max_use" v-model="max_use" class="input customInput" v-validate="'required|numeric'"
                                      :class="[errors.first('max_use') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('max_use')" :target="'max_use'" triggers="hover focus"
                                   :content="errors.first('max_use')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>

                <div class="column is-6 pb-0">
                    <b-form-group label="Valid Till" label-for="valid_till"
                                  invalid-feedback="Coupon expiry date is required">
                        <vue-date data-vv-name="valid_till" v-model="valid_till" id="valid_till" v-validate="'required'"
                                  :input-class="{'field_error':errors.first('valid_till'),'input customInput':true}"
                                  :disabled-dates="datepicker.disabledDates"></vue-date>
                        <b-popover v-if="errors.first('valid_till')" :target="'valid_till'" triggers="hover focus"
                                   :content="errors.first('valid_till')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>
            <div class="columns is-multiline">
                <div class="column is-6 pb-0" v-for="(product, pIdx) in products">
                        <b-form-group :label="product.title" class="flexElem flexCheckbox" label-for="max_use" invalid-feedback="Coupon max_use is required">
                            <b-form-checkbox name="set_base_price" :value="true" :checked="checkCouponProduct(product.id)" switch
                                     @change="productOptionChanged($event, product.id)"></b-form-checkbox>
                        </b-form-group>
                    </div>
            </div>


            <div class="columns is-multiple text-center">
                <div class="column is-12 btnsContainter">
                    <b-button variant="success" class="customButtonMedium width_200 mediumColor" v-if="updateId"
                              @click="updateCoupon($event)" ref="updateBtn" >Update</b-button>
                    <b-button name="add_btn" variant="info" class="customButtonMedium width_200 mediumColor" v-else="" @click="addCoupon($event)" ref="addBtn">Add</b-button>
                    <b-button class="customButtonMedium width_200 lightColor" @click="modalAction('hide')">Cancel</b-button>
                </div>
            </div>
        </b-modal>
        <div class="flexElem panelHeader flexResponsive">
            <div class="flexElem" style="justify-content: space-between">
                <div class="panelHeading">
                    Coupon Codes
                </div>
                <button v-b-modal.addUpdateCouponModal class="actionButton ml-3">ADD COUPON CODE</button>
                <!--<b-button >Launch demo modal</b-button>-->
            </div>

            <div class="flexElem flexResponsive">
                <div class="hasSearch">
                    <input type="text" autocomplete="nope" v-model="searchCode" class="inputControl searchIcon" @keyup.enter="search('code')" placeholder="Search With Coupon Code">
                    <span class="searchBtn" @click="search('code')"></span>
                </div>
                <vue-date data-vv-name="valid_till" v-model="searchDate"
                          :input-class="'inputControl datepicker calendarIcon'" placeholder="Search With Valid Till Date"
                          :clear-button="true" :clear-button-icon="'fas fa-times'"
                          @input="search('date')"></vue-date>
            </div>
        </div>

        <div class="panelContent">
            <div class="table-responsive">
                <table class="themeTable">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Code</th>
                        <th class="text-center">Type</th>
                        <th class="text-center">Value</th>
                        <th class="text-center">Max Use</th>
                        <th class="text-center">Used</th>
                        <th>Valid Till</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(coupon, cIdx) in coupons">
                        <td>{{coupon.title | capitalize}}</td>
                        <td>{{coupon.code}}</td>
                        <td class="text-center numVal">{{coupon.type == "dollar" ? '$' : '%'}}</td>
                        <td class="text-center numVal">{{coupon.value}}</td>
                        <td class="text-center numVal">{{coupon.max_use}}</td>
                        <td class="text-center numVal">
                            {{(coupon.used_by && coupon.used_by.constructor.name == "Array") ? coupon.used_by.length : '0'}}
                        </td>
                        <td>{{coupon.valid_till.toDate()|  moment("ddd, Do MMM  YYYY")}}</td>
                        <td>
                            <a href="#!" @click="openUpdateModel(coupon.id, cIdx)"
                               class="action action_edit" title="Edit Coupon"></a>
                            <a @click="deleteCoupon(coupon.id, cIdx)"
                               class="action action_delete" title="Delete Coupon"></a>
                        </td>
                    </tr>
                    <template v-if="showLoader == false && coupons.length <= 0">
                        <tr>
                            <td colspan="7">No Data Exist</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>

<script>
    const fb = require("../../../config/firebaseConfig.js");
    import Datepicker from 'vuejs-datepicker';
    export default {
        name: "AdminCouponCode",
        components: {
            'vue-date':Datepicker
        },
        data() {
            return {
                errorMsg: "",
                searchCode:"",
                searchDate:"",
                coupons: [],
                title: "",
                code: "",
                value: "",
                max_use: "",
                valid_till: "",
                type: "dollar",
                couponTypes: [
                    {value: "dollar", text: '$', selected: true},
                    {value: "percent", text: '%'},
                ],
                per_page: 20,
                total_pages: null,
                morePages: false,
                couponRef: "",
                updateId:null,
                updateIndex:null,
                updateCouponObj:null,
                start_at: null,
                start_after: null,
                current_page:1,
                today_date:"",
                datepicker:{
                    disabledDates: {
                        to: new Date()
                    }
                },
                products:[],
                coupon_products:[]
            };
        },
        created() {
            let self = this;
            self.fb.productsCollection.where("date_deleted", "==", null).orderBy("min_quantity").get()
                .then((productsQuerySnapshot) => {
                    let total_docs = productsQuerySnapshot.docs.length;
                    productsQuerySnapshot.forEach((productDoc) => {
                        let product_data = productDoc.data();
                        product_data["id"] = productDoc.id;
                        self.products.push(product_data);
                    })
                })
            window.addEventListener('scroll', self.scrollListener);
            self.datepicker.disabledDates.to = self.$moment().endOf('day').subtract(1, 'day').toDate()
            self.getCoupons();
        },
        methods: {
            scrollListener(){
                let self = this;
                if( self.$helpers.bottomOfWindow() && self.showLoader == false) {
                    self.getCoupons();
                }
            },
            getCoupons() {
                let self = this;
                let couponRef = fb.couponsCollection.where("date_deleted", "==", null);
                couponRef = self.addSearchQuery(couponRef);
                couponRef = couponRef.orderBy("valid_till", "desc");
                if (self.start_after) {
                    couponRef = couponRef.startAfter(self.start_after);
                }
                self.showLoader = true;
                couponRef.limit(self.per_page).get().then(function (couponQuerySnapshot) {
                    let total_docs = couponQuerySnapshot.docs.length;
                    if (total_docs > 0) {
                        window.addEventListener('scroll', self.scrollListener);
                        self.start_at = couponQuerySnapshot.docs[0];
                        self.start_after = couponQuerySnapshot.docs[total_docs - 1];
                    } else {
                        window.removeEventListener('scroll', self.scrollListener);
                    }
                    couponQuerySnapshot.forEach((coupon) => {
                        let coupon_data = coupon.data();
                        coupon_data["id"] = coupon.id
                        self.coupons.push(coupon_data);
                    })
                    self.showLoader = false;
                }).catch(function (error) {
                    self.showLoader = false;
                    self.$helpers.consoleData("Error getting coupons: " + error)
                })
            },
            addCoupon(event) {
                let self = this;
                self.$validator.validateAll().then(valid => {
                    //if validation fails
                    if (!valid) {
                        self.$helpers.consoleData("form Validation Fails while adding coupon")
                        return false;
                    } else {// form validated
                        let coupon_data = self.setData();
                        coupon_data["used_by"] =  [];
                        coupon_data["status"]  =  "Active";
                        coupon_data["code_terms"]  =  self.getStringTerms(coupon_data.code.toLowerCase());
                        coupon_data["title_terms"]  =  self.getStringTerms(coupon_data.title.toLowerCase());
                        coupon_data["coupon_products"]  =  self.coupon_products;
                        coupon_data = self.$helpers.addTimestamps(coupon_data);
                        event.target.disabled = true;
                        self.showLoader = true;
                        if(self.code) {
                            self.fb.couponsCollection.where("code", "==", self.code).where("date_deleted", "==", null)
                                .get().then((couponsQuerySnapShot) => {
                                //self.showLoader = false;
                                if(couponsQuerySnapShot.docs.length > 0) {
                                    self.simpleAlert({
                                        type: "error",
                                        text: "The code ( "+ self.code +" ) has already been used. Please use another code."
                                    })
                                    self.$refs["addBtn"].disabled = false;
                                    self.code = '';
                                } else {
                                    fb.couponsCollection.add(coupon_data).then((addedDoc) => {
                                        coupon_data["id"] = addedDoc.id;
                                        coupon_data.date_created = fb.timestamp.fromDate(coupon_data.date_created);
                                        coupon_data.valid_till = fb.timestamp.fromDate(coupon_data.valid_till);
                                        self.coupons.unshift(coupon_data);
                                        self.showLoader = false;
                                        self.$helpers.consoleData("coupon added");
                                    }).catch((error) => {
                                        self.showLoader = false;
                                        self.$helpers.consoleData("error adding coupon : " + error);
                                    })
                                    self.modalAction("hide");
                                    event.target.disabled = false;
                                }
                                self.showLoader = false;
                            }).catch((error) => {
                                self.showLoader = false;
                                self.consoleData("Error checking code "+error)
                            })
                        } else {
                            fb.couponsCollection.add(coupon_data).then((addedDoc) => {
                                coupon_data["id"] = addedDoc.id;
                                coupon_data.date_created = fb.timestamp.fromDate(coupon_data.date_created);
                                coupon_data.valid_till = fb.timestamp.fromDate(coupon_data.valid_till);
                                self.coupons.unshift(coupon_data);
                                self.showLoader = false;
                                self.$helpers.consoleData("coupon added");
                            }).catch((error) => {
                                self.showLoader = false;
                                self.$helpers.consoleData("error adding coupon : " + error);
                            })
                            self.modalAction("hide");
                            event.target.disabled = false;
                        }
                    }
                });
            },
            modalAction(action) {
                let self = this;
                if(action == "show") {
                    self.$bvModal.show("addUpdateCouponModal");
                }
                if(action == "hide") {
                    self.$bvModal.hide("addUpdateCouponModal")
                    setTimeout(() => {
                        self.resetObject();
                        self.updateId = null;
                        self.updateIndex = null;
                        self.updateCouponObj = null;
                    },100)
                }
            },
            addSearchQuery(docRef) {
                let self = this;
                if(self.searchCode){
                    docRef = docRef.where("code_terms", "array-contains", self.searchCode.toLowerCase());
                }
                if(self.searchDate){
                    let date_obj = self.$helpers.formatDateQuery(self.searchDate);
                    docRef = docRef.where("valid_till", ">=", date_obj.start_date).
                    where("valid_till", "<=", date_obj.end_date);
                }
                return docRef;
            },
            deleteCoupon(coupon_id, index) {
                let self = this;
                this.$swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#c31d8a",
                    cancelButtonColor: "#b9acd2",
                    confirmButtonText: "Yes, delete it!"
                }).then(result => {
                    if (result.value) {
                        fb.couponsCollection.doc(coupon_id).update({
                            date_deleted: new Date(),
                            date_updated: new Date()
                        }).then(function() {
                            self.coupons.splice(index, 1);
                            self.$helpers.consoleData("Coupon deleted");
                            self.dismissCountDown = self.dismissSecs;
                            self.pageMessage = "Coupon Deleted";
                            self.pageMessageType = "success";
                        })
                        .catch(function(error) {
                            self.$helpers.consoleData("error deleting coupon : "+ error)
                        });
                    }
                });
            },
            openUpdateModel(coupon_id, cIdx) {
                let self = this;
                let getCoupon = self.coupons[cIdx];
                if(getCoupon) {
                    self.setData(getCoupon);
                    self.updateId = coupon_id;
                    self.updateCouponObj = getCoupon;
                    self.updateIndex = cIdx;
                    self.coupon_products = JSON.parse((JSON.stringify(getCoupon.coupon_products)));
                    self.modalAction("show");
                }
            },
            updateCoupon(event) {
                let self = this;
                let cIdx = self.updateIndex;
                let coupon_id = self.updateId
                self.$validator.validateAll().then(valid => {
                    //if validation fails
                    if (!valid) {
                        self.$helpers.consoleData("form Validation Fails while updating product")
                        return false;
                    } else {// form validated
                        let coupon_data = self.setData();
                        coupon_data["date_updated"] = new Date();
                        coupon_data["title_terms"]  =  self.getStringTerms(coupon_data.title.toLowerCase());
                        delete coupon_data.code;
                        self.showLoader = true;
                        event.target.disabled = true;
                        let removeColumn = self.fb.firestore.FieldValue.delete();
                        coupon_data["coupon_products"] = removeColumn;
                        coupon_data["coupon_products"] = self.coupon_products;
                        fb.couponsCollection.doc(coupon_id).update(coupon_data).then(() => {
                            self.$helpers.consoleData("product updated");
                            let update_coupon = self.coupons[cIdx];
                            update_coupon.title = coupon_data.title.toLowerCase();
                            update_coupon.type = coupon_data.type;
                            update_coupon.value = coupon_data.value;
                            update_coupon.max_use = coupon_data.max_use;
                            update_coupon.valid_till = fb.timestamp.fromDate(coupon_data.valid_till);
                            let coupon_product_string = JSON.stringify(self.coupon_products);
                            update_coupon["coupon_products"] = JSON.parse(coupon_product_string);
                            self.dismissCountDown = self.dismissSecs;
                            self.pageMessage = "Coupon Updated";
                            self.pageMessageType = "success";
                            self.modalAction("hide");
                            event.target.disabled = false;
                            self.showLoader = false;
                        }).catch((error) => {
                            self.showLoader = false;
                            event.target.disabled = false;
                            self.$helpers.consoleData("error updating Coupon : "+error)
                        })
                    }
                });
            },
            setData(object=null) {
                let self = this;
                if(object) {
                    self.title= self.$options.filters.capitalize(object.title);
                    self.code= object.code;
                    self.type= object.type;
                    self.value= object.value,
                    self.max_use= object.max_use,
                    self.valid_till=  self.$helpers.formatDate(object.valid_till.toDate(), "YYYY-MM-DD")
                    return object;
                } else {
                    let date = new Date(self.valid_till);
                    date.setHours(23,59,59,999);
                    let data = {
                        title: self.title.toLowerCase(),
                        code: self.code,
                        type: self.type,
                        value: self.value,
                        max_use: self.max_use,
                        valid_till: date,
                    }
                    self.$helpers.consoleData("returning data object")
                    return data;
                }

            },
            resetObject() {
                let self = this;
                self.title ="",
                self.code ="",
                self.type ="dollar",
                self.value ="",
                self.max_use ="",
                self.valid_till =""
                self.coupon_products = [];
            },
            search(type) {
                let self = this;
                if(type == "code") {
                    self.searchDate = "";
                }
                if(type == "date") {
                    self.searchCode = "";
                }
                self.coupons = [];
                self.start_at  = null;
                self.start_after  = null;
                self.getCoupons();
            },
            checkCode() {
                let self =  this;
                if(self.code) {
                    self.showLoader = true;
                    self.fb.couponsCollection.where("code", "==", self.code).where("date_deleted", "==", null)
                        .get().then((couponsQuerySnapShot) => {
                        //self.showLoader = false;
                        if(couponsQuerySnapShot.docs.length > 0) {
                            self.showLoader = false;
                            self.simpleAlert({
                                type: "error",
                                text: "The code ( "+ self.code +" ) has already been used. Please use another code."
                            })
                            self.$refs["addBtn"].disabled = false;
                            self.code = '';
                        } else {
                            self.showLoader = false;
                        }
                    }).catch((error) => {
                        self.$refs["addBtn"].disabled = false;
                        self.consoleData("Error checking code "+error)
                    })
                }
            },
            productOptionChanged(event, product_id) {
                let self = this;
                if(event) {
                    self.coupon_products.push(product_id);
                } else {
                    self.coupon_products = self.coupon_products.filter((cProduct) => {
                        return cProduct != product_id;
                    });
                }
            },
            checkCouponProduct(product_id) {
                let self = this;
                //if update id null then user is adding new coupon
                if(self.updateId == null) {
                    return false;
                } else {
                    if(self.updateCouponObj) {
                        let check = self.updateCouponObj.coupon_products.some((cProduct) => {
                            return cProduct == product_id;
                        })
                        return check;
                    } else {
                        return false;
                    }
                }

            }
        }

    }
</script>

<style>

</style>
