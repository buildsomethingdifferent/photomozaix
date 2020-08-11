<template>
    <div v-if="mode == 'resetPassword'">
        Resetting password
    </div>
    <div v-else>
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <div v-if="showForgotPassword" id="resetpassword">
            <h1>Reset Password</h1>
            <p>We will send you an email to reset your password.</p>
            <div class="form-wrap">
                <b-alert  :show="errorMsg !== ''" dismissible @dismissed="dismissAlert"
                          :variant="'danger'">
                    {{errorMsg}}
                </b-alert>
                <form @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                        <div class="control has-icons-left"><input type="email" class="input is-medium"
                                                                   v-model.trim="passwordForm.email"
                                                                   placeholder="Email Address" required/><span
                                class="icon is-small is-left"><i class="fas fa-envelope"></i></span></div>

                        <button @click="resetPassword" class="button">Submit</button>

                        <div class="extras">
                            <a @click="togglePasswordReset">Back to Log In</a>
                        </div>
                    </div>
                    <div v-else>
                        <h3>Email Sent</h3>
                        <p>Check your email for a link to reset your password.</p><br>
                        <button @click="togglePasswordReset" class="button">Back to login</button>
                    </div>
                </form>
            </div>
        </div>
        <div id="login" v-else>
            <h1>Sign In</h1>
            <b-alert  :show="isFlashMessage($options.name)" dismissible @dismissed="dismissAlert"
                      :variant="$store.state.flashMessage.type">
                {{$store.state.flashMessage.message}}
            </b-alert>

            <b-alert  :show="errorMsg !== ''" dismissible @dismissed="dismissAlert"
                      :variant="'danger'">
                {{errorMsg}}
            </b-alert>
            <div class="form-wrap">
                <form @submit.prevent="login">
                    <div class="control has-icons-left">
                        <input type="email" class="input is-medium" v-model.trim="loginForm.email"
                               placeholder="Email Address" required/>
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                    </div>
                    <div class="control has-icons-left">
                        <input type="password" class="input is-medium" v-model.trim="loginForm.password"
                               placeholder="Password" required/>
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </div>
                   <template v-if="app_env != 'local'">
                       <vue-recaptcha ref="recaptcha"
                                      @verify="captchaVerified"
                                      @expired="captchaExpired"
                                      :sitekey="'6Lf0LrUUAAAAADlRiKDtmS_fCAfCCXOxDBZ7b0np'"
                                      :loadRecaptchaScript="true">
                       </vue-recaptcha>
                   </template>
                    <input type="submit" value="Log In" class="button is-medium mt-3"/>
                </form>
                <div class="extras">
                    <a @click="togglePasswordReset">Forgot Password?</a>
                    <router-link to="/signup">Create an Account</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //const fb = require("../config/firebaseConfig.js");
    import VueRecaptcha from 'vue-recaptcha'
    export default {
        name: "Login",
        components: { VueRecaptcha },
        data: function () {
            return {
                loginForm: {
                    email: "",
                    password: ""
                },
                passwordForm: {
                    email: ""
                },
                showForgotPassword: false,
                passwordResetSuccess: false,
                errorMsg: "",
                mode: "",
                captcha_verified:(process.env.VUE_APP_NODE_ENV == "local") ? true : null,
                app_env:process.env.VUE_APP_NODE_ENV
            };
        },
        created: function () {
            let self = this;
            self.removeFlashMessage(self.$options.name);
            this.mode = this.$route.query.mode;
            this.loginForm.email = "";
            this.loginForm.password = "";
            if(!self.$helpers.emptyOrNull(self.$store.state.flashMessage)) {
                self.dismissCountDown = self.dismissSecs;
            }
        },
        methods: {
            togglePasswordReset() {
                this.errorMsg = "";
                if (this.showForgotPassword) {
                    this.showLoginForm = true;
                    this.showForgotPassword = false;
                    this.passwordResetSuccess = false;
                } else {
                    this.showLoginForm = false;
                    this.showForgotPassword = true;
                }
            },
            login() {
                let self = this;
                if(self.captcha_verified) {
                    self.showLoader = true;
                    self.fb.auth
                        .signInWithEmailAndPassword(
                            this.loginForm.email,
                            this.loginForm.password
                        )
                        .then(user => {
                            self.fb.usersCollection.doc(user.user.uid).get().then((res) => {
                                let result = res.data();
                                result = self.$helpers.setUserObject(user.user, result);
                                result = self.removeColumnsFromUserObject(result);
                                let encryptUserData = self.AES.encrypt(JSON.stringify(result), process.env.VUE_APP_USER_ENCRYPTION_KEY);
                                self.$cookies.set("currentUser", encryptUserData.toString(), process.env.VUE_APP_USER_LOGGED_OUT_TIME+"MIN")
                                self.$eventHub.$emit('login-user');
                                if (result.hasOwnProperty("user_type") && result.user_type == "admin") {
                                    self.$router.push("/admin/dashboard");
                                } else {
                                    self.$router.push("/dashboard");
                                }
                            })
                        }).catch(err => {
                        self.showLoader = false;
                        this.errorMsg = "The email address or password you entered doesn't match our records. Please give it another try.";
                    });
                } else {
                    self.simpleAlert({
                        type: "warning",
                        text: "Please first verify. That you are not robot."
                    })
                }

            },
            resetPassword() {
                let self = this;
                this.performingRequest = true;
                self.fb.auth
                    .sendPasswordResetEmail(this.passwordForm.email)
                    .then(() => {
                        this.performingRequest = false;
                        this.passwordResetSuccess = true;
                        this.passwordForm.email = "";
                        this.errorMsg = "";
                    })
                    .catch(err => {
                        this.consoleData("error resetting password : "+err);
                        this.performingRequest = false;
                        this.errorMsg = "The mentioned email does not exist. Please enter the valid email.";
                    });
            },
            captchaVerified() {
                let self = this;
                self.captcha_verified = true;
            },
            captchaExpired() {
                this.$refs.recaptcha.reset();
            },
        }
    };
</script>
