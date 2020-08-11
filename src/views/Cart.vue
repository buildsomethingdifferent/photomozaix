<template>
  <div class="cart">
    <router-link :to="{ name: 'project', params: { projectId: projects[0].id }}" class="back"><i class="fal fa-angle-left"></i> Back to Your Project</router-link>
    <h1>Select Quantity</h1>
    <div v-if="loading">Loading...</div>
    <table v-if="projects.length > 0" class="table is-fullwidth cart">
      <tbody>
        <tr :key="idx" v-for="(p,idx) in projects"><td class="thumb"><img :src="p.properties.main_thumb_url" width=200 /></td><td>{{ p.properties.title }}</td><td class="quantity"><input type="number" class="input" v-model="itemQuantity" min=1 /></td><td>${{ cartCost }}</td><td><button type="button" @click="updateCheckout()" class="button next">Continue to Checkout <i class="fal fa-angle-right"></i></button><span class="note">Tax &amp; Shipping will be applied at Checkout</span></td></tr>
      </tbody>
    </table>
    <div v-else class="start-new-project"><p>We couldn't find an order associated with your project. <router-link to="/dashboard" class="button">Start New Project</router-link></p></div>
    <h2>Pricing</h2>
    <div class="columns pricing is-variable is-8">
      <div class="column">
        <h3>Single PhotoMozaix</h3>
        <span class="price">$59</span>
        <p>for your first PhotoMozaix poster, plus $10 shipping.</p>
        <img src="../assets/Qty.png" alt="Image of one PhotoMozaix poster."/>
      </div>
      <div class="column">
        <h3>Additional Copies</h3>
        <span class="price">$39</span>
        <p>for each additional copy.</p>
        <img src="../assets/Qty-Copies2.png" alt="Image of two PhotoMozaix posters." />
      </div>
      <div class="column">
        <h3>10 or more Copies</h3>
        <span class="price">$29</span>
        <p>for each, if ordering 10 or more of the same print <em>(including your first print)</em>, plus <strong>free shipping.</strong><br>
        <span class="note">Discounts not applicable.</span></p>
         <img src="../assets/Qty-Copies-10.png" alt="Image of multiple PhotoMozaix posters." />
      </div>
    </div>
  </div>
</template>
<script>
const fb = require("../config/firebaseConfig.js");
// const shopify = require("../config/shopifyConfig.js");
// const variant1 = shopify.productId1;
// const variant1Cost = shopify.product1Cost;
// const variant2 = shopify.productId2;
// const variant2Cost = shopify.product2Cost;
// const variant3 = shopify.productId3;
// const variant3Cost = shopify.product3Cost;
export default {
  name: "cart",
  props: ["checkoutId"],
  data: function() {
    return {
      loading: { type: Boolean },
      mode: "",
      cartCost: "59.00",
      projects: [],
      currentLineItems: [],
      itemQuantity: 1,
      numCheckoutLineItems: 0,
      lineItems: [{ variantId: variant1, quantity: 1 }]
    };
  },
  created() {
    this.loading = true;
    const userId = this.$store.state.currentUser.uid;
    let projectRef = fb.projectsCollection;
    projectRef
      .where("checkout_id", "==", this.checkoutId)
      .where("user", "==", userId)
      .get()
      .then(snap => {
        const projects = [];
        snap.forEach(doc => {
          projects.push({ id: doc.id, properties: doc.data() });
        });
        this.projects = projects;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });

    shopify.checkout.fetch(this.checkoutId).then(checkout => {
      this.numCheckoutLineItems = checkout.lineItems.length;
      const checkoutLineItems = checkout.lineItems;
      const lineItemIdsToRemove = [];
      checkoutLineItems.forEach(lineItem => {
        lineItemIdsToRemove.push(lineItem.id);
      });
      this.currentLineItems = lineItemIdsToRemove;
      console.log(lineItemIdsToRemove);
    });
  },
  methods: {
    updateCheckout() {
      if (this.currentLineItems.length > 0) {
        shopify.checkout
          .removeLineItems(this.checkoutId, this.currentLineItems)
          .then(() => {
            shopify.checkout
              .addLineItems(this.checkoutId, this.lineItems)
              .then(checkout => {
                this.checkout(checkout);
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        shopify.checkout
          .addLineItems(this.checkoutId, this.lineItems)
          .then(checkout => {
            console.log(checkout);
            this.checkout(checkout);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    checkout(checkout) {
      const userId = this.$store.state.currentUser.uid;
      let dateCreated = new Date();
      let webUrl = checkout.webUrl;
      fb.ordersCollection
        .doc(checkout.id).set({
          user: userId,
          project: this.projects[0].id,
          date_created: dateCreated
        })
        .then(docRef => {
          window.location.href = webUrl;
        })
        .catch(err => {
          console.log(err);
          this.errorMsg = 'Could not save project.'
        });
    }
  },
  watch: {
    itemQuantity: function(itemQuantity) {
      let intQuantity = parseInt(itemQuantity, 10);
      if (this.itemQuantity > 1 && intQuantity < 10) {
        let numOfVariant2 = intQuantity - 1;
        let numOfVariant1 = 1;
        let variant1TotalCost = parseFloat(variant1Cost);
        let variant2TotalCost = (
          parseFloat(variant2Cost) * parseFloat(numOfVariant2)
        ).toFixed(2);
        this.cartCost = (
          parseFloat(variant1TotalCost) + parseFloat(variant2TotalCost)
        ).toFixed(2);
        this.lineItems = [
          { variantId: variant1, quantity: numOfVariant1 },
          { variantId: variant2, quantity: numOfVariant2 }
        ];
      } else if (intQuantity >= 10) {
        this.cartCost = (
          parseFloat(variant3Cost) * parseFloat(intQuantity)
        ).toFixed(2);
        this.lineItems = [{ variantId: variant3, quantity: intQuantity }];
      } else {
        this.cartCost = parseFloat(variant1Cost).toFixed(2);
        this.lineItems = [{ variantId: variant1, quantity: 1 }];
      }
    }
  }
};
</script>
