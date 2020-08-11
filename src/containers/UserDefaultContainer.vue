<template>
    <div id="app">
        <header class="header">
            <div class="container">
                <div class="navbar level">
                    <div class="level-left logo navbar-brand">
                        <router-link :to="{name:'UserDashboard'}" class="level-item">
                            <img src="../assets/logo.png" alt="PhotoMozaix logo">
                        </router-link>
                        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="mainNav">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                    <Navigation></Navigation>
                </div>
            </div>
        </header>
        <section class="section">
            <div class="container">
                <router-view></router-view>
            </div>
        </section>
        <footer class="footer is-paddingless">
            <div class="container">
                <div class="columns">
                    <div class="column is-two-thirds"><img src="../assets/logo.png" alt="PhotoMozaix logo" class="footer-logo"></div>
                    <div class="column level">
                        <ul class="level-left social">
                            <li class="level-item"><a href=""><i class="fab fa-facebook-f"></i></a></li>
                            <li class="level-item"><a href=""><i class="fab fa-twitter"></i></a></li>
                            <li class="level-item"><a href=""><i class="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-two-thirds">
                        <p><strong>About PhotoMozaix</strong><br>
                            A PhotoMozaix is one large image created from a collection of tiny photos. We take your images and create a memorable family keepsake your loved ones will enjoy for generations to come! PhotoMozaix are a great way to remember a special event or cherished family member.</p>
                        <p class="legal"><span>&copy; Copyright PhotoMozaix</span> | <a href="https://photomozaix.com/privacy">Privacy Policy</a> | <a href="https://photomozaix.com/terms">Terms &amp; Conditions</a></p>
                    </div>
                    <div class="column">
                        <p class="address">
                            <strong>PhotoMozaix</strong><br>
                            8300 Fairview Rd.<br>
                            Mint Hill, NC 28227<br>
                            <a href="tel:704-846-5588">(704) 846-5588</a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="logos">
                <div class="container">
                    <p>Part of the Photovision Family</p>
                    <ul class="level">
                        <li class="level-item has-text-centered"><a href="https://www.photovision.com/"><img src="../assets/Logos-Footer-PhotoVision.png" alt="PhotoVision logo" /></a></li>
                        <li class="level-item has-text-centered"><a href="https://www.createavideo.com//"><img src="../assets/Logos-Footer-CAV.png" alt="CreateAVideo logo" /></a></li>
                        <li class="level-item has-text-centered"><a href="https://www.grouptravelvideos.com/"><img src="../assets/Logos-Footer-GroupTravel.png" alt="GroupTravel logo" /></a></li>
                        <li class="level-item has-text-centered"><a href="https://photomozaix.com//pricing/#"><img src="../assets/Logos-Footer-Mozaix.png" alt="PhotoMozaix logo" /></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    let head = document.head;
    let link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://pro.fontawesome.com/releases/v5.4.1/css/all.css";
    link.integrity =
        "sha384-POYwD7xcktv3gUeZO5s/9nUbRJG/WOmV6jfEGikMJu77LGYO8Rfs2X7URG822aum";
    link.crossOrigin = "anonymous";

    head.appendChild(link);

    var favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href =
        "https://photomozaix.com/wp-content/uploads/2018/11/cropped-Logo-Mozaix-Bug2-32x32.png";
    head.appendChild(favicon);

    import { mapState } from "vuex";
    import Navigation from "../views/Navigation.vue";

    export default {
        name: "UserDefaultContainer",
        components: { Navigation },
        computed: mapState(["currentUser"])
    };
</script>

<style scoped>

</style>
