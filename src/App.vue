<template>
  <router-view></router-view>
</template>
<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  export default {
    name: 'app',
    created() {
      let self = this;
      let timeInterval = parseInt(process.env.VUE_APP_USER_LOGGED_OUT_TIME) - 1;
      timeInterval = parseInt(timeInterval) * 60000; //time in milliseconds
      setInterval(() => {
        let currentUser = self.$helpers.getCurrentUser();
        currentUser = self.$helpers.removeColumnsFromUserObject(currentUser);
        if(!self.$helpers.emptyOrNull(currentUser)) {
          if(self.isAppIdle) {
            let message = self.$helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
            self.$store.commit("setFlashMessage", message);
            self.$eventHub.$emit('logout-user');
          } else {
            let encryptUserData = self.AES.encrypt(JSON.stringify(currentUser), process.env.VUE_APP_USER_ENCRYPTION_KEY);
            self.$cookies.set("currentUser", encryptUserData.toString(), process.env.VUE_APP_USER_LOGGED_OUT_TIME+"MIN")
          }
        }
      }, timeInterval)
    },
  }
</script>
<style>
  @import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
