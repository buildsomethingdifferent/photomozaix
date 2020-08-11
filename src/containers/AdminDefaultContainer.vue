<template>
    <div class="app admin-panel">
        <admin-header></admin-header>
        <main class="flexResponsive">
            <admin-side-bar></admin-side-bar>
            <router-view></router-view>
        </main>
        <admin-footer></admin-footer>
    </div>
</template>

<script>
    import adminHeader from "../views/admin/components/AdminHeader";
    import adminSideBar from "../views/admin/components/AdminSideBar";
    import adminFooter from "../views/admin/components/AdminFooter";
    export default {
        name: "AdminDefaultContainer",
        components:{
            adminHeader, adminSideBar, adminFooter
        },
        created(){
            this.$helpers.toggleSubMenu();
        }
    }
</script>

<style lang="scss">
    @import "../styles/style.css";
    /*@import url("../styles/style.css");*/
</style>
