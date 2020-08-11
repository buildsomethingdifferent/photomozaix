import Vue from "vue";
import Router from "vue-router";
import store from './store'
import firebase from "firebase";
import helpers from "./helpers"
import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Checkout from "./views/Checkout.vue";
import ProjectOrderPage from "./views/ProjectOrderPage.vue";
import Login from "./views/Login.vue";
import ResetPassword from "./views/ResetPassword.vue";
import Project from "./views/Project.vue";
import Settings from "./views/Settings.vue";
import Cart from "./views/Cart.vue";
import NotFound from "./error-pages/NotFound.vue";
import AdminDefaultContainer from './containers/AdminDefaultContainer';
import UserDefaultContainer from './containers/UserDefaultContainer';
import AdminProjectListing from "./views/admin/project/AdminProjectListing"
import AdminViewProject from "./views/admin/project/AdminViewProject"
import AdminOrders from "./views/admin/AdminOrders";
import AdminCouponListing from "./views/admin/coupon/AdminCouponListing";
import AdminDashboard from "./views/admin/AdminDashboard";
import AdminProfile from "./views/admin/AdminProfile";
import ManageProduct from "./views/admin/product/ManageProduct"
import AdminProjectOrderListing from "./views/admin/project/AdminProjectOrderListing";
import ViewProject from "./views/ViewProject";
let fb = require("./config/firebaseConfig")
import VueSession from 'vue-session'
import MyOrders from "./views/MyOrders";
import SharedWithMe from "./views/SharedWithMe";
import OrderDetail from "./views/admin/OrderDetail";
import CustomerListing from "./views/admin/CustomerListing";
import FinishedOrders from "./views/admin/FinishedOrders";
import CustomerDetail from "./views/admin/CustomerDetail";

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/admin',
            name: 'AdminDefaultContainer',
            component: AdminDefaultContainer,
            meta: {
                requiresAuth: true,
                component_name: "AdminDefaultContainer",
                allowedUsers: ["admin"],
                title: "PhotoMozaix",
            },
            children: [
                {
                    path: 'dashboard',
                    name: 'AdminDashboard',
                    component: AdminDashboard,
                    meta: {
                        component_name: "AdminDashboard",
                        title: "Admin Dashboard",
                        allowedUsers: ["admin"]
                    },
                },
                {
                    path: 'finished/orders',
                    name: 'FinishedOrders',
                    component: FinishedOrders,
                    meta: {
                        component_name: "FinishedOrders",
                        title: "Finished Orders",
                        allowedUsers: ["admin"]
                    },
                },
                {
                    path: 'customers',
                    name: 'CustomerListing',
                    component: CustomerListing,
                    meta: {
                        component_name: "CustomerListing",
                        title: "Customer Listing",
                        allowedUsers: ["admin"]
                    },
                },
                {
                    path: 'customer/:customerId/detail',
                    name: 'CustomerDetail',
                    component: CustomerDetail,
                    props: true,
                    meta: {
                        component_name: "CustomerDetail",
                        title: "Customer Detail",
                        allowedUsers: ["admin"]
                    },
                },
                {
                    path: 'profile',
                    name: 'AdminProfile',
                    component: AdminProfile,
                    meta: {
                        component_name: "AdminProfile",
                        title: "Profile"
                    },
                },
                {
                    path: 'projects',
                    name: 'AdminProjectListing',
                    component: AdminProjectListing,
                    meta: {
                        component_name: "AdminProjectListing",
                        title: "Project Listing"
                    },
                },
                {
                    path: 'project/:projectId/orders',
                    name: 'ProjectOrderListing',
                    component: AdminProjectOrderListing,
                    props:true,
                    meta: {
                        component_name: "ProjectOrderListing",
                        title: "Project Listing"
                    },
                },
                {
                    path:  "project/:projectId",
                    name: 'AdminViewProject',
                    component: AdminViewProject,
                    props: true,
                    meta: {
                        component_name: "AdminViewProject",
                        title: "View Project"
                    },
                },
                {
                    path: 'orders',
                    name: 'AdminOrders',
                    component: AdminOrders,
                    meta: {
                        component_name: "AdminOrders",
                        title:"Orders Listing"
                    }
                },
                {
                    path: 'order/:orderId/detail',
                    name: 'OrderDetail',
                    component: OrderDetail,
                    props: true,
                    meta: {
                        component_name: "OrderDetail",
                        title:"Order Detail",
                        allowedUsers: ["admin"]
                    }
                },
                {
                    path: 'coupons',
                    name: 'AdminCouponListing',
                    component: AdminCouponListing,
                    meta: {
                        component_name: "AdminCouponListing",
                        title:"Coupons Listing"
                    }
                },
                {
                    path: 'manage_product',
                    name: 'ManageProduct',
                    component: ManageProduct,
                    meta: {
                        component_name: "ManageProduct",
                        title:"Manage Products"
                    }
                }
            ]
        },
        {
            path: '/',
            name: 'UserDefaultContainer',
            component: UserDefaultContainer,
            meta: {
                requiresAuth: true,
                component_name: "UserDefaultContainer",
                allowedUsers: ["customer"],
                title: "PhotoMozaix",
            },
            children: [
                {
                    path: "dashboard",
                    name: "UserDashboard",
                    component: Dashboard,
                    meta: {
                        requiresAuth: true,
                        title: "Project Dashboard | PhotoMozaix",
                        allowedUsers: ["customer"]
                    }
                },
                {
                    path: "shared/with/me",
                    name: "SharedWithMe",
                    component: SharedWithMe,
                    meta: {
                        requiresAuth: true,
                        title: "Shared Projects | PhotoMozaix",
                        allowedUsers: ["customer"]
                    }
                },
                {
                    path: "/my/orders",
                    name: "MyOrders",
                    component: MyOrders,
                    meta: {
                        requiresAuth: true,
                        title: "Your Orders | PhotoMozaix",
                        allowedUsers: ["customer"]
                    }
                },
                {
                    path:  "project/:projectId/view",
                    name: 'ProjectView',
                    component: ViewProject,
                    props: true,
                    meta: {
                        component_name: "ProjectView",
                        title: "View Project"
                    },
                },
                {
                    path: "/checkout/:projectId/:shareCode?",
                    name: "Checkout",
                    component: Checkout,
                    props: true,
                    meta: {
                        requiresAuth: true,
                        title: "Checkout Page | PhotoMozaix",
                        allowedUsers: ["customer"]
                    },
                    beforeEnter(to, from, next) {
                        let currentUser = helpers.getCurrentUser();
                        if(helpers.emptyOrNull(currentUser)) {
                            let message = helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
                            store.commit("setFlashMessage", message)
                            helpers.logOutUser();
                        } else {
                            next();
                        }
                    }
                },
                {
                    path: "/project/:projectId/edit",
                    name: "ProjectEdit",
                    component: Project,
                    props: true,
                    meta: {
                        requiresAuth: true,
                        title: "Edit Your Project | Project Dashboard | PhotoMozaix",
                        allowedUsers: ["customer"]
                    },
                    beforeEnter: (to, from, next) => {
                        const fb = require("./config/firebaseConfig.js");
                        let currentUser = helpers.getCurrentUser();
                        if(helpers.emptyOrNull(currentUser)) {
                            let message = helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
                            store.commit("setFlashMessage", message)
                            helpers.logOutUser();
                        }
                        var projectRef = fb.db.collection("projects").doc(to.params.projectId);
                        projectRef.get().then(doc => {
                                if (doc.exists) {
                                    let project = doc.data();
                                    if(project.date_deleted == null) {
                                        if(project.user == currentUser.uid) {
                                            if(project.status == "new") {
                                                next();
                                            } else {
                                                next({name: "ProjectView", params: {projectId:to.params.projectId}})
                                            }
                                        } else {
                                            if(currentUser.user_type == "customer") {
                                                let message = helpers.setMessage("danger", "Not authorized to perform this operation.", "Dashboard")
                                                store.commit("setFlashMessage", message);
                                                next("/dashboard");
                                            } else {
                                                let message = helpers.setMessage("danger", "Not authorized to perform this operation.", "AdminDashboard")
                                                store.commit("setFlashMessage", message);
                                                next("/admin/dashboard");
                                            }
                                        }
                                    } else {
                                        if(currentUser.user_type == "customer") {
                                            let message = helpers.setMessage("danger", "Project not found", "Dashboard")
                                            store.commit("setFlashMessage", message);
                                            next("/dashboard");
                                        } else {
                                            let message = helpers.setMessage("danger", "Project not found", "AdminDashboard")
                                            store.commit("setFlashMessage", message);
                                            next("/admin/dashboard");
                                        }
                                    }
                                } else {
                                    if(currentUser.user_type == "customer") {
                                        let message = helpers.setMessage("danger", "Project not found", "Dashboard")
                                        store.commit("setFlashMessage", message);
                                        next("/dashboard");
                                    } else {
                                        let message = helpers.setMessage("danger", "Project not found", "AdminDashboard")
                                        store.commit("setFlashMessage", message);
                                        next("/admin/dashboard");
                                    }
                                }
                            })
                            .catch(error => {
                                if(currentUser.user_type == "customer") {
                                    let message = helpers.setMessage("danger", error, "Dashboard")
                                    store.commit("setFlashMessage", message);
                                    next("/dashboard");
                                } else {
                                    let message = helpers.setMessage("danger", error, "AdminDashboard")
                                    store.commit("setFlashMessage", message);
                                    next("/admin/dashboard");
                                }
                            });
                    }
                }
            ]
        },
        {
            path: '/',
            name: 'RoutesAccessibleToUnauthenticatedUsers',
            component: UserDefaultContainer,
            meta: {
                requiresNewUser: true,
                component_name: "SimpleRoutesContainer",
                description: "These routes are accessible only if user not logged in"
            },
            children: [
                {
                    path: "login",
                    name: "LoginPage",
                    component: Login,
                    meta: {
                        title: "Sign Into Your Account | PhotoMozaix",
                    }
                },
                {
                    path: "resetpassword",
                    name: "resetpassword",
                    component: ResetPassword,
                    props: (route) => {
                        return ({query: route.query.oobCode});
                    },
                    meta: {
                        title: "Reset Your Password | PhotoMozaix"
                    }
                },
                {
                    path: "/signup",
                    name: "signup",
                    component: Home,
                    alias: "/signup",
                    meta: {
                        title: "Create A New Account | PhotoMozaix"
                    }
                },
            ]
        },

        {
            path: '/',
            name: 'PublicRoutes',
            component: UserDefaultContainer,
            meta: {
                requiresAuth: false,
                component_name: "PublicRoutes",
                description: "These routes are public accessible."
            },
            children: [
                {
                    path:  "shared/project/:projectId/:shareCode?",
                    name: 'OpenSharedProject',
                    component: ViewProject,
                    props: (route) => ({
                        projectId: route.params.projectId,
                        shareCode: route.params.shareCode,
                        sharedProject: true,
                    }),
                    meta: {
                        component_name: "OpenSharedProject",
                        title: "Open Share Project"
                    },
                },
                {
                    path: "/order/project/:projectId/:shareCode?",
                    name: "ProjectOrderPage",
                    component: ProjectOrderPage,
                    props: true,
                    meta: {
                        requiresAuth: false,
                        title: "Checkout Page | PhotoMozaix",
                        allowedUsers: ["customer"]
                    },
                },
            ]
        },
        {
            path: "*",
            name: "NotFound",
            component: NotFound,
            meta: {
                title: "Page Not Found | PhotoMozaix"
            }
        },
    ]
});
router.beforeEach((to, from, next) => {
    if(to.meta && to.meta.title) {
        $("title").text(to.meta.title)
    }
    let currentUsers = helpers.getCurrentUser();
    if(!helpers.emptyOrNull(currentUsers)) {
        if(!currentUsers.user_type){
            currentUsers.user_type = "customer"
        }
    }
    if(to.fullPath == "/") {
        if(!helpers.emptyOrNull(currentUsers)) {
            if(currentUsers.user_type == "customer") {
                next("/dashboard")
            } else {
                next("/admin/dashboard")
            }
        } else {
            let message = helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
            store.commit("setFlashMessage",message)
            helpers.logOutUser()
        }
    }
    let parent_route = null;
    if(to.matched.length > 0) {
        parent_route = to.matched[0].meta
    }
    if(parent_route) {
        if(parent_route.requiresAuth) {
            if(!helpers.emptyOrNull(currentUsers)){
                /*if route have meta allowedUsers then it means that route is accessible to roles defined in
                    route meta data named allowedUsers. The meta allowedUsers is of type array.
                */
                if(parent_route.allowedUsers) {
                    let isAllowed = parent_route.allowedUsers.some(
                        userType => userType ==  currentUsers.user_type
                    )
                    if(isAllowed){
                        next();
                    } else {
                        if(currentUsers.user_type == "customer"){
                            next("/dashboard")
                        } else {
                            next("/admin/dashboard")
                        }
                    }
                } else {
                    next()
                }
            } else {
                let message = helpers.setMessage("danger", "Your session has been expired. Please login again.", "Login")
                store.commit("setFlashMessage",message)
                helpers.logOutUser();
            }
        } else if(parent_route.requiresNewUser) {
            if(!helpers.emptyOrNull(currentUsers)) {
                if(currentUsers.user_type == "admin") {
                    next("/admin/dashboard");
                } else {
                    next("/dashboard");
                }
            } else {
                next()
            }
        } else {
            next()
        }
    } else {
        next();
    }
});

export default router;
