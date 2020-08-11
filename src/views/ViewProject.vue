<template>
    <div class="adminProject">
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <div class="col-md-12 text-center">
            <div>
                <router-link v-if="showLoader == false && opened_project.status == 'new'"
                             :to="{name:'ProjectEdit', params: {projectId: projectId}}"
                             class="back">
                    <i class="fal fa-angle-left"></i>
                    Go Back
                </router-link>
            </div>
            <h2 class="panelHeading mb-1">
                Your Project
            </h2>
        </div>
        <div class="projectViewContainer flexResponsive mt-5">
            <div class="project-side">
                <div class="columns">
                    <div class="column" v-if="(shareCode && !emptyOrNull(projectSharedInfo)) || opened_project.main_thumb_url">
                         <span class="placeOrder mb-10" @click="placeOrder" style="cursor:pointer;">
                             <template v-if="reorder_project">Place Reorder</template>
                             <template v-else="">Place Order</template>
                         </span>
                    </div>
                </div>

                <div class="sideProjectInfo pl-2 pr-2">
                    <div class="mb-3">
                        <p><strong>Project Title</strong></p>
                        <p class="text-muted">{{opened_project.title}}</p>
                    </div>

                    <p class="mb-3 flexElem" style="justify-content: space-between">
                        <strong>Total images: </strong>
                        <span class="linkColor">{{ opened_project.photos ? opened_project.photos.length : "0" }}</span>
                    </p>
                </div>

                <div class="project-controls">
                    <div ref="projectMainImg" class="main-img-block text-center">
                        <div class="mb-2 pl-2 pr-2"><strong>Main Image </strong></div>
                        <img v-if="opened_project.main_thumb_url" :src="s3_base_url+opened_project.id+'/thumb_'+opened_project.main_image_name"/>
                        <img v-else src="@/assets/thumb-default.jpg"/>
                    </div>
                    <hr class="light">
                    <div v-if="collage_uploaded" class="main-img-block text-center mt-3">
                        <div class="mosaic_img hover_dark">
                            <img :src="mozaix_thumb"/>
                        </div>
                        <div @click="showMozaixGallery"
                             class="mt-3 project_action view_project" title="view mozaix">
                        </div>
                    </div>
                </div>
                <div class="mt-3" v-if="!emptyOrNull(currentUser) && showLoader == false && opened_project.status == 'Ordered'">
                    <span class="placeOrder mb-10 mt-5" @click="modalAction('show', opened_project.id)" style="cursor:pointer;">
                        Share
                    </span>
                    <div>
                        Share with friends and family so they can order the beautiful Mozaix you created.
                    </div>
                </div>
            </div>
            <div class="project-main">
                <template v-if="opened_project.photos && opened_project.photos.length > 0 &&  !showLoader">
                    <gallery :images="galleryImages" :index="galleryIndex" @close="closeGallery"></gallery>
                    <div class="photo-grid">
                        <figure :key="idx" v-for="(photo, idx) in opened_project.photos"
                                v-bind:class="[photo.is_main_img ? 'main-img photo' : 'main-img-disabled photo']"
                        >
                            <span>
                                <!--todo replace with thumb image when lamda function created for thumbnails-->
                                <img v-if="photo.url" :src="s3_base_url+opened_project.id+'/thumb_'+photo.name"
                                    :alt="photo.original_name"
                                    :id="photo.id"/>
                            </span>
                            <figcaption class="mt-2 mb-2">
                                <p class="img-controls setMainImg">
                                    <span v-if="opened_project.status=='new'"
                                          @click="requestDelete(idx, photo.id, photo.is_main_img)"
                                          class="project_action delete_project">
                                        &nbsp;
                                    </span>
                                    <span
                                          @click="galleryIndex = idx"
                                          class="project_action view_project">
                                        &nbsp;
                                    </span>
                                </p>
                            </figcaption>
                        </figure>
                    </div>
                </template>
                <template v-if="showLoader == false && opened_project.photos && opened_project.photos.length <= 0">
                    <p class="text-center alert alert-warning mt-5" style="margin: 0 50px"> No image found</p>
                </template>

                <div class="text-center placeOrderContainer">
                    <template v-if="(shareCode && !emptyOrNull(projectSharedInfo)) || opened_project.main_thumb_url">
                        <span class="placeOrder mb-10" @click="placeOrder" style="cursor:pointer;">
                             <template v-if="reorder_project">Place Reorder</template>
                            <template v-else="">Place Order</template>
                        </span>
                    </template>
                </div>
            </div>
        </div>
        <!--modal code starts-->
        <b-modal ref="addUpdateCouponModal" id="addUpdateCouponModal" title="Share Project" :hide-footer="true"
                 @close="modalAction('hide')" no-close-on-esc no-close-on-backdrop
        >
            <div class="columns is-multiple mt-2">
                <div class="column is-12 pb-0">
                    <b-form-group label="Email" label-for="title" invalid-feedback="Email is required">
                        <b-form-input name="email" id="email" v-model="email" class="input customInput"
                                      v-validate="'required|email'" :class="[errors.first('email') ? 'field_error' : '']"
                        ></b-form-input>
                        <b-popover v-if="errors.first('email')" :target="'email'" triggers="hover focus"
                                   :placement="'leftbottom'" :content="errors.first('email')"
                        >
                        </b-popover>
                    </b-form-group>
                </div>
            </div>
            <div class="columns is-multiple text-center">
                <div class="column is-12 btnsContainter">
                    <b-button type="button" variant="success" class="customButtonMedium width_200 mediumColor"
                              @click="shareProject($event)" ref="shareBtn" >Share</b-button>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    const fb = require("../config/firebaseConfig.js");
    import VueGallery from 'vue-gallery';
    export default {
        name: "ViewProject",
        props: ["projectId", "shareCode"],
        components: {
            'gallery': VueGallery
        },
        watch:{
            opened_project(newVal, oldVal) {
                let self = this;
                if(!self.emptyOrNull(newVal)) {
                    newVal.photos.forEach((photo, pIdex) => {
                        let url = self.s3_base_url+self.projectId+'/preview_'+photo.name
                        self.photos.push(url);
                        self.galleryImages.push(url);
                    })
                }
            }
        },
        data() {
            return {
                opened_project: {},
                order_route_params_obj:{},
                currentUser: {},
                projectSharedInfo:{},
                galleryIndex:null,
                photos:[],
                s3_base_url:process.env.VUE_APP_S3_BASE_URL,
                reorder_project: false,
                email:"",
                collage_uploaded:false,
                mozaix:[],
                mozaix_thumb:null,
                galleryImages:[],
                s3_base_url:process.env.VUE_APP_S3_BASE_URL,
            };
        },
        mounted(){
            let self = this;
            self.currentUser = self.$helpers.getCurrentUser();
            if(!self.emptyOrNull(self.currentUser)) {
                self.checkReorderingProject();
            }
            self.order_route_params_obj["projectId"] = self.projectId;
            if(self.shareCode) {
               self.order_route_params_obj["shareCode"] = self.shareCode;
               fb.projectSharedCollection.where("share_code", "==", self.shareCode).where("date_deleted", "==", null).get()
                   .then((projectSharedInfo) => {
                   if(projectSharedInfo.docs.length > 0) {
                       let sharedProjectInfo = projectSharedInfo.docs[0].data();
                       sharedProjectInfo["id"] = projectSharedInfo.docs[0].id;
                       self.projectSharedInfo = sharedProjectInfo;
                       self.getProjectWithPhotos();
                   } else {
                       self.simpleAlert({
                           type: "error",
                           text: "The Link has been expired or does not exist."
                       })
                       self.projectSharedInfo = {};
                       return false;
                   }
               }).catch((error) => {
                   self.consoleData("error getting shared code information: " + error);
               })
           } else {
                self.getProjectWithPhotos();
            }
            // if(!self.shareCode && !self.emptyOrNull(self.currentUser)) {
            //     self.getProjectWithPhotos();
            // }
        },
        created() {
            let self = this;
        },
        methods:{
            getProjectWithPhotos() {
                let self = this;
                self.opened_project = {};
                self.showLoader = true;
                let projectRef = fb.projectsCollection.doc(self.projectId);
                let opened_project = {};
                projectRef.get().then(function (dbProject) {
                    opened_project = dbProject.data();
                    opened_project["id"] = dbProject.id;
                    opened_project["photos"] = [];
                    projectRef.collection("photos").where("date_deleted", "==", null).orderBy("date_created", "desc").get().then(function (photosQuerySnapShot) {
                        let assetIndex = 0;
                        photosQuerySnapShot.forEach(function (assetDoc, adIndex) {
                            opened_project["photos"][assetIndex] = assetDoc.data()
                            opened_project["photos"][assetIndex]["id"] = assetDoc.id
                            assetIndex++;
                        })
                        self.opened_project = opened_project;
                        self.getProjectMozaix()
                        self.showLoader = false;
                    }).catch(function (error) {
                        self.showLoader = false;
                        self.consoleData("error getting photos: " + error)
                    })
                }).catch(function (error) {
                    self.showLoader = false;
                    self.consoleData("error getting project " + error)
                })
            },
            requestDelete(idx, photo_id, is_main_image) {
                let self = this;
                this.$swal({
                    title: "Are you sure?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#c31d8a",
                    cancelButtonColor: "#b9acd2",
                    confirmButtonText: "Yes, delete it!"
                }).then(result => {
                    if (result.value) {
                        self.showLoader = true;
                        let photosArray = this.$data.photos;
                        let batch = fb.db.batch();
                        let projectRef = fb.projectsCollection.doc(self.opened_project.id);
                        projectRef
                            .collection("photos")
                            .doc(photo_id)
                            .update({
                                date_updated: new Date(),
                                date_deleted: new Date(),
                            }).then(function () {

                        }).catch(function (error) {
                            self.showLoader = false;
                            self.consoleData("error deleting photo: " + error)
                        })

                        projectRef.get().then((projectDoc) => {
                            let update_data = {
                                date_updated: new Date(),
                                total_photos: parseInt(projectDoc.data().total_photos) - 1
                            }
                            if (is_main_image) {
                                update_data["main_image_id"] = null
                                update_data["main_thumb_url"] = null
                            }
                            projectRef.update(update_data).then(function () {
                                self.opened_project.total_photos = parseInt(self.opened_project.total_photos) - 1;
                            })
                        }).catch(function (error) {
                            self.showLoader = false;
                            self.consoleData("error updating project: " + error)
                        })
                        batch.commit().then(function () {
                            if (self.opened_project.photos && self.opened_project.photos.length > 0) {
                                self.opened_project.photos.splice(idx, 1);
                                if (is_main_image) {
                                    self.opened_project.main_image_id = null;
                                    self.opened_project.main_thumb_url = null;
                                }
                            }
                            self.showLoader = false;
                        });
                    }
                });
            },
            placeOrder() {
                let self = this;
                if(self.opened_project.photos && self.opened_project.photos.length >= 50) {
                    if(self.opened_project.main_thumb_url) {
                        self.$router.push({ name: 'ProjectOrderPage', params: self.order_route_params_obj})
                    } else {
                        self.simpleAlert({
                            type: "warning",
                            text: "You must select a main image before proceeding to checkout."
                        })
                    }
                } else {
                    this.$swal({
                        type: "warning",
                        text: "Your project must have at least 50 images before proceeding to checkout.",
                        allowOutsideClick: false,
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then(result => {
                        if (result.value) {
                            self.$router.push({ name: 'ProjectEdit', params: {projectId: self.projectId}})
                        }
                    });
                }
            },
            checkReorderingProject() {
                let self = this;
                self.fb.usersCollection.doc(self.currentUser.uid).get().then((userQuerySnapShot) => {
                    let user_data = userQuerySnapShot.data();
                    user_data["uid"] = userQuerySnapShot.id;
                    //self.currentUser = user_data;
                    self.reorder_project = user_data.ordered_projects.some((ordered_project) => {
                        return ordered_project == self.projectId
                    })
                })
            },
            shareProject() {
                let self = this;
                self.$validator.validateAll().then(valid => {
                    //if validation fails
                    if (!valid) {
                        self.$helpers.consoleData("form Validation Fails while adding coupon")
                        return false;
                    } else {// form validated
                        let url = process.env.VUE_APP_API_BASE_URL+"project/"+self.shareProjectId+"/share"
                        let data = {
                            email: self.email,
                            base_url: process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8080/",
                            shared_by: self.currentUser.email
                        }
                        if(!self.emptyOrNull(self.currentUser)) {
                            data["first_name"] = self.currentUser.first_name;
                            data["last_name"] = self.currentUser.last_name;
                        }
                        self.showLoader = true;
                        self.$http.post(url, data).then(response => {
                            let response_data = response.body;
                            if(response_data.success) {
                                let share_code = response_data.data.share_code;
                                let project_id = response_data.data.project_id;
                                let share_with = response_data.data.share_with;
                                let data = {
                                    project_id: project_id,
                                    share_code: share_code,
                                    share_with: share_with,
                                    shared_by: self.currentUser.email,
                                    shared_by_id: self.currentUser.uid,
                                    used: false,
                                }
                                data = self.$helpers.addTimestamps(data);
                                self.fb.projectSharedCollection.add(data).then((addedDoc) => {
                                    self.showLoader = false;
                                    self.simpleAlert({
                                        type: "success",
                                        text: "Your project has been shared with "+share_with
                                    })
                                    self.showLoader = false;
                                    self.modalAction("hide", null, event);
                                }).catch((error) => {
                                    self.showLoader = false;
                                    self.consoleData("error sharing project: "+error);
                                })
                            } else {
                                self.showLoader = false;
                                self.simpleAlert({
                                    type:"error",
                                    text: response_data.errors[0]
                                });
                            }
                        }, response => {
                            self.consoleData("error vue resource");
                            self.showLoader = false;
                            self.simpleAlert({
                                type:"error",
                                text: "Something went wrong. Please try again"
                            });
                        });
                    }
                });
            },
            modalAction(action, project_id=null, btn=null) {
                let self = this;
                if(project_id) {
                    self.shareProjectId = project_id;
                }
                if(action == "show") {
                    self.$bvModal.show("addUpdateCouponModal");
                }
                if(action == "hide") {
                    if(btn) {
                        btn.target.disabled = false;
                    }
                    self.email = "";
                    self.shareProjectId = null;
                    self.$bvModal.hide("addUpdateCouponModal");
                }
            },
            getProjectMozaix() {
                let self = this;
                self.fb.ordersCollection.where("project_id", "==", self.projectId).where("collage_uploaded","==", true)
                    .where("date_deleted", "==", null ).get().then((ordersQuerySnapShot) => {
                        let total_orders = ordersQuerySnapShot.docs.length;
                        if(total_orders > 0) {
                            let order_data = ordersQuerySnapShot.docs[0].data();
                            order_data["id"] = ordersQuerySnapShot.docs[0].id;
                            self.fb.ordersCollection.doc(order_data.id).collection("collages").where("date_deleted", "==", null )
                                .orderBy("date_created", "desc").get().then((collagesQuerySnapShot) => {
                                    let collages_count = 0;
                                collagesQuerySnapShot.forEach((collageDoc) => {
                                    let collage_data = collageDoc.data();
                                    collage_data["id"] = collageDoc.id;
                                    self.collage_uploaded = true;
                                    let url = self.s3_base_url+"order_collages/"+order_data.id+"/customer_"+collage_data.name
                                    self.mozaix.push(url);
                                    if(collages_count == 0) {
                                        self.mozaix_thumb = self.s3_base_url+"order_collages/"+order_data.id+"/thumb_"+collage_data.name;
                                    }
                                    collages_count = parseInt(collages_count) + 1;
                                })
                            })

                        }
                })
            },
            showMozaixGallery() {
                let self = this;
                let mozaixGallery = JSON.stringify(self.mozaix)
                self.galleryImages = JSON.parse(mozaixGallery)
                self.galleryIndex = 0;
            },
            closeGallery() {
                let self = this;
                self.galleryIndex = null;
                let projectPhotos = JSON.stringify(self.photos);
                self.galleryImages = JSON.parse(projectPhotos);
            }
        }

    }
</script>

<style>

</style>
