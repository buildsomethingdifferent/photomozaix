<template>
  <div class="orders">
    <h1>Your Orders</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="orders.length > 0">
      <table v-if="orders.length > 0" class="table is-fullwidth cart">
        <tbody>
          <tr><th>Order #</th><th>Date Ordered</th><th>Total Cost</th><th>Order Status</th><th></th></tr>
          <tr :key="idx" v-for="(o,idx) in orders"><td class="order-number">{{ o.properties.order.orderNumber }}</td><td class="date-ordered">{{ o.dateCompleted }}</td><td class="total-cost">${{ o.properties.order.totalPrice }}</td><td class="order-status"><a :href="o.properties.webUrl" target="_blank">Check Status</a></td><td><router-link :to="{ name: 'project', params: { projectId: o.project.project }}">Order Again</router-link></td></tr>
        </tbody>
      </table>
    </div>
    <div class="start-new-project" v-else><p>You haven't ordered anything yet. Let's make something memorable! <router-link to="/dashboard" class="button">Start New Project</router-link></p></div>
  </div>
</template>
<script>
const fb = require("../config/firebaseConfig.js");
// const shopify = require("../config/shopifyConfig.js");
export default {
  name: "Orders",
  data() {
    return {
      loading: { type: Boolean },
      orders: []
    };
  },
  created() {
    this.loading = true;
    const userId = this.$store.state.currentUser.uid;
    fb.ordersCollection
      .where("user", "==", userId)
      .orderBy("date_created", "desc")
      .get()
      .then(snap => {
        const orders = [];
        snap.forEach(doc => {
          shopify.checkout.fetch(doc.id).then(checkout => {
            if (checkout.completedAt) {
              let completedAt = new Date(checkout.completedAt);
              let date = completedAt.getDate();
              let month = completedAt.getMonth(); 
              let year = completedAt.getFullYear();
              completedAt = (month+1) + "/" + date + "/" + year;
              orders.push({ id: doc.id, properties: checkout, dateCompleted: completedAt, project: doc.data() });
            }
          })
        });
        this.orders = orders;
        this.loading = false;
      });
  }
};
</script>
