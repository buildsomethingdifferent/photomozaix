<template>
  <div id="signup">
    <div class="global_loader" v-show="showLoader">
      <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
    </div>
    <h1>Create A New Account</h1>
    <div v-if="errorMsg !== ''" class="error-msg">
      <p>{{ errorMsg }}</p>
    </div>
    <div class="form-wrap">
    <form @submit.prevent="signup">
        <div class="control has-icons-left"><input type="email" class="input is-medium" v-model.trim="signupForm.email" placeholder="Email Address" required /><span class="icon is-small is-left"><i class="fas fa-envelope"></i></span></div>
        <div class="control has-icons-left"><input type="password" class="input is-medium" v-model.trim="signupForm.password" placeholder = "Password" required /><span class="icon is-small is-left"><i class="fas fa-lock"></i></span></div>
        <input class="button" type="submit" value="Sign Up" />
    </form>
    </div>
    <div class="extras">
      <router-link to="/login">Already have an account? Sign In</router-link>
    </div>
  </div>
</template>

<script>
const fb = require("../config/firebaseConfig.js");

export default {
  name: "signup",
  data: function() {
    return {
      signupForm: {
        email: "",
        password: ""
      },
      errorMsg: ""
    };
  },
  methods: {
    signup() {
      let self = this;
      self.showLoader = true;
      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          let user_personal_info = {
            email: self.signupForm.email.toLowerCase(),
            password: this.signupForm.password,
            user_type: "customer",
            total_orders: 0,
            ordered_projects: [],
          }
          user_personal_info["email_terms"]  =  self.getStringTerms(self.signupForm.email.toLowerCase());
          fb.usersCollection
            .doc(user.user.uid).set(self.$helpers.addTimestamps(user_personal_info))
            .then(() => {
              let currentUser = self.$helpers.setUserObject(user.user, user_personal_info);
              currentUser     = self.removeColumnsFromUserObject(currentUser);
              let encryptUserData = self.AES.encrypt(JSON.stringify(currentUser), process.env.VUE_APP_USER_ENCRYPTION_KEY);
              self.$cookies.set("currentUser", encryptUserData.toString(), process.env.VUE_APP_USER_LOGGED_OUT_TIME+"MIN")
              self.$eventHub.$emit('login-user');
              self.showLoader = false;
              self.$router.push("/dashboard");
            })
            .catch(error => {
              self.showLoader = false;
              self.consoleData("error getting user info : "+error);
              self.errorMsg = error.message;
            });
        })
        .catch(error => {
          self.showLoader = false;
          self.consoleData("error creating user: "+error);
          self.errorMsg = error.message;
        });
    }
  }
};
</script>
