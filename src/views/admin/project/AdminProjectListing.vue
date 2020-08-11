<template>
    <div>
        <b-modal ref="shareCodeModal" id="shareCodeModal" :title="'Send Email'" :hide-footer="true"
                 no-close-on-esc no-close-on-backdrop @close="modalAction('hide')"
        >
            <wysiwyg v-model="emailBody" />
            <div class="columns is-multiple text-center">
                <div class="column is-12 btnsContainter">
                    <b-button variant="success" class="customButtonMedium width_200 mediumColor"
                              @click="sendCouponViaEmail()" ref="updateBtn" >Send Email</b-button>
                    <b-button class="customButtonMedium width_200 lightColor" @click="modalAction('hide')">Cancel</b-button>
                </div>
            </div>
        </b-modal>
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <div class="flexElem panelHeader flexResponsive">
            <div class="panelHeading">
                Abandoned Orders
            </div>

            <div class="flexElem flexResponsive">
                <div class="hasSearch autoWidth">
                    <b-form-select name="status" v-model="search_date" @change="search('search_date')"
                                   :options="searchByDate" class="input customInput"
                                   style="min-width: 150px;">
                    </b-form-select>
                </div>
                <div class="hasSearch">
                    <input type="text" autocomplete="nope" class="inputControl searchIcon" v-model="search_customer_name" placeholder="Search With Customer Name"
                           @keyup.enter="search('search_customer_name')">
                    <span class="searchBtn" @click="search('search_customer_name')"></span>
                </div>
                <div class="hasSearch">
                    <input type="text" autocomplete="nope" class="inputControl searchIcon" v-model="search_customer_email" placeholder="Search With Customer Email"
                           @keyup.enter="search('search_customer_email')">
                    <span class="searchBtn" @click="search('search_customer_email')"></span>
                </div>
            </div>
        </div>

        <div class="panelContent">
            <div class="table-responsive" v-dragscroll.x="draggable">
                <table class="themeTable noTextBreak">
                    <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Customer Email</th>
                        <th>Project Title</th>
                        <th class="text-center">Number of Images</th>
                        <th class="noTextBreak">Date</th>
                        <th>Project ID</th>
                        <th class="noTextBreak">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(project, pIdx) in projects">
                        <td>
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{project.user_name ? project.user_name : 'N/A' | capitalize}}
                             </span>
                            </td>
                        <td>
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{project.user_email}}
                             </span>
                            </td>
                        <td>
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{project.title | capitalize}}
                             </span>
                            </td>
                        <td class="text-center numVal">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{project.total_photos}}
                             </span>
                            </td>
                        <td class="noTextBreak">
                            <span @mouseover="draggable=false" @mouseout="draggable=true">
                               {{project.date_created.toDate()| moment("ddd, Do MMM  YYYY")}}
                             </span>
                            </td>
                        <td>
                            <router-link :to="{name:'AdminViewProject', params: {projectId: project.id}}"
                                         title="View Project">
                                {{project.id}}
                            </router-link>
                        </td>
                        <td class="noTextBreak">
                            <template v-if="project.total_orders > 0">
                                <router-link :to="{ name: 'ProjectOrderListing', params: { projectId: project.id,
                                                 projectTitle: project.title }}"
                                             class="action action_cart" title="View Project Orders">
                                </router-link>
                            </template>
                            <template v-else="">
                                <div style="cursor: not-allowed;"  class="action action_cart" title="No orders against this project"></div>
                            </template>
                            <template v-if="project.downloading">
                                <CircleLoader :progress="project.progress"></CircleLoader>
                            </template>
                            <span class="action action_download" @click="createZip(project.id, pIdx)"
                                  style="cursor: pointer" title="Download images zip"></span>
                            <span @click="modalAction('show', project)" class="action action_email"
                                  style="cursor: pointer" title="Send Email"></span>

                            <router-link :to="{ name: 'AdminViewProject', params: { projectId: project.id }}"
                                         class="action action_view" title="View Project">
                            </router-link>
                        </td>
                    </tr>
                    <template v-if="showLoader == false && projects.length <= 0">
                        <tr>
                            <td colspan="7">
                                <span @mouseover="draggable=false" @mouseout="draggable=true">
                                    No Data Exists
                                </span>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>

<script>
    const fb = require("../../../config/firebaseConfig");
    import Datepicker from 'vuejs-datepicker';
    let FileSaver = require('file-saver');
    let JSZip = require('jszip');
    let JSZipUtils = require('jszip-utils');
    import CircleLoader from "../../user-components/CircleLoader"
    export default {
        name: "AdminProjectListing",
        components: {
            'vue-date':Datepicker,
            'CircleLoader': CircleLoader,
        },
        data() {
            return {
                projects: [],
                total_projects:0,
                total_pages:0,
                per_page:20,
                current_page:1,
                errorMsg:"",
                auth_user:{},
                search_customer_name:"",
                search_customer_email:"",
                start_at: null,
                start_after: null,
                searchByDate: [
                    {value: "all", text: 'All'},
                    {value: "last6Months", text: 'Last 6 Months'},
                ],
                search_date:"all",
                coupon_code:"",
                coupon_discount:"",
                emailBody:'<p>Dear (Customer Name if one in system otherwise Dear Customer),&nbsp;</p><br>'+
                    '                    <p>We noticed you started a new PhotoMozaix project but have not placed the order yet. We know life can get busy, but PhotoMozaix are great gifts for any occasion!</p><br>'+
                    '                    <p>To help you along we would like to offer you this Free standard shipping offer that is a $10 value if used in the next 24 hours by using the following code:&nbsp; <strong style="color: #ff0000;">FREESHIP</strong></p><br>'+
                    '                    <p>If you have any questions please feel free to contact us at (704) 846-5588.</p><br>'+
                    '                    <p>We look forward to helping you brighten someone&rsquo;s day!</p><br>'+
                    '                    <p>Thank you,</p><br>'+
                    '                    <p>PhotoMoziax Team</p><br>',
                activeProject:null
            };
        },
        created(){
            let self = this;
            self.getProjects();
        },
        methods:{
            scrollListener(){
                let self = this;
                if( self.$helpers.bottomOfWindow() && self.showLoader == false) {
                    self.getProjects();
                }
            },
            getProjects(){
                let self = this;
                window.addEventListener('scroll', self.scrollListener);
                let projectsRef = fb.projectsCollection.where("date_deleted", "==", null);
                projectsRef = self.addSearchQuery(projectsRef);
                projectsRef = projectsRef.orderBy("date_created", "desc");
                if (self.start_after) {
                    projectsRef = projectsRef.startAfter(self.start_after);
                }
                self.showLoader = true;
                projectsRef.limit(self.per_page).get().then((projectsSnapShot) => {
                    let total_docs = projectsSnapShot.docs.length;
                    if (total_docs > 0) {
                        window.addEventListener('scroll', self.scrollListener);
                        self.start_at = projectsSnapShot.docs[0];
                        self.start_after = projectsSnapShot.docs[total_docs - 1];
                    } else {
                        window.removeEventListener('scroll', self.scrollListener);
                    }
                    projectsSnapShot.forEach((project) => {
                        let project_data = project.data();
                        project_data["id"] = project.id;
                        project_data["downloading"] = false;
                        project_data["downloaded"] = 0;
                        project_data["progress"] = 0;
                        project_data["message"] = "Downloading...";
                        self.projects.push(project_data)
                    })
                    self.showLoader = false;
                }).catch(function (error) {
                    self.showLoader = false;
                    self.$helpers.consoleData("Error getting projects: " + error)
                })
            },
           addSearchQuery(projectsRef){
                let self = this;
               if(self.search_customer_name){
                   projectsRef = projectsRef.where("name_terms", "array-contains", self.search_customer_name.toLowerCase())
               }
               if(self.search_customer_email){
                   projectsRef = projectsRef.where("email_terms", "array-contains", self.search_customer_email.toLowerCase())
               }
               if(self.search_date && self.search_date == "last6Months"){
                   let now = new Date();
                   now.setHours(0,0,0,0);
                   let start_date = new Date(now.setMonth(now.getMonth() - 6));
                   start_date.setHours(0,0,0,0);
                   let end_date = new Date();
                   end_date.setHours(23,59,59,999);
                   let date_obj = {
                       start_date: start_date,
                       end_date: end_date
                   }
                   projectsRef = projectsRef.where("date_created", ">=", date_obj.start_date).
                   where("date_created", "<=", date_obj.end_date);
               }
               return projectsRef;
           },
            search(type) {
                let self = this;
                if(type == "search_customer_name") {
                    self.search_customer_email = "";
                }
                if(type == "search_customer_email") {
                    self.search_customer_name  = "";
                }
                self.projects = [];
                self.start_at  = null;
                self.start_after  = null;
                self.getProjects();
            },
            createZip(projectId, projectIndex) {
                let self = this;
                if(projectId){
                    let assetsArray = [];
                    self.fb.projectsCollection.doc(projectId).collection("photos").where("date_deleted", "==", null)
                        .get().then((assetsQuerySnapShot) => {
                        assetsQuerySnapShot.forEach((asset) => {
                            let asset_name = asset.data().name;
                            if(asset.data().is_main_img) {
                                asset_name = "main_"+asset.data().name;
                            }
                            assetsArray.push({path: asset.data().url, name: asset_name})
                        })
                        if(assetsArray.length > 0) {
                            self.projects[projectIndex].downloading = true;
                            $("body").addClass("loaderOpen");
                            self.downloadZip(assetsArray, projectId+".zip", assetsArray.length, projectIndex);
                        } else {
                            self.simpleAlert({
                                type: "info",
                                text: "No files to download"
                            })
                        }
                    })

                }
            },
            downloadZip(files, zipName="default.zip", total_files, projectIndex) {
                let self = this;
                let zip = new JSZip();
                files.forEach((photo, pIdx) => {
                    zip.file(photo.name, self.urlToPromise(photo.path, total_files, projectIndex), { base64: true, binary: true })
                })
                zip.generateAsync({ type: "blob" })
                    .then(function (content) {
                        self.projects[projectIndex].message = "Creating Zip...";
                        self.projects[projectIndex].downloading = false;
                        self.projects[projectIndex].downloaded = 0;
                        self.projects[projectIndex].progress = 0;
                        $("body").removeClass("loaderOpen")
                        FileSaver.saveAs(content, zipName);
                    });
            },
            urlToPromise(url, total_files, projectIndex) {
                let self = this;
                return new Promise(function (resolve, reject) {
                    JSZipUtils.getBinaryContent(url, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            let downloaded_files = JSON.stringify(self.projects[projectIndex].downloaded);
                            downloaded_files     = JSON.parse(downloaded_files);
                            downloaded_files     = parseInt(downloaded_files) + 1;
                            let progress = parseInt(downloaded_files) / parseInt(total_files);
                            progress     = parseFloat(progress) * parseFloat('100');
                            self.projects[projectIndex].downloaded = downloaded_files;
                            self.projects[projectIndex].progress = parseInt(progress);
                            let projectId = self.projects[projectIndex].id;
                            resolve(data);
                        }
                    });
                });
            },
            sendEmail(email, id) {
                alert(email, id)
            },
            sendCouponViaEmail() {
                let self = this;
                if(self.emailBody) {
                    self.showLoader = true;
                    self.$refs["updateBtn"].disabled = true;
                    let url = process.env.VUE_APP_API_BASE_URL+"send/coupon/email"
                    let data = {
                        email: self.activeProject.user_email,
                        emailBody: self.emailBody,
                        base_url: process.env.VUE_APP_BASE_URL,
                    }
                    self.$http.post(url, data).then(response => {
                        let response_data = response.body;
                        if(response_data.success) {
                            self.showLoader = false;
                            self.$refs["updateBtn"].disabled = false;
                            self.modalAction("hide");
                            self.simpleAlert({
                                type:"success",
                                text: "Email Sent!"
                            });
                        } else {
                            self.showLoader = false;
                            self.simpleAlert({
                                type:"error",
                                text:"Something went wrong. Please try again"
                            });
                        }
                    }, response => {
                        self.consoleData("error vue resource");
                        self.showLoader = false;
                        self.$refs["updateBtn"].disabled = false;
                        self.simpleAlert({
                            type:"error",
                            text: "Something went wrong. Please try again"
                        });
                    });
                } else {
                    self.simpleAlert({
                        type: "info",
                        text: "Email body can not be empty"
                    })
                }
            },
            modalAction(action, project=null) {
                let self = this;
                self.activeProject = project;
                if(action == "show") {
                    let user_name = project.user_name ? project.user_name : "Customer"
                    self.emailBody = '<p>Dear '+user_name+',&nbsp;</p><br>'+
                        '                    <p>We noticed you started a new PhotoMozaix project but have not placed the order yet. We know life can get busy, but PhotoMozaix are great gifts for any occasion!</p><br>'+
                        '                    <p>To help you along we would like to offer you this Free standard shipping offer that is a $10 value if used in the next 24 hours by using the following code:&nbsp; <strong style="color: #ff0000;">FREESHIP</strong></p><br>'+
                        '                    <p>If you have any questions please feel free to contact us at (704) 846-5588.</p><br>'+
                        '                    <p>We look forward to helping you brighten someone&rsquo;s day!</p><br>'+
                        '                    <p>Thank you,</p><br>'+
                        '                    <p>PhotoMoziax Team</p><br>';
                    self.$bvModal.show("shareCodeModal");
                }
                if(action == "hide") {
                    self.$bvModal.hide("shareCodeModal");
                    setTimeout(() => {
                        self.activeProject = null;
                    },100)
                }
            },
        }

    }
</script>

<style>
</style>
