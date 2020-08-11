<template>
    <div>
        <b-modal ref="shippedSlipModal" id="shippedSlipModal" :title="'Shipped Detail'" :hide-footer="true"
                 no-close-on-esc no-close-on-backdrop @close="modalAction('hide')" v-if="order"
        >
            <table width="100%" class="printTable">
                <tr class="logoHere" style="background: #442e72">
                    <td colspan="2" style="text-align:center">
                        <img class="printLogoHere" src="@/assets/admin-logo.png" alt="Logo here">
                    </td>
                </tr>
                <tr>
                    <td>Order #</td>
                    <td>{{order.order_no}}</td>
                </tr>
                <tr>
                    <td>Number Of Mozaix</td>
                    <td>{{order.quantity}}</td>
                </tr>
                <tr>
                    <td>Production Method</td>
                    <td class="order-status">
                        <span :class="order.express_production > 0 ? 'ordered' : ''">
                            {{order.express_production > 0 ? 'Express' : 'Standard' | uppercase}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Shipping Method</td>
                    <td class="order-status">
                        <span :class="order.shipping_method == 'self_pick' ? 'store' : (order.shipping_method == 'express' ? 'ordered' : '')">
                            {{(order.shipping_method == "self_pick") ? 'STORE PICK UP (DO NOT MAIL)' : order.shipping_method | uppercase}}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Shipping Name</td>
                    <td>{{order.first_name + " " + order.last_name}}</td>
                </tr>
                <tr>
                    <td>Shipping Address</td>
                    <td>{{order.address}}</td>
                </tr>
                <tr>
                    <td>City</td>
                    <td>{{order.city}}</td>
                </tr>
                <tr>
                    <td>State</td>
                    <td>{{order.region}}</td>
                </tr>
                <tr>
                    <td>Zip Code</td>
                    <td>{{order.zip_code}}</td>
                </tr>
                <tr>
                    <td>Country</td>
                    <td>{{order.country}}</td>
                </tr>
                <tr>
                    <td>Customer Email</td>
                    <td>{{order.order_email}}</td>
                </tr>
                <tr>
                    <td>Customer Phone Number</td>
                    <td>{{order.phone_no}}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <p><p>
                        <p><strong>In case of any issues, Please contact on this Address/Phone number.</strong></p>
                    </td>
                </tr>
                <tr>
                    <td>Contact Information</td>
                    <td>PhotoMozaix 8300 Fairview Rd. Mint Hill, NC 28227 (704) 846-5588</td>
                </tr>
            </table>
            <div class="text-center mt-3">
                <b-button class="customButtonMedium width_200 mediumColor mb-3"
                          ref="updateBtn" @click="printSlip">Print</b-button>
            </div>
        </b-modal>
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <div class="flexElem panelHeader flexResponsive">
            <div class="panelHeading">
                Order Details Page
            </div>
            <div>
                <span class="go_back_admin" @click="$router.go(-1)" style="cursor: pointer;">
                    <i class="fal fa-angle-left"></i> Go Back
                </span>
            </div>
        </div>

        <div class="panelContent">
           <template v-if="order">
               <div class="columns mt-4 is-multiline">
                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Order # / Total Images:</span>
                           </div>
                           <div class="column is-four-fifths">
                               <span>{{order.order_no + " / "+ order.project_photos_count}}</span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Project Title:</span>
                           </div>
                           <div class="column">
                               <span>{{order.project_title}}</span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Coupon Code:</span>
                           </div>
                           <div class="column">
                               <span>{{order.discount_code ? order.discount_code : 'N/A'}}</span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Coupon Discount:</span>
                           </div>
                           <div class="column">
                               <span>{{order.total_discount | currency}}</span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Production:</span>
                           </div>
                           <div class="column order-status">
                               <span :class="order.express_production > 0 ? 'ordered' : ''">
                                   <strong style="color:inherit">{{order.express_production > 0 ? 'Express' : 'Standard' | uppercase}}</strong>
                               </span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Delivery Method:</span>
                           </div>
                           <div class="column order-status">
                       <span :class="order.shipping_method == 'self_pick' ? 'store' : (order.shipping_method == 'express' ? 'ordered': '')">
                           <strong style="color:inherit">
                               {{(order.shipping_method == "self_pick") ? 'STORE PICK UP (DO NOT MAIL)' : order.shipping_method | uppercase}}
                           </strong>
                       </span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Total Paid:</span>
                           </div>
                           <div class="column">
                               <span>{{order.grand_total | currency}}</span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-mobile">
                           <div class="column is-two-fifths">
                               <span style="font-weight: 500;">Packing Slip:</span>
                           </div>
                           <div class="column">
                               <span class="text-primary" @click="modalAction('show')" style="cursor: pointer">Show & Print Slip</span>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-multiline is-mobile">
                           <div class="column is-four-fifths">
                               <span style="font-weight: 500;">Detail</span>
                           </div>
                           <div class="column is-four-fifths">
                               <div class="box bg-light">
                                   <template v-if="!emptyOrNull(selectedProduct)">
                                       <div class="flexElem spaceBetween">
                                           <div>Product:</div>
                                           <div><span>{{selectedProduct.title}}</span></div>
                                       </div>
                                       <hr style="background: rgba(10, 10, 10, 0.1);">
                                       <div class="flexElem spaceBetween">
                                           <div>
                                               <strong>Reorder:</strong>
                                           </div>
                                           <div>
                                               <span>
                                                    <strong>{{selectedProduct.is_reorder ? "Yes" : "No"}}</strong>
                                               </span>
                                           </div>
                                       </div>
                                       <hr style="background: rgba(10, 10, 10, 0.1);">
                                   </template>
                                   <div class="flexElem spaceBetween">
                                       <div>Quantity:</div>
                                       <div><span>{{order.quantity}}</span></div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-multiline is-mobile">
                           <div class="column is-four-fifths">
                               <span style="font-weight: 500;">Admin Comment</span>
                           </div>
                           <div class="column is-four-fifths">
                               <b-form-textarea
                                       class="bg-light"
                                       v-model="order.comment"
                                       placeholder="Add Comment"
                                       rows="8"
                               ></b-form-textarea>
                           </div>
                       </div>
                   </div>

                   <div class="column is-half">
                       <div class="columns is-multiline is-mobile">
                           <div class="column is-four-fifths">
                               <span style="font-weight: 500;">Tracking Number</span>
                           </div>
                           <div class="column is-four-fifths">
                               <b-form-input name="tracking_number" id="Tracking Number" v-model="order.tracking_number"
                                             class="input bg-light customInput"
                               ></b-form-input>
                           </div>
                       </div>
                   </div>
               </div>

               <div class="columns">
                   <div class="column is-12">
                       <b-button name="add_btn" variant="info" class="customButtonMedium width_200 mediumColor" @click="saveInfo">Save</b-button>

                   </div>
               </div>
           </template>
        </div>
    </div>

</template>

<script>
    const fb = require("../../config/firebaseConfig.js");
    export default {
        name: "orderDetail",
        props:["orderId"],
        data() {
            return {
                order: null,
                tracking_number: "",
                comment: "",
                errorMsg:"",
                auth_user:{},
                selectedProduct:{}
            };
        },
        created(){
            let self = this;
            self.getOrderDetail();
        },
        methods: {
            getOrderDetail() {
                let self = this;
                self.showLoader = true;
                let orderRef = self.fb.ordersCollection.doc(self.orderId).get();
                orderRef.then((orderDoc) => {
                    if(orderDoc.exists) {
                        let orderData = orderDoc.data();
                        if(orderData.date_deleted == null) {
                            self.order = orderData;
                            self.order["id"] = orderDoc.id;
                            if(orderData.product_id) {
                                self.fb.productsCollection.doc(orderData.product_id).get().then((productDoc) => {
                                    if(productDoc.exists) {
                                        let product = productDoc.data();
                                        product["id"] = productDoc.id;
                                        self.selectedProduct = product;
                                    }
                                    self.showLoader = false
                                }).catch(error => {
                                    self.consoleData("error getting product info : "+error);
                                    self.showLoader = false;
                                })
                            } else {
                                self.showLoader = false;
                            }
                        } else {
                            self.showLoader = false;
                            self.redirectBack();
                        }
                    } else {
                        self.showLoader = false;
                        self.redirectBack();
                    }
                }).catch(error => {
                    self.consoleData("error getting order detail: "+error);
                    self.showLoader = false;
                })
            },
            redirectBack() {
                let self = this;
                self.$swal.fire({
                    type:'info',
                    title:'Not Found',
                    text:"The requested order not found.",
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        self.$router.go(-1);
                    }
                })
            },
            saveInfo() {
                let self = this;
                self.tracking_number = JSON.parse(JSON.stringify(self.order.tracking_number));
                self.comment = JSON.parse(JSON.stringify(self.order.comment));
                let orderData = {
                    tracking_number: self.tracking_number,
                    comment: self.comment,
                    date_updated: new Date(),
                }
                self.showLoader = true;
                self.fb.ordersCollection.doc(self.orderId).update(orderData).then(() => {
                    self.showLoader = false;
                    self.$swal.fire({
                        type:'success',
                        title:'Updated',
                        text:"The order detail updated successfully",
                        allowOutsideClick: false,
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            //self.$router.go(-1);
                        }
                    }).catch((error) => {
                        self.showLoader = false;
                        self.consoleData("Error updating orderInfo")
                    })
                })

            },
            modalAction(action) {
                let self = this;
                if(action == "show") {
                    self.$bvModal.show("shippedSlipModal");
                }
                if(action == "hide") {
                    self.$bvModal.hide("shippedSlipModal");
                }
            },
            printSlip() {
                let self = this;
                window.print();
            }
        }

    }
</script>

<style>

</style>
