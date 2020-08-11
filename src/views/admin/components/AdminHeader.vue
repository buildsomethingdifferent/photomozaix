<template>
    <header>
        <div class="topBar">
            <div class="flexElem">
                <div :class="$store.state.showSideBar ? 'closed' : ''" @click="toggleSideBar" class="nav-icon">
                    <div></div>
                </div>
                
                <router-link :to="{name: 'AdminDashboard'}">
                    <img src="@/assets/admin-logo.png" alt="Logo">
                </router-link>

            </div>

            <div>
                <b-dropdown text="Admin" class="m-md-2" right >
                    <a href="#" @click="logout" class="dropdown-item">Logout</a>
                </b-dropdown>
            </div>
        </div>
    </header>
</template>

<script>
    const fb = require("@/config/firebaseConfig.js");
    export default {
        name: "AdminHeader",
        methods: {
            logout() {
                let self = this;
                fb.auth
                    .signOut()
                    .then(() => {
                        let message = self.$helpers.setMessage("success", "You have successfully logged out", "Login")
                        self.$store.commit("setFlashMessage", message);
                        self.$store.dispatch("clearData");
                        self.$router.push({name: "LoginPage"});
                    })
                    .catch(error => {
                        self.consoleData("error logging out from admin" + error);
                    });
            }
        },
    }
</script>

<style scoped>

</style>
