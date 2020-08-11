<template>
  <div class="content">
    <div v-if="showPasswordForm" id="passwordForm">
      <h1>Enter Your New Password</h1>
      <form @submit.prevent="updatePassword" id="changePassword" style="max-width: 600px;margin: 0 auto;">
        <div v-if="errorMsg !== ''" class="error-msg">
          <p>{{ errorMsg }}</p>
        </div>
        <div class="control"><input type="password" class="input is-medium" v-model.trim="changePassword.password" placeholder="New Password" required /></div><br>
        <input type="submit" value="Change Password" class="button is-medium" />
      </form>
    </div>
    <div v-else id="backToLogin">
      <h1>Your Password Was Reset</h1>
      <p class="" style="text-align: center;"><a href="/login" class="button">Back to Log In</a></p>
    </div>
  </div>
</template>

<script>
const fb = require("../config/firebaseConfig.js");
export default {
  name: "ResetPassword",
  data: function() {
    return {
      changePassword: {
        password: ""
      },
      errorMsg: "",
      oobCode: "",
      errorMsg: "",
      showPasswordForm: true
    };
  },
  created: function() {
    this.oobCode = this.$route.query.oobCode;
  },
  methods: {
    updatePassword() {
      let password = this.changePassword.password;
      let code = this.oobCode;
      fb.auth.confirmPasswordReset(code, password).then(() => {
        this.showPasswordForm = false
      }).catch(err => {
        this.errorMsg = err.message;
        console.log(err);
      })
    }
  }
};
</script>
