<template>
  <div class="orders">
    <div class="global_loader" v-show="showLoader">
      <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
    </div>
    <template v-if="!showLoader && myOrders.length > 0">
        <b-alert  :show="isFlashMessage('MyOrders')" dismissible @dismissed="dismissAlert"
                  :variant="$store.state.flashMessage.type">
            {{$store.state.flashMessage.message}}
        </b-alert>
      <h1>Your Orders</h1>
      <div class="table-responsive">
        <table class="themeTable cart">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Order Amount</th>
              <th>Discount</th>
              <th>Ordered Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(order, oIdx) in myOrders">
            <td class="order-number">{{order.order_no}}</td>
            <td class="order-number">{{order.grand_total | currency}}</td>
            <td class="order-number">{{order.total_discount | currency}}</td>
            <td class="date-ordered">{{order.date_created.toDate() | moment("ddd, Do MMM  YYYY")}}</td>
            <td class="order-status">
              <span :class="[(order.status == 'Ordered') ? 'ordered' : 'completed']">{{order.status}}</span>
            </td>
          </tr>
          <!--<tr :key="idx" v-for="(o,idx) in orders"><td class="order-number">{{ o.properties.order.orderNumber }}</td><td class="date-ordered">{{ o.dateCompleted }}</td><td class="total-cost">${{ o.properties.order.totalPrice }}</td><td class="order-status"><a :href="o.properties.webUrl" target="_blank">Check Status</a></td><td><router-link :to="{ name: 'project', params: { projectId: o.project.project }}">Order Again</router-link></td></tr>-->
          </tbody>
        </table>
      </div>
    </template>
   <template v-if="!showLoader && myOrders.length <= 0">
     <div class="start-new-project"><p>You haven't ordered anything yet. Let's make something memorable! <router-link to="/dashboard" class="button">Start New Project</router-link></p></div>
   </template>
  </div>
</template>
<script>
const fb = require("../config/firebaseConfig.js");
// const shopify = require("../config/shopifyConfig.js");
export default {
  name: "MyOrders",
  data() {
    return {
      currentUser: {},
      myOrders: [],
      start_at: null,
      start_after: null,
      per_page: 50
    };
  },
  created() {
    let self = this;
    self.currentUser = self.$helpers.getCurrentUser();
    if(self.$helpers.emptyOrNull(self.currentUser)) {
      let message = self.$helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
      self.$store.commit("setFlashMessage", message);
      self.logOutUser();
    }
    window.addEventListener('scroll', self.scrollListener);
    self.getOrders();
  },
  methods:{
    scrollListener(){
      let self = this;
      if( self.$helpers.bottomOfWindow() && self.showLoader == false) {
        self.getOrders();
      }
    },
    getOrders() {
      let self = this;
      self.showLoader = true;
      let ordersRef = self.fb.ordersCollection.where("date_deleted", "==", null)
        .where("user_uid", "==", self.currentUser.uid).orderBy("date_created", "desc");
      if(self.start_after) {
        ordersRef =  ordersRef.startAfter(self.start_after);
      }
        ordersRef.limit(self.per_page).get().then((ordersQuerySnapShot) => {
          let total_docs = ordersQuerySnapShot.docs.length;
          if(total_docs > 0) {
            window.addEventListener('scroll', self.scrollListener);
            self.start_at = ordersQuerySnapShot.docs[0];
            self.start_after = ordersQuerySnapShot.docs[total_docs - 1 ];
          } else {
            window.removeEventListener('scroll', self.scrollListener);
          }
        ordersQuerySnapShot.forEach((orderDoc) => {
          let order_data = orderDoc.data();
          order_data["id"] = orderDoc.id;
          self.myOrders.push(order_data);
        })
        self.showLoader = false;
      }).catch((error) => {
       self.consoleData("error getting orders : "+ error);
          self.showLoader = false;
      })
    }
  }
};
</script>
