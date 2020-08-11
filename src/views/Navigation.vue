<template>
    <nav class="level-right navbar-menu" id="mainNav" :data-test="currentUser.email">
      <ol v-if="!$helpers.emptyOrNull(currentUser)" class="level-item navbar-end">
        <li class="navbar-item"><router-link :to="{name: 'UserDashboard'}">My Projects</router-link></li>
        <li class="navbar-item"><router-link :to="{name: 'SharedWithMe'}">Shared With Me</router-link></li>
        <li class="navbar-item"><router-link :to="{name: 'MyOrders'}">My Orders</router-link></li>
       <!-- <li class="navbar-item secondary-nav"><router-link to="/settings">Account Settings</router-link></li>-->
        <li class="navbar-item secondary-nav"><button @click="logout">Sign Out <i class="demo-icon icon-signout"></i></button></li>
      </ol>
      <ol v-else class="level-item navbar-end">
        <li class="navbar-item"><a href="https://photomozaix.com/inspiration/">Inspiration {{$helpers.emptyOrNull(currentUser.first_name)}}</a></li>
        <li class="navbar-item"><a href="https://photomozaix.com/pricing/">Pricing</a></li>
        <li class="navbar-item"><router-link to="/signup">Order Now</router-link></li>
        <li class="navbar-item"><a href="https://photomozaix.com/contact/">Contact</a></li>
        <li class="navbar-item secondary-nav"><a href="https://photomozaix.com/about/">About</a></li>
        <li class="navbar-item secondary-nav"><a href="https://photomozaix.com/faq/">FAQ</a></li>
        <li class="navbar-item secondary-nav"><router-link to="/login">Log In <i class="demo-icon icon-signin"></i></router-link></li>
      </ol>
    </nav>
</template>
<script>
import { mapState } from "vuex";

const fb = require("../config/firebaseConfig.js");
export default {
  name: "Navigation",
  /*computed: mapState(["currentUser"]),*/
    data() {
        return {
            currentUser:{}
        }
    },
  created() {
      let self = this;
      self.currentUser = self.$helpers.getCurrentUser();
      self.$eventHub.$on('login-user', () => {
        self.currentUser = self.$helpers.getCurrentUser();
      });
      self.$eventHub.$on('logout-user', () => {
        self.currentUser = {};
        self.logOutUser();
      });
  },
  methods: {
    logout() {
      let self = this;
      fb.auth
        .signOut()
        .then(() => {
          let self = this;
          let message = self.$helpers.setMessage("success", "You have successfully logged out", "Login")
          self.$store.commit("setFlashMessage", message);
          self.$eventHub.$emit('logout-user');
        })
        .catch(err => {
          self.consoleData(err);
        });
    }
  },
  mounted() {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    const $navItems = document.querySelectorAll('.navbar-item');
    if ($navbarBurgers.length > 0) {
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
          const target = el.dataset.target;
          const $target = document.getElementById(target);
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
          $navItems.forEach( li => {
            li.addEventListener('click', () => {
              el.classList.remove('is-active');
              $target.classList.remove('is-active');
            })
          })
        });
      });
    }
  }
};
</script>
