<template>
    <div>
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <div class="flexElem panelHeader spaceBetween flexResponsive">
            <div class="panelHeading">
                Customer Detail
            </div>

            <div>
                <span class="go_back_admin" @click="$router.go(-1)" style="cursor: pointer;"><i class="fal fa-angle-left"></i> Go Back
                </span>
            </div>
        </div>

        <div class="panelContent">
            <div class="box mt-5">
                <template v-if="customer_detail">
                    <div class="columns is-multiline customerDetailData">
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>Email:</div>
                                <div>{{customer_detail.email | capitalize}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>Password:</div>
                                <div>{{customer_detail.password}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>First Name:</div>
                                <div>{{customer_detail.first_name | capitalize}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>Last Name:</div>
                                <div>{{customer_detail.last_name | capitalize}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>Address:</div>
                                <div>{{customer_detail.address | capitalize}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>City:</div>
                                <div>{{customer_detail.city | capitalize}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>State:</div>
                                <div>{{customer_detail.region | capitalize}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>Country:</div>
                                <div>{{customer_detail.country | capitalize}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>Zip:</div>
                                <div>{{customer_detail.zip_code}}</div>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="flexElem">
                                <div>Phone No:</div>
                                <div>{{customer_detail.phone_no}}</div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="showLoader == false && customer_detail == null">User detail not available</template>
                <template v-if="showLoader == true && customer_detail == null">Loading..</template>
            </div>
            <div class="table-responsive">
                <table class="themeTable">
                    <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Order #</th>
                        <th>Project Title</th>
                        <th class="text-center">No. of Images</th>
                        <th class="text-center">Quantity</th>
                        <th class="noTextBreak">Ordered Date</th>
                        <th class="noTextBreak">Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(customerOrder, oIdx) in customer_orders">
                        <template v-if="customerOrder.is_order">
                            <td>
                                <router-link :to="{name:'AdminViewProject', params: {projectId: customerOrder.project_id}}"
                                             title="View Project">
                                    {{customerOrder.project_id}}
                                </router-link>
                            </td>
                            <td>
                                {{customerOrder.order_no}}
                            </td>
                            <td>{{customerOrder.project_title | capitalize}}</td>
                            <td class="text-center">{{customerOrder.project_photos_count}}</td>
                            <td class="text-center">{{customerOrder.quantity}}</td>
                            <td class="noTextBreak">{{customerOrder.date_created.toDate()| moment("ddd, Do MMM  YYYY")}}</td>
                            <td class="order-status">
                                <span :class="customerOrder.status == 'Shipped' ? 'completed' : customerOrder.status == 'Ordered' ? 'ordered' : 'printed'">
                                {{customerOrder.status}}
                                </span>
                            </td>
                        </template>
                        <template v-else="">
                            <td>
                                <router-link :to="{name:'AdminViewProject', params: {projectId: customerOrder.project_id}}"
                                             title="View Project">
                                    {{customerOrder.id}}
                                </router-link>
                            </td>
                            <td>
                                N/A
                            </td>
                            <td>{{customerOrder.title | capitalize}}</td>
                            <td class="text-center">{{customerOrder.total_photos}}</td>
                            <td class="text-center">N/A</td>
                            <td class="noTextBreak text-center">N/a</td>
                            <td class="order-status ">
                                <span class="abandoned">
                                    Abandoned
                                </span>
                            </td>
                        </template>

                    </tr>
                    <template v-if="showLoader == false && customer_orders.length <= 0">
                        <tr>
                            <td colspan="8">No Data Exists</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "CustomerDetail",
        props:["customerId"],
        data() {
            return {
                customer_detail:null,
                customer_orders:[],
                shipped_orders:0
            };
        },
        created(){
            let self = this;
            self.getCustomer();
            self.getCustomerOrders();
        },
        methods:{
            getCustomer(){
                let self = this;
                self.fb.usersCollection.doc(self.customerId).get().then((customerQuerySnapShot) => {
                    if(customerQuerySnapShot.exists) {
                        let customer_detail = customerQuerySnapShot.data();
                        customer_detail["id"] = customerQuerySnapShot.id;
                        self.customer_detail = customer_detail;
                        self.showLoader = false;
                    } else {
                        self.showLoader = false;
                        self.$swal.fire({
                            title: 'Not Found',
                            text: "Requested user not found!",
                            type: 'info',
                            allowOutsideClick: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.value) {
                                self.$router.go(-1);
                            }
                        })
                    }
                }).catch((error) => {
                    self.consoleData("error get customer detail: "+error)
                    self.showLoader = false;
                });
            },
            getCustomerOrders(){
                let self = this;
                self.fb.ordersCollection.where("date_deleted", "==", null).where("user_uid", "==", self.customerId).orderBy("date_created", "desc").get().then((ordersQuerySnapShot) => {
                    self.fb.projectsCollection.where("user", "==", self.customerId).where("status", "==", "new").where("date_deleted", "==", null).get()
                        .then((projectsQuerySnapShot) => {
                            ordersQuerySnapShot.forEach((orderDoc) => {
                                let order_data = orderDoc.data();
                                order_data["id"] = orderDoc.id;
                                order_data["is_order"] = true;
                                if(order_data.status == 'Shipped') {
                                    self.shipped_orders = parseInt(self.shipped_orders) + 1;
                                }
                                self.customer_orders.push(order_data);
                            })
                            projectsQuerySnapShot.forEach((projectDoc) => {
                                let project_data = projectDoc.data();
                                project_data["id"] = projectDoc.id;
                                project_data["project_id"] = projectDoc.id;
                                project_data["is_order"] = false;
                                if(project_data.status= "new") {
                                    self.customer_orders.push(project_data);
                                }

                            })
                        }).catch(error => {
                            self.consoleData("error getting abandoned orders: "+ error)
                    })
                }).catch((error) => {
                    self.consoleData("error getting customer orders: "+error)
                });
            }
        }
    }
</script>

<style>
</style>
