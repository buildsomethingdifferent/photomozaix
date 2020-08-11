<template>
    <nav class="sideNav" :class="$store.state.showSideBar ? '' : 'sideNavClosed'">
        <ul>
            <li>
                <router-link :to="{name: 'AdminDashboard'}">
                    <img src="@/assets/new-order.png" alt="Dashboard">
                    New Orders</router-link>
            </li>
            <li>
                <router-link :to="{name: 'FinishedOrders'}">
                    <img src="@/assets/finished-order.png" alt="Finished Orders">
                    Finished Orders</router-link>
            </li>
            <li>
                <router-link :to="{name: 'AdminProjectListing'}">
                    <img src="@/assets/abandoned-order.png" alt="Projects">
                    Abandoned Orders
                </router-link>
            </li>
            <li>&nbsp;</li>
            <li>
                <router-link :to="{name:  'CustomerListing'}">
                    <img src="@/assets/customer-profile.png" alt="Coupon Code">
                    <span>Customer Profiles</span>
                </router-link>
            </li>
            <li>&nbsp;</li>
            <li>
                <router-link :to="{name:  'ManageProduct'}">
                    <img src="@/assets/manage-product.png" alt="Manage  Product">
                    <span>Manage  Product</span>
                </router-link>
            </li>

            <li>
                <router-link :to="{name:  'AdminCouponListing'}">
                    <img src="@/assets/coupon-code.png" alt="Coupon Code">
                    <span>Coupon Code</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: "adminSideBar"
    }
</script>

<style scoped>

</style>
