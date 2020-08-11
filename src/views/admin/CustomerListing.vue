<template>
    <div>
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <div class="flexElem panelHeader flexResponsive">
            <div class="panelHeading">
                Customers Listing
            </div>

            <div class="flexElem flexResponsive">
                <div class="hasSearch" v-if="customers.length > 0">
                    <download-excel :fetch="fetchCustomers"
                             :export-fields="customerExportableFields" name="CustomersList"
                             :before-generate = "startDownload"
                             :before-finish = "finishDownload">
                        <a href="#" class="action action_excel" title="Export Customers"></a>
                    </download-excel>
                </div>
                <div class="hasSearch" v-if="customers.length > 0">
                    <download-excel  :fetch="fetchCustomerOrders"
                            :data   = "customer_orders" :export-fields="exportableFields" name="CustomerOrdersList"
                             :before-generate = "startDownload"
                             :before-finish = "finishDownload">
                        <a href="#" class="action action_excel" title="Export Customer Orders"></a>
                    </download-excel>
                </div>
                <div class="hasSearch">
                    <input type="text" autocomplete="nope" class="inputControl searchIcon" v-model="search_name" placeholder="Search Name"
                           @keyup.enter="search('search_name')">
                    <span class="searchBtn" @click="search('search_name')"></span>
                </div>
                <div class="hasSearch">
                    <input type="text" autocomplete="nope" class="inputControl searchIcon" v-model="search_email"
                           placeholder="Search Email"
                           @keyup.enter="search('search_email')">
                    <span class="searchBtn" @click="search('search_email')"></span>
                </div>
                <vue-date data-vv-name="search_date" v-model="search_date"
                          :input-class="'inputControl datepicker calendarIcon'" placeholder="Search With Created Date"
                          :clear-button="true" :clear-button-icon="'fas fa-times'" @input="search('search_date')"></vue-date>
            </div>
        </div>

        <div class="panelContent">
            <div class="table-responsive" v-dragscroll.x="draggable">
                <table class="themeTable"> <!--class="themeTable"-->
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone No.</th>
                        <th class="text-center">Projects Started / Projects Ordered</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(customer, cIdx) in customers">
                        <td>
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                                {{customer.email}}
                             </span>
                        </td>
                        <td>
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                                {{customer.first_name ? customer.first_name : "N/A"}}
                            </span>
                        </td>
                        <td>
                             <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{customer.last_name ? customer.last_name : "N/A"}}
                             </span>
                        </td>
                        <td>
                             <span @mouseover="draggable=false" @mouseout="draggable=true">
                                {{customer.phone_no ? customer.phone_no.replace("+1 ", "") : "N/A"}}
                             </span>

                        </td>
                        <td class="text-center">
                             <span @mouseover="draggable=false" @mouseout="draggable=true">
                                {{customer.abandoned_projects+ " / "+customer.ordered_projects}}
                             </span>
                        </td>
                        <td>
                             <span @mouseover="draggable=false" @mouseout="draggable=true">
                                {{customer.date_created.toDate()| moment("ddd, Do MMM  YYYY")}}
                             </span>
                        </td>
                        <td>
                            <router-link :to="{ name: 'CustomerDetail', params: { customerId: customer.id }}"
                                         class="action action_view" title="View Customer Detail">
                            </router-link>
                        </td>

                    </tr>
                    <template v-if="showLoader == false && customers.length <= 0">
                        <tr>
                            <td colspan="7">No Data Exists</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import vue2Dropzone from "vue2-dropzone";
    import Vue2Filters from 'vue2-filters';
    import JsonExcel from 'vue-json-excel'
    export default {
        name: "CustomerListing",
        mixins: [Vue2Filters.mixin],
        components: {
            'vue-date':Datepicker,
            "vueDropzone": vue2Dropzone,
            'download-excel': JsonExcel,
        },
        data() {
            return {
                customers:[],
                per_page: 20,
                start_at: null,
                start_after: null,
                search_name: "",
                search_email: "",
                search_date: "",
                exportableFields: {
                    "Order #": "order_id",
                    "Shipping Name": "complete_name",
                    "Shipping Address": "address",
                    "Phone Number": "phone_no",
                    "Email": "order_email",
                    "Number Of Images": "project_photos_count",
                    "Number Of Mozaix ordered": "quantity",
                    "Project Title": "project_title",
                    "Coupon Code": "discount_code",
                    "Coupon Discount": "total_discount",
                    "Total Price": "grand_total",
                    "Tracking Number": "tracking_number",
                    "Status": "status",
                },
                customerExportableFields: {
                    "First Name": "first_name",
                    "Last Name": "last_name",
                    "Address": "address",
                    "City": "city",
                    "State": "region",
                    "Zip Code": "zip_code",
                    "Email": "email",
                    "Phone": "phone_no",
                    "Created Date": "date_created",
                },
                customer_orders:[],
                customers_export_array:[]
            };
        },
        created(){
            let self = this;
            window.addEventListener('scroll', self.scrollListener);
            self.getCustomers();
        },
        methods:{
            scrollListener(){
                let self = this;
                if( self.$helpers.bottomOfWindow() && self.showLoader == false) {
                    self.getCustomers();
                }
            },
            async getCustomers(){
                let self = this;
                let customersRef = self.fb.usersCollection.where("date_deleted", "==", null);
                customersRef = self.addSearchQuery(customersRef);
                customersRef = customersRef.orderBy("date_created", "desc");
                if(self.start_after) {
                    customersRef =  customersRef.startAfter(self.start_after);
                }
                self.showLoader = true;
                let customersSnapShot = await customersRef.limit(self.per_page).get();
                let total_docs = customersSnapShot.docs.length;
                if(total_docs > 0) {
                    window.addEventListener('scroll', self.scrollListener);
                    self.start_at = customersSnapShot.docs[0];
                    self.start_after = customersSnapShot.docs[total_docs - 1 ];
                    for(let lCount=0; lCount<total_docs; lCount++) {
                        await self.fetchCustomerProjects(customersSnapShot.docs[lCount]);
                    }
                } else {
                    window.removeEventListener('scroll', self.scrollListener);
                }
                self.showLoader = false;
            },
            async fetchCustomerProjects(customerDoc){
                let self = this;
                let customer_data = customerDoc.data();
                customer_data["id"] = customerDoc.id;
                if(customer_data.user_type != "admin") {
                    let projectsRef = self.fb.projectsCollection.where("date_deleted", "==", null).where("user", "==", customerDoc.id);
                    let projectsQuerySnapShot = await projectsRef.get();
                    let total_docs = projectsQuerySnapShot.docs.length;
                    let ordered_projects = 0;
                    let abandoned_projects = 0;
                    if(total_docs > 0) {
                        for(let pCount=0; pCount<total_docs; pCount++) {
                            let project_data = projectsQuerySnapShot.docs[pCount].data();
                            if(project_data.status == 'new') {
                                abandoned_projects = parseInt(abandoned_projects) + 1;
                            }
                            if(project_data.status == 'Ordered') {
                                ordered_projects = parseInt(ordered_projects) + 1;
                            }
                        }
                    }
                    let data = customer_data;
                    data["abandoned_projects"] = abandoned_projects;
                    data["ordered_projects"] = ordered_projects;
                    self.customers.push(data);
                }
            },
            addSearchQuery(customersRef){
                let self = this;
                if(self.search_name){
                    customersRef = customersRef.where("name_terms", "array-contains", self.search_name.toLowerCase());
                }
                if(self.search_email){
                    customersRef = customersRef.where("email_terms", "array-contains", self.search_email.toLowerCase());
                }
                if(self.search_date){
                    let date_obj = self.$helpers.formatDateQuery(self.search_date);
                    customersRef = customersRef.where("date_created", ">=", date_obj.start_date).
                    where("date_created", "<=", date_obj.end_date);
                }
                return customersRef;
            },
            search(type) {
                let self = this;
                if(type == "search_name") {
                    self.search_email = "";
                    self.search_date = ""
                }
                if(type == "search_email") {
                    self.search_name = "";
                    self.search_date = ""
                }
                if(type=="search_date") {
                    self.search_name = ""
                    self.search_email = ""
                }
                self.customers = [];
                self.start_at  = null;
                self.start_after  = null;
                self.getCustomers();
            },
            async fetchCustomerOrders(){
                let self = this;
                for(let c=0; c<self.customers.length; c++) {
                    let ordersRef = self.fb.ordersCollection.where("date_deleted", "==", null)
                        .where("user_uid", "==", self.customers[c].id)
                        .orderBy("date_created", "desc");
                    let activeOrders = await ordersRef.get();
                    activeOrders.forEach((orderR) => {
                        let order = orderR.data();
                        order["id"] = orderR.id
                        order["complete_name"] = order.first_name + " "+ order.last_name;
                        order["total_discount"] = self.$options.filters.currency(order["total_discount"]);
                        order["grand_total"] = self.$options.filters.currency(order["grand_total"]);
                        self.customer_orders.push(order);
                    })
                }
                if(self.customer_orders.length > 0) {
                    return self.customer_orders;
                } else {
                    self.showLoader = false;
                    self.simpleAlert({
                        type: "info",
                        text: "No orders exists to export"
                    })
                }

            },
            startDownload(){
                this.showLoader = true;
            },
            finishDownload(){
                this.showLoader = false;
            },
            fetchCustomers() {
                let self = this;
                let customers_array = [];
                self.customers.forEach((customer, cIdx) => {
                    let data = {};
                    data["first_name"] = customer.first_name ? JSON.parse(JSON.stringify(customer.first_name)): 'N/A';
                    data["last_name"] = customer.last_name ? JSON.parse(JSON.stringify(customer.last_name)): 'N/A';
                    data["address"] = customer.address ? JSON.parse(JSON.stringify(customer.address)): 'N/A';
                    data["city"] = customer.city ? JSON.parse(JSON.stringify(customer.city)): 'N/A';
                    data["region"] = customer.region ? JSON.parse(JSON.stringify(customer.region)): 'N/A';
                    data["zip_code"] = customer.zip_code ? JSON.parse(JSON.stringify(customer.zip_code)): 'N/A';
                    data["email"] = customer.email ? JSON.parse(JSON.stringify(customer.email)): 'N/A';
                    data["phone_no"] = customer.phone_no ? JSON.parse(JSON.stringify(customer.phone_no)).replace("+1 ", "") : 'N/A';
                    let date_created = JSON.stringify(self.$helpers.formatDate(customer.date_created.toDate(), "ddd, Do MMM  YYYY"))
                    data["date_created"] = JSON.parse(date_created);
                    customers_array.push(data);
                })
                return customers_array;
            }
        }
    }
</script>
<style>
</style>
