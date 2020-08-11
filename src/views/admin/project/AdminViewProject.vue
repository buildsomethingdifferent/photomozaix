<template>
    <div class="adminProject">
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        
        <div class="flexElem mb-3">
            <div>
                <span  @click="$router.go(-1)" style="cursor: pointer" class="go_back_admin">
                    <i class="fal fa-angle-left"></i> Go Back
                </span>
            </div>
        </div>
        
        <div class="col-md-12 text-center">
            <div class="panelHeading mb-1">
                {{opened_project.title | capitalize}}
            </div>
            <div class="num-img text-center mb-5">
                <strong>Total images:</strong>
                {{ opened_project.photos ? opened_project.photos.length : "0" }}
            </div>
        </div>
        <div class="projectViewContainer flexResponsive">
            <div class="project-side">
                <div class="project-controls">
                    <div ref="projectMainImg" class="main-img-block text-center">
                        <img v-if="opened_project.main_thumb_url" :src="s3_base_url+opened_project.id+'/thumb_'+opened_project.main_image_name"/>
                        <img v-else src="@/assets/thumb-default.jpg"/>
                        <div class="mt-2"><strong>Main Image</strong></div>
                    </div>
                    <hr class="light">
                    <div v-if="collage_uploaded" class="main-img-block text-center mt-3 sfs">
                        <div class="mosaic_img hover_dark">
                            <img :src="mozaix_thumb"/>
                        </div>
                        <div @click="showMozaixGallery"
                             class="mt-3 project_action view_project" title="view mozaix">
                        </div>
                    </div>
                </div>
            </div>
            <div class="project-main">
                <template v-if="opened_project.photos && opened_project.photos.length > 0 &&  !showLoader">
                    <!--<gallery :images="photos" :index="galleryIndex" @close="galleryIndex = null"></gallery>-->
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
            </div>
        </div>
    </div>
</template>

<script>
    const fb = require("../../../config/firebaseConfig.js");
    import VueGallery from 'vue-gallery';
    export default {
        name: "AdminViewProject",
        props: ["projectId"],
        components: {
            'gallery': VueGallery
        },
        data() {
            return {
                loading: {type: Boolean},
                opened_project: {},
                s3_base_url:process.env.VUE_APP_S3_BASE_URL,
                galleryIndex:null,
                photos:[],
                mozaixIndex:null,
                mozaix:[],
                collage_uploaded:false,
                galleryImages:[],
                mozaix_thumb:null,
            };
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
        mounted(){
            let self = this;
            self.loading = true;
            self.getProjectWithPhotos();
            self.loading = false;
        },
        methods:{
            getProjectWithPhotos() {
                let self = this;
                let projectRef = fb.projectsCollection.doc(self.projectId);
                let opened_project = {};
                self.showLoader = true;
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
                         self.getProjectMozaix();
                        self.showLoader = false;
                    }).catch(function (error) {
                        self.showLoader = false;
                        self.consoleData("error getting photos: " + error)
                    })
                }).catch(function (error) {
                    self.consoleData("error getting project " + error)
                })
            },
            getProjectMozaix() {
                let self = this;
                self.fb.ordersCollection.where("project_id", "==", self.projectId).get().then((ordersQuerySnapShot) => {
                    ordersQuerySnapShot.forEach((orderDoc) => {
                        if(orderDoc.data().collage_uploaded) {
                            let order_data = orderDoc.data();
                            self.fb.ordersCollection.doc(orderDoc.id).collection("collages").get().then((collagesQuerySnapShot) => {
                                let collages_count = 0;
                                collagesQuerySnapShot.forEach((collageDoc) => {
                                    let collage_data = collageDoc.data();
                                    collage_data["id"] = collageDoc.id;
                                    self.collage_uploaded = true
                                    let mozaix_url = self.s3_base_url+"order_collages/"+orderDoc.id+"/customer_"+collage_data.name;
                                    self.mozaix.push(mozaix_url);
                                    if(collages_count == 0) {
                                        self.mozaix_thumb = self.s3_base_url+"order_collages/"+orderDoc.id+"/thumb_"+collage_data.name;
                                    }
                                    collages_count = parseInt(collages_count) + 1;
                                })
                            })
                        }
                    })
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
