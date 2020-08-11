<template>
  <div class="settings">
    <h1>Manage Your Account</h1>
    <div v-if="errorMsg !== ''" class="error-msg">
      <p>{{ errorMsg }}</p>
    </div>
    <div v-if="showSettingsForm" id="settingsForm">
      <h3>Change Your Password</h3>
      <form @submit.prevent="updatePassword">
        <div class="control"><input type="password" class="input is-medium" v-model.trim="settingsForm.password" placeholder="New Password" required /></div>
        <div class="control"><input type="password" class="input is-medium" v-model.trim="settingsForm.passwordConfirm" placeholder="Confirm New Password" required /></div>
        <input type="submit" value="Change Password" class="button is-medium" />
      </form>
    </div>
    <div v-else id="loginForm">
      <h3>Please confirm your current password.</h3>
      <form @submit.prevent="currentPassword">
        <div class="control"><input type="password" class="input is-medium" v-model.trim="loginForm.password" placeholder = "Current Password" required /></div>
        <input type="submit" value="Confirm" class="button is-medium" />
      </form>
    </div>
  </div>
</template>
<script>
const fb = require("../config/firebaseConfig.js");
export default {
  name: "settings",
  data: function() {
    return {
      settingsForm: {
        password: "",
        passwordConfirm: ""
      },
      loginForm: {
        password: ""
      },
      errorMsg: "",
      newPassword: "",
      showSettingsForm: true,
      showLoginForm: false,
      mode: ""
    };
  },
  created: function() {
    this.mode = this.$route.query.mode;
  },
  methods: {
    requestDelete() {
        this.$swal({
            title: "Are you sure?",
            text: "This will close your account and permanently delete all projects. This action cannot be undone.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c31d8a",
            cancelButtonColor: "#b9acd2",
            confirmButtonText: "Yes, close my account!"
        }).then(result => {
            if (result.value) {
                console.log('Account deleted')
            }
        });
    },
    updatePassword() {
      const user = this.$store.state.currentUser
      this.newPassword = this.settingsForm.password
      let confirmPassword = this.settingsForm.passwordConfirm
      this.errorMsg = ""
      if (this.newPassword === '' || confirmPassword === '') {
        this.errorMsg = "All fields are required."
      }
      else {
        if (this.newPassword == confirmPassword) {
          user.updatePassword(this.newPassword).then(() => {
            this.$swal({
              type: "success",
              title: "Your password has been updated",
              showConfirmButton: false,
              timer: 1500
            });
            this.settingsForm.password = ''
            this.settingsForm.passwordConfirm = ''
          }).catch((error) => {
            if (error.code == 'auth/requires-recent-login') {
              this.showLoginForm = true;
              this.showSettingsForm = false;
            }
          });
        }
        else {
          this.errorMsg = 'Passwords must match.';
        }
      }
    },
    currentPassword() {
      const user = this.$store.state.currentUser
      let userEmail = user.email
      let currentPassword = this.loginForm.password 
      const credentials = fb
        .EmailAuthProvider.credential(
          userEmail,
          currentPassword
        );
      user.reauthenticateAndRetrieveDataWithCredential(credentials).then(()=>{
        user.updatePassword(this.newPassword).then(() => {
          this.settingsForm.password = ''
          this.settingsForm.passwordConfirm = ''
          this.showSettingsForm = true
          this.showLoginForm = false
          this.newPassword = ""
          this.$swal({
            type: "success",
            title: "Your password has been updated",
            showConfirmButton: false,
            timer: 1500
          });
        }).catch(error => {
          this.errorMsg = error.message;
        });
      }).catch(error => {
        this.errorMsg = error.message;
      });
    }
  }
};
</script>
