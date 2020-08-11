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
        <b-modal ref="addUpdateCouponModal" id="addUpdateCouponModal" :title="updateId ? 'Update Product' : 'Add Product'" :hide-footer="true"
                 @close="modalAction('hide')" no-close-on-esc no-close-on-backdrop>
            <div class="columns is-multiple mt-2 justifyElemBetween">
                <div class="column is-4 pb-0">
                    <b-form-group label="Set Base Price" class="flexElem mb-2 justifyElemBetween" label-for="set_base_price">
                        <b-form-checkbox v-if="updateIndex == '0'" v-model="set_base_price" name="set_base_price" switch></b-form-checkbox>
                        <span v-else="">N/A</span>
                    </b-form-group>

                    <b-form-group label="Include Base Price" class="flexElem mb-2 justifyElemBetween" label-for="include_base_price">
                        <b-form-checkbox v-model="include_base_price" name="include_base_price" switch></b-form-checkbox>
                    </b-form-group>

                    <b-form-group label="Is Reorder" class="flexElem justifyElemBetween" label-for="include_base_price">
                        <span>{{is_reorder ? "Yes" : "No"}}</span>
                    </b-form-group>
                </div>

                <div class="column is-6 pb-0">
                    <b-form-group label="Product Name" label-for="title" invalid-feedback="Title is required">
                        <b-form-input type="text" name="title" id="title" v-model="title" class="input customInput"
                                      v-validate="'required'"
                                      :class="[errors.first('title') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('title')" :target="'title'" triggers="hover focus"
                                   :content="errors.first('title')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>

            <div class="columns is-multiple">
                <div class="column is-6 pb-0">
                    <b-form-group label="Price" label-for="price" invalid-feedback="price is required">
                        <b-form-input type="number" min="1" name="price" id="price" v-model="price" class="input customInput"
                                      v-validate="'required|decimal:2'"
                                      :class="[errors.first('price') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('price')" :target="'price'" triggers="hover focus"
                                   :content="errors.first('price')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
                <div class="column is-6 pb-0">
                    <b-form-group label="Express Production" label-for="express_production" invalid-feedback="Express Production is required">
                        <b-form-input type="number" min="1" name="express_production" id="express_production"
                                      v-model="express_production" class="input customInput"
                                      v-validate="'required|decimal:2'"
                                      :class="[errors.first('express_production') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('express_production')" :target="'express_production'" triggers="hover focus"
                                   :content="errors.first('express_production')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>

            <div class="columns is-multiple">
                <div class="column is-6 pb-0">
                    <b-form-group label="Min Quantity" label-for="min_quantity" invalid-feedback="Min Quantity is required">
                        <b-form-input v-if="updateIndex==null" type="number" min="1" name="min_quantity" @keypress="isInteger"
                                      class="input customInput" :value="min_quantity" disabled>
                        </b-form-input>
                        <template v-else="">
                            <template v-if="updateIndex == '0'">
                                <b-form-input type="number" min="1" name="min_quantity" id="min_quantity"
                                              v-model="min_quantity" class="input customInput"
                                              @keypress="isInteger" disabled
                                              :class="[errors.first('min_quantity') ? 'field_error' : '']"
                                ></b-form-input>
                            </template>
                            <template v-else="">
                                <b-form-input type="number" min="1" name="min_quantity" id="min_quantity"
                                              v-model="min_quantity" class="input customInput"
                                              :disabled="is_reorder ? true : false"
                                              v-validate="'required|numeric|min:1'" @keypress="isInteger"
                                              :class="[errors.first('min_quantity') ? 'field_error' : '']"
                                ></b-form-input>
                            </template>
                            <b-popover v-if="errors.first('min_quantity')" :target="'min_quantity'" triggers="hover focus"
                                       :content="errors.first('min_quantity')"
                            >
                            </b-popover>
                        </template>
                    </b-form-group>
                </div>
                <div class="column is-6 pb-0">
                    <b-form-group label="Max Quantity" label-for="max_quantity" invalid-feedback="Mix Quantity is required">
                        <b-form-input type="number" min="1" class="input customInput" name="max_quantity" id="max_quantity"
                                      :disabled="is_reorder ? true : false" v-model="max_quantity" @keypress="isInteger"
                                      v-validate="'required|numeric|min_value:' + max_quantity_min_limit"
                                      :class="[errors.first('max_quantity') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('max_quantity')" :target="'max_quantity'" triggers="hover focus"
                                   :content="errors.first('max_quantity')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>

            <div class="columns is-multiple">
                <div class="column is-6 pb-0">
                    <b-form-group label="Standard Shipping" label-for="standard_shipping" invalid-feedback="Standard Shipping is required">
                        <b-form-input type="number" name="standard_shipping" id="standard_shipping" class="input customInput" v-model="standard_shipping"
                                      v-validate="'required|decimal:2'" :class="[errors.first('standard_shipping') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('standard_shipping')" :target="'standard_shipping'" triggers="hover focus"
                                   :content="errors.first('standard_shipping')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
                <div class="column is-6 pb-0">
                    <b-form-group label="Express Shipping" label-for="express_shipping" invalid-feedback="Express Shipping is required">
                        <b-form-input type="number" name="express_shipping" id="express_shipping" class="input customInput" v-model="express_shipping"
                                      v-validate="'required|decimal:2'" :class="[errors.first('express_shipping') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('express_shipping')" :target="'express_shipping'" triggers="hover focus"
                                   :content="errors.first('express_shipping')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>

            <div class="columns is-multiple text-center">
                <div class="column is-12 btnsContainter">
                    <b-button variant="info" v-if="updateId" @click="updateProduct($event)" class="customButtonMedium width_200 mediumColor" ref="updateBtn">Update</b-button>
                    <b-button variant="info" v-else="" @click="addProduct($event)" class="customButtonMedium width_200 mediumColor" ref="addBtn">Add</b-button>
                    <b-button @click="modalAction('hide')" class="customButtonMedium width_200 lightColor">Cancel</b-button>
                </div>
            </div>
        </b-modal>
        <div class="flexElem panelHeader">
            <div class="flexElem" style="justify-content: space-between">
                <div class="panelHeading">
                    Manage Products
                </div>
            </div>
        </div>

        <div class="flexElem is-size-5 mt-5">
            <span>Title:</span>
            <input type="text" @change="saveTitle" v-model="product_title" class="inputControl"
                    placeholder="Product Title" title="Enter To Save Product Title">
        </div>

        <div class="panelContent">
            <div class="table-responsive" v-dragscroll.x="draggable">
                <table class="themeTable">
                    <thead>
                    <tr>
                        <th>Set Base Price</th>
                        <th>Include Base Price</th>
                        <th class="text-center">Product Name</th>
                        <th class="text-center">Reorder</th>
                        <th class="text-center">Price</th>
                        <th class="text-center">Min Quantity</th>
                        <th class="text-center">Max Quantity</th>
                        <th class="text-center">Express Production</th>
                        <th class="text-center">Standard Shipping</th>
                        <th class="text-center">Express Shipping</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(product, pIdx) in products">
                        <td>
                            <b-form-checkbox name="check-button" v-model="product.set_base_price" switch
                                             v-if="pIdx == '0'" @change="changePriceOption('set_base_price', product.id, pIdx)">
                            </b-form-checkbox>
                            <span v-else="">
                                   N/A
                               </span>
                        </td>
                        <td>
                            <b-form-checkbox name="check-button" v-model="product.include_base_price" switch
                                             @change="changePriceOption('include_base_price', product.id, pIdx)">
                            </b-form-checkbox>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.title | capitalize}}
                             </span>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.is_reorder ? "Yes" : "No"}}
                             </span>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.price | currency}}
                             </span>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.min_quantity}}
                             </span>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.max_quantity}}
                             </span>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.express_production | currency}}
                             </span>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.standard_shipping | currency}}
                             </span>
                        </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{product.express_shipping | currency}}
                             </span>
                        </td>
                        <td>
                            <a href="#!" @click="openUpdateModal(pIdx, product.id)"
                               class="action action_edit" title="Edit Product">&nbsp;</a>
                            <a v-if="product.reorder_created === false && product.is_reorder === false" href="#!"
                               class="action action_add" @click="createReorderObj(pIdx)" title="Create Reorder">&nbsp;</a>

                            <template v-if="pIdx == '0'">
                                <a class="action action_delete" title="This Product Can Not Be Deleted" style="cursor: not-allowed">&nbsp;</a>
                            </template>
                            <template v-else="">
                                <a @click="deleteProduct(pIdx, product.id)"
                                   class="action action_delete" title="Delete Product"></a>
                            </template>
                        </td>
                    </tr>
                    <template v-if="showLoader == false && products.length <= 0">
                        <tr>
                            <td colspan="11">No Data Exist</td>
                        </tr>
                    </template>
                    <tr>
                        <td colspan="11" class="text-right">
                            <button @click="modalAction('show', 'button')"  class="actionButton round_big ml-3">
                               +
                            </button>
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script>
    const fb = require("../../../config/firebaseConfig.js");
    import Vue2Filters from 'vue2-filters'
    export default {
        name: "ManageProduct",
        mixins: [Vue2Filters.mixin],
        data() {
            return {
                products:[],
                set_base_price:false,
                include_base_price:false,
                title:"",
                price:"",
                min_quantity:1,
                min_quantity_min_limit:1,
                max_quantity:"",
                max_quantity_min_limit:"",
                standard_shipping:"",
                express_shipping:"",
                product_title:"",
                updateId:null,
                updateIndex:null,
                total_pages:null,
                start_at: null,
                start_after: null,
                per_page: 20,
                express_production: "",
                is_reorder:false,
                reorder_created:false,
                reorder_id:"",
            };
        },
        watch: {
            min_quantity(newVal, old_val) {
                let self = this;
                if(newVal == 1) {
                    self.max_quantity_min_limit = parseInt(newVal);
                } else {
                    self.max_quantity_min_limit = parseInt(newVal) + parseInt('1');
                }
            }
        },
        created() {
            let self = this;
            window.addEventListener('scroll', self.scrollListener);
            self.getProducts();
        },
        methods: {
            scrollListener(){
                let self = this;
                if( self.$helpers.bottomOfWindow() && self.showLoader == false) {
                    self.getProducts();
                }
            },
            getProducts() {
                let self = this;
                let productsRef = fb.productsCollection.where("date_deleted", "==", null);
                productsRef = self.addSearchQuery(productsRef);
                productsRef = productsRef.orderBy("date_created", "asc");
                if (self.start_after) {
                    productsRef = productsRef.startAfter(self.start_after);
                }
                self.showLoader = true;
                productsRef.limit(self.per_page).get().then((productsQuerySnapShot) => {
                    let total_docs = productsQuerySnapShot.docs.length;
                    if (total_docs > 0) {
                        window.addEventListener('scroll', self.scrollListener);
                        self.start_at = productsQuerySnapShot.docs[0];
                        self.start_after = productsQuerySnapShot.docs[total_docs - 1];
                    } else {
                        window.removeEventListener('scroll', self.scrollListener);
                    }
                    let loopCount = 0;
                    productsQuerySnapShot.forEach((product) => {
                        let product_data = product.data();
                        product_data["id"] = product.id
                        self.products.push(product_data);
                        if (loopCount == 0 && product_data.product_title) {
                            self.product_title = product_data.product_title;
                        }
                        loopCount++;
                    })
                    self.products = self.orderBy(self.products,"min_quantity");
                    self.showLoader = false;
                }).catch(function (error) {
                    self.showLoader = false;
                    self.$helpers.consoleData("Error getting products: " + error)
                })
            },
            addProduct(event) {
                let self = this;
                self.$validator.validateAll().then(valid => {
                    //if validation fails
                    if (!valid) {
                        self.$helpers.consoleData("form Validation Fails while adding product")
                        return false;
                    } else {// form validated
                        let data = self.setData();
                        data["is_reorder"] = false;
                        data["reorder_created"] = false;
                        data = self.$helpers.addTimestamps(data);
                        event.target.disabled = true;
                        self.showLoader = true;
                        let docRef = fb.productsCollection.add(data).then((addedDoc) => {
                            data["id"] = addedDoc.id;
                            self.products.push(data);
                            self.products = self.orderBy(self.products,"min_quantity");
                            self.dismissCountDown = self.dismissSecs
                            self.pageMessage  =  "Product Added";
                            self.pageMessageType = "success";
                            self.showLoader = false;
                            self.modalAction("hide");
                        }).catch((error) => {
                            self.showLoader = false;
                            self.$helpers.consoleData("error adding product : " + error)
                        })
                        event.target.disabled = false;
                    }
                });
            },
            setData(object=null) {
                let self = this;
                if(object) {
                     self.set_base_price = object.set_base_price;
                     self.include_base_price = object.include_base_price;
                     self.title = self.$options.filters.capitalize(object.title);
                     self.price = object.price;
                     self.min_quantity = object.min_quantity;
                     self.max_quantity = object.max_quantity;
                     self.standard_shipping = object.standard_shipping;
                     self.express_shipping = object.express_shipping;
                     self.express_production = object.express_production;
                     self.is_reorder = object.is_reorder;
                     self.reorder_created = object.reorder_created;
                     self.reorder_id = object.reorder_id;
                    return object;
                } else {
                    let data = {
                        set_base_price:self.set_base_price,
                        include_base_price:self.include_base_price,
                        title:self.title.toLowerCase(),
                        price:self.price,
                        product_title:self.product_title,
                        min_quantity:self.min_quantity,
                        max_quantity:self.max_quantity,
                        standard_shipping:self.standard_shipping,
                        express_shipping:self.express_shipping,
                        express_production:self.express_production,
                        is_reorder:self.is_reorder,
                        reorder_created:self.reorder_created,
                    }
                    return data;
                }

            },
            changePriceOption(type, product_id, pIdx) {
                let self = this;
                let update_data = {
                    date_updated : new Date()
                }
                if(type == "set_base_price") {
                    let new_val = !self.products[pIdx].set_base_price;
                    update_data["set_base_price"] = new_val;
                    self.fb.productsCollection.doc(product_id).update(update_data).then(() => {
                        self.consoleData("base price set");
                    }).catch((error) => {
                        self.consoleData("error setting base price: "+error);
                    })
                }
                if(type == "include_base_price") {
                    let new_val = !self.products[pIdx].include_base_price;
                    update_data["include_base_price"] = new_val;
                    fb.productsCollection.doc(product_id).update(update_data).then(() => {
                        self.$helpers.consoleData("Product include base price updated");
                    }).catch((error) => {
                        self.products[pIdx].include_base_price = !self.products[pIdx].include_base_price;
                        self.$helpers.consoleData("Product include base price update failed : "+ error);
                    })
                }
            },
            openUpdateModal(pIdx, product_id){
                let self = this;
                let getProduct = self.products[pIdx];
                if(getProduct) {
                    self.setData(getProduct);
                    self.updateId = product_id;
                    self.updateIndex = pIdx;
                    self.modalAction("show");
                }
            },
            updateProduct(event) {
                let self = this;
                let pIdx = self.updateIndex;
                let product_id = self.updateId
                self.$validator.validateAll().then(valid => {
                    //if validation fails
                    if (!valid) {
                        self.$helpers.consoleData("form Validation Fails while updating product")
                        return false;
                    } else {// form validated
                        let product_data = self.setData();
                        product_data["date_updated"] = new Date();
                        self.showLoader = true;
                        event.target.disabled = true;
                        fb.productsCollection.doc(product_id).update(product_data).then(() => {
                            let updateProduct = self.products[pIdx];
                            updateProduct.set_base_price = product_data.set_base_price;
                            updateProduct.include_base_price = product_data.include_base_price;
                            updateProduct.title = product_data.title;
                            updateProduct.price = product_data.price;
                            updateProduct.min_quantity = product_data.min_quantity;
                            updateProduct.max_quantity = product_data.max_quantity;
                            updateProduct.standard_shipping = product_data.standard_shipping;
                            updateProduct.express_shipping = product_data.express_shipping;
                            updateProduct.express_production = product_data.express_production;
                            self.$helpers.consoleData("product updated");
                            if(self.reorder_created) {
                                fb.productsCollection.doc(self.reorder_id).update({
                                    min_quantity: product_data.min_quantity,
                                    max_quantity: product_data.max_quantity,
                                    date_updated: new Date(),
                                }).then(() => {
                                    self.consoleData("reorder object min and max quantity updated");
                                    self.products.some((sProduct) => {
                                        if(sProduct.id == self.reorder_id) {
                                            sProduct.min_quantity = product_data.min_quantity;
                                            sProduct.max_quantity = product_data.max_quantity;
                                            return true;
                                        }
                                    })
                                    self.dismissCountDown = self.dismissSecs;
                                    self.pageMessage = "Product Updated";
                                    self.pageMessageType = "success";
                                    self.modalAction("hide");
                                    self.showLoader = false;
                                }).catch((error) => {
                                    self.showLoader = false;
                                    self.$helpers.consoleData("error updating reorder object min and max quantity: "+error)
                                })
                            } else {
                                self.dismissCountDown = self.dismissSecs;
                                self.pageMessage = "Product Updated";
                                self.pageMessageType = "success";
                                self.modalAction("hide");
                                self.showLoader = false;
                            }
                        }).catch((error) => {
                            self.showLoader = false;
                            self.$helpers.consoleData("error updating product : "+error)
                        })
                        event.target.disabled = false;
                    }
                });
            },
            deleteProduct(pIdx, product_id) {
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
                        self.showLoader = true;
                        fb.productsCollection.doc(product_id).get().then((productDoc) => {
                            let productData = productDoc.data();
                            fb.productsCollection.doc(product_id).update({
                                date_deleted: new Date(),
                                date_updated: new Date()
                            }).then(function() {
                                self.products.splice(pIdx, 1);
                                self.products = self.orderBy(self.products,"min_quantity");
                                self.$helpers.consoleData("product deleted")
                                self.dismissCountDown = self.dismissSecs;
                                self.pageMessage = "Product Deleted";
                                self.pageMessageType = "success";
                            }).catch(function(error) {
                                self.showLoader = false;
                                self.$helpers.consoleData("error deleting product : "+ error)
                            });
                            if(productData.is_reorder) {
                                self.fb.productsCollection.doc(productData.parent_id).update({
                                    reorder_created: false, date_updated: new Date()
                                }).then(() => {
                                    self.products.some(function (singleProduct) {
                                        if (singleProduct.id == productData.parent_id) {
                                            singleProduct.reorder_created= false;
                                            return true;
                                        }
                                    })
                                    self.showLoader = false;
                                }).catch((error) => {
                                    self.consoleData("error updating reorder_created: "+error);
                                    self.showLoader = false;
                                })
                            } else {
                                self.fb.productsCollection.doc(productData.reorder_id).update({
                                    date_deleted: new Date(),
                                    date_updated: new Date()
                                }).then(() => {
                                    self.products.some(function (singleProduct, spIdx) {
                                        if (singleProduct.id == productData.reorder_id) {
                                            self.products.splice(spIdx, 1);
                                            return true;
                                        }
                                    })
                                    self.products = self.orderBy(self.products,"min_quantity");
                                    self.showLoader = false;
                                }).catch((error) => {
                                    self.consoleData("error updating product in deleting parent product: "+error);
                                    self.showLoader = false;
                                })
                            }
                        }).catch(function(error) {
                            self.showLoader = false;
                            self.$helpers.consoleData("error getting product info : "+ error)
                        });
                    }
                });
            },
            modalAction(action, type=null) {
                let self = this;
                if(action == "show") {
                    let max_quantity = null;
                    if(self.updateIndex == null) {
                        if(self.products.length > 0) {
                            max_quantity = Math.max.apply(Math, self.products.map(function(product) {
                                return product.max_quantity;
                            }))
                        }
                        if(max_quantity) {
                            self.min_quantity = parseInt(max_quantity) + 1;
                        } else {
                            self.min_quantity = 1;
                        }
                    }

                    self.$bvModal.show("addUpdateCouponModal");
                }
                if(action == "hide") {
                    self.$bvModal.hide("addUpdateCouponModal");
                    setTimeout(() => {
                        self.resetObject();
                        self.updateId = null;
                        self.updateIndex = null;
                    },200)

                }

            },
            resetObject() {
                let self = this;
                self.set_base_price =false;
                self.include_base_price = false;
                self.title = "";
                self.price = "";
                self.min_quantity = "";
                self.max_quantity = "";
                self.standard_shipping = "";
                self.express_shipping = "";
                self.express_production = "";
                self.is_reorder = false;
                self.reorder_created = false;
                self.reorder_id = "";
            },
            addSearchQuery(docRef) {
                let self = this;
                if(self.searchPrice){
                    docRef = docRef.where("price", "==", self.searchPrice);
                }
                return docRef;
            },
            search() {
                let self = this;
                self.products = [];
                self.start_at  = null;
                self.start_after  = null;
                self.getProducts();
            },
            saveTitle() {
                let self = this;
                if(self.product_title) {
                    let batch = self.fb.db.batch();
                    self.showLoader = true;
                    fb.productsCollection.where("date_deleted", "==", null).get().then((productsQuerySnapShot) => {
                        productsQuerySnapShot.forEach((productDoc) => {
                            fb.productsCollection.doc(productDoc.id).update({
                               product_title: self.product_title
                            });
                        })
                    })
                    batch.commit().then(function () {
                        self.products.forEach((product, pIdx) => {
                            product.product_title = self.product_title
                        })
                        self.showLoader = false;
                        self.simpleAlert({
                            type: "success",
                            text: "Product title saved"
                        })
                        self.product_title = self.product_title;
                    });

                } else {
                    self.showLoader = false;
                    if(self.products.length > 0) {
                        self.product_title = self.products[0].product_title;
                    }
                    self.simpleAlert({
                        type: "error",
                        text: "Title field can not be empty"
                    })
                }
            },
            createReorderObj(pIdx) {
                let self = this;
                let product = JSON.stringify(self.products[pIdx]);
                product     = JSON.parse(product);
                product["parent_id"] = product.id;
                self.products[pIdx].reorder_created = true;
                delete product.id;
                delete product.reorder_id;
                product["title"] = product.title.toLowerCase() + " reorder";
                product["is_reorder"] = true;
                product["reorder_created"] = false;
                product["date_created"] = new Date();
                product["date_updated"] = new Date();
                self.showLoader = true;
                self.fb.productsCollection.add(product).then((addedDoc) => {
                    product["id"] = addedDoc.id;
                    self.products.push(product);
                    self.products = self.orderBy(self.products,"min_quantity");
                    self.fb.productsCollection.doc(self.products[pIdx].id).update({
                        reorder_created: true, reorder_id: addedDoc.id, date_updated:new Date()
                    }).then((addedDoc) => {
                        self.products[pIdx].reorder_created = true;
                        self.showLoader = false;
                    }).catch(error => {
                        self.showLoader = false;
                        self.products[pIdx].reorder_created = false;
                        self.consoleData("error updating reorder_created column")
                    })
                }).catch(error => {
                    self.showLoader = false;
                    self.products[pIdx].reorder_created = false;
                    self.consoleData("error creating reorder object: "+error)
                })

            }
        }
    }
</script>

<style scoped>

</style>
