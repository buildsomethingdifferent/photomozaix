<template>
    <div class="project">
        <div class="global_loader" v-show="showLoader">
            <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
        </div>
        <b-alert  :show="isFlashMessage($options.name)" dismissible @dismissed="dismissAlert"
                  :variant="$store.state.flashMessage.type">
            {{$store.state.flashMessage.message}}
        </b-alert>

        <router-link to="/dashboard" class="back"><i class="fal fa-angle-left"></i> Back to Your Projects</router-link>
        <h1>Edit Your Project</h1>
        <template v-if="size_errors > 0 || type_errors > 0">
            <b-alert  :show="true" dismissible @dismissed="hideDropzoneErrors"
                      variant="info">
                <ul>
                    <li v-if="uploaded_files > 0">
                        {{"[" + uploaded_files + "] "}}
                        {{uploaded_files == 1 ? "file is uploaded." : "files are uploaded."}}
                    </li>
                    <li v-if="size_errors > 0">
                        {{'The files with size less than 60 KB are not supported and the system did not upload '}}
                        {{ size_errors == 1 ? "this ":"these "}}
                        {{  '['+ size_errors +'] '}}
                        {{size_errors == 1 ? "File." : "Files."}}
                    </li>
                    <li v-if="type_errors > 0">
                        {{'The supported file types are jpg and jpeg so ['+type_errors+'] unsupported '}}{{type_errors == 1 ? "file type is not uploaded." : "file types are not uploaded."}}
                    </li>
                </ul>
            </b-alert>
        </template>
        <div v-if="serverErrors.length > 0">
            <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
                <ul>
                    <li v-for="error in serverErrors">{{error}}</li>
                </ul>
            </b-alert>
        </div>
        <form v-on:submit.prevent="saveTitle(false)">
            <div class="project-side">
                <div class="project-controls">
                    <input type="hidden" v-model="checkoutId"/>
                    <div>
                        <div class="columns">
                            <div class="column">
                                <span class="placeOrder primaryColor" @click="saveTitle(true)" style="cursor: pointer;">Save</span>
                            </div>
                            <div class="column is-half" v-if="opened_project.main_thumb_url">
                                <span class="placeOrder primaryColor" @click="goToNextPage" style="cursor: pointer;">Next</span>
                            </div>
                        </div>

                        <div class="title-block">
                            <label for="projectTitle">Project Title</label><br>
                            <input type="text" class="projectTitleInput" id="projectTitle" v-model="project_title"
                            onFocus="this.value=='Untitled Project'? this.value='':''" onBlur="this.value==''?this.value='Untitled Project':''"/>
                        </div>
                    </div>
                    <div class="instructions"><strong>To Get Started:</strong>
                        <ol>
                            <li><span>1</span> <span>Upload your photos</span></li>
                            <li><span>2</span> <span>Select your main image</span></li>
                            <li><span>3</span> <span>Save your project</span></li>
                            <li><span>4</span> <span>And click "Select Quantity"</span></li>
                        </ol>
                    </div>
                    <div class="num-img">
                        <strong>Number of images:</strong>
                        {{ opened_project.photos ? opened_project.photos.length : "0" }}
                    </div>
                    <div ref="projectMainImg" class="main-img-block">
                        <span><strong>Main Image </strong></span><br>
                        <img v-if="opened_project.main_thumb_url" :src="s3_base_url+projectId+'/thumb_'+opened_project.main_image_name"/>
                        <img v-else src="../assets/thumb-default.jpg"/>
                    </div>
                </div>
            </div>
            <div class="project-main">
                <vue-dropzone v-if="opened_project.status=='new'"
                              :options="dropzoneOptions" :useCustomSlot=true id="photoUpload"
                              ref="customDropzone"
                              v-on:vdropzone-reset="cleanupDropzone"
                              v-on:vdropzone-mounted="vdropzoneMounted"
                              v-on:vdropzone-sending-multiple="vdropzoneSendingMultiple"
                              v-on:vdropzone-success-multiple="vdropzoneSuccessMultiple"
                              v-on:vdropzone-queue-complete="vdropzoneQueueComplete"
                              v-on:vdropzone-error-multiple="vdropzoneErrorMultiple"
                              v-on:vdropzone-files-added="vdropzoneFilesAdded"
                              v-on:vdropzone-max-files-reached="vdropzoneMaxFilesReached"
                              v-on:vdropzone-max-files-exceeded="vdropzoneMaxFilesExceeded"
                              v-on:vdropzone-removed-file="vdropzoneRemovedFile"
                              v-on:vdropzone-thumbnail="vdropzoneThumbnail"

                >
                    <div class="dropzone-custom-content">
                        <p><span class="subtitle dropzone-custom-title">Drag and drop to upload photos.</span><br>
                            &#8230;or click to select a file from your computer</p><br>
                        <p>Accepted file type: jpg, jpeg</p><br>
                        <p>Note: We suggest using 100-200 photos to create your PhotoMozaix.<br>
                            <b><u>You can use as few as 50 photos, but the images will repeat a few times each.</u></b></p>
                        <p>
                            <strong>Max <big>40</big> photos at one time.</strong>
                        </p>
                    </div>
                </vue-dropzone>
                <template v-if="opened_project.photos && opened_project.photos.length > 0 && !showLoader">
                    <div class="photo-grid">
                        <gallery :images="photos" :index="galleryIndex" @close="galleryIndex = null"></gallery>
                        <figure :key="idx" v-for="(photo, idx) in opened_project.photos"
                                v-bind:class="[photo.is_main_img ? 'main-img photo' : 'main-img-disabled photo']"
                        >
                            <div v-if="photo.url">
                                <!--todo replace with thumb image when lamda function created for thumbnails-->
                                <img :src="s3_base_url+projectId+'/thumb_'+photo.name"
                                 :alt="photo.original_name"
                                 :id="photo.id"/>
                            </div>
                            <div v-else>Loading...</div>
                            <figcaption>
                                <p class="img-controls setMainImg">
                                    <template v-if="opened_project.status=='new'">
                                        <span @click="markMainImage(idx, photo.id, photo.url, photo.name)"
                                              v-if="!photo.is_main_img" class="isMainImg">
                                            Set As Main Image
                                        </span>
                                    </template>
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

                    <div class="placeOrderContainer text-center">
                        <template v-if="opened_project.main_thumb_url">
                            <router-link :to="{name:'ProjectView', params: {projectId: projectId}}" class="placeOrder primaryColor">Next</router-link>
                        </template>
                    </div>
                </template>
            </div>
        </form>
    </div>
</template>
<script>
    const uuidv4 = require("uuid/v4");
    import vue2Dropzone from "vue2-dropzone";

    const fb = require("../config/firebaseConfig.js");
    import VueGallery from 'vue-gallery';
    export default {
        name: "EditProject",
        props: ["projectId"],
        components: {
            'gallery': VueGallery,
            'vueDropzone': vue2Dropzone
        },
        watch:{
            opened_project(newVal, oldVal) {
                let self = this;
                if(!self.emptyOrNull(newVal)) {
                    newVal.photos.forEach((photo, pIdex) => {
                        let url = self.s3_base_url+self.projectId+'/preview_'+photo.name
                        self.photos.push(url);
                    })
                }
            },
            project_title(newVal, oldVal) {
                let self = this;
                self.old_project_title = oldVal
            }
        },
        data() {
            return {
                dropzoneOptions: {
                    url: process.env.VUE_APP_API_BASE_URL + "upload/project/photos",
                    addRemoveLinks: false,
                    method: "post",
                    autoQueue: true,
                    autoProcessQueue: true,
                    // acceptedFiles: '.jpg,.jpeg',
                    uploadMultiple: false,
                    parallelUploads: "500",
                    timeout:"3600000",
                    maxFiles:41
                },
                loading: {type: Boolean},
                hasOrder: {type: Boolean},
                numImages: "0",
                projects: [],
                photos: [],
                projectMainImg: "",
                projectTitle: "",
                checkoutId: "",
                filePath: "",
                mainImgId: "",
                isCheckoutDisabled: {type: Boolean},
                serverErrors: [],
                showDismissibleAlert: false,
                active_dropzone: "",
                opened_project: {},
                galleryIndex:null,
                photos:[],
                project_title: "",
                old_project_title: "",
                s3_base_url:process.env.VUE_APP_S3_BASE_URL,
                size_errors: 0,
                type_errors: 0,
                uploaded_files: 0,
            };
        },
        mounted() {
            let self = this;
            self.removeFlashMessage(self.$options.name);
            self.loading = true;
            self.getProjectWithPhotos();
            self.loading = false;

        },
        methods: {
            saveTitle(btnClicked=false) {
                let self =this;
                if(self.project_title) {
                    self.showLoader = true;
                    let title = self.project_title.toLowerCase();
                    let titleTerms = self.getStringTerms(title);
                    let projectRef = fb.projectsCollection.doc(self.projectId);
                    projectRef
                        .update({title: title, title_terms:titleTerms, date_updated: new Date()})
                        .then(() => {
                            self.consoleData("Project saved.");
                            self.showLoader = false;
                            if(btnClicked) {
                                self.$router.push({name: "UserDashboard"})
                            } else {
                                self.simpleAlert({
                                    type: "success",
                                    text: "Project Title Saved"
                                })
                                $("#projectTitle").trigger('focusout');
                            }
                            self.project_title =self.$options.filters.capitalize(self.project_title)
                        })
                        .catch(function (error) {
                            self.consoleData("Error writing document: "+ error);
                        });
                } else {
                    self.simpleAlert({
                        type: "error",
                        text: "Title field can not be empty"
                    })
                    self.project_title = self.old_project_title;
                    self.project_title =self.$options.filters.capitalize(self.project_title)
                }
            },
            cleanupDropzone() {
                let self = this;
                self.consoleData("Cleaning up...");
                self.isCheckoutDisabled = false;
            },
            markMainImage(index, photo_id, image_url, name) {
                let self = this;
                let batch = fb.db.batch();
                self.showLoader = true;
                let projectRef = fb.projectsCollection.doc(self.projectId);
                projectRef.update({
                    main_thumb_url: image_url,
                    main_image_id: photo_id,
                    main_image_name: name
                })
                projectRef.collection("photos").where("is_main_img", "==", true).get().then(function (photosQuerySnapShot) {
                    photosQuerySnapShot.forEach(function (photoDoc) {
                        projectRef.collection("photos").doc(photoDoc.id).update({
                            is_main_img: false
                        }).then(function () {

                        }).catch(function (error) {
                            self.showLoader = false;
                        })
                    })
                    projectRef.collection("photos").doc(photo_id).update({
                        is_main_img: true,
                    }).then(function () {

                    }).catch(function (error) {
                        self.showLoader = false;
                    })
                })

                batch.commit().then(function () {
                    self.opened_project.main_thumb_url = image_url
                    self.opened_project.main_image_id = photo_id;
                    self.opened_project.main_image_name = name;
                    self.opened_project.photos.some(function (photo) {
                        if (photo.is_main_img) {
                            photo.is_main_img = false;
                            return true;
                        }
                    })
                    self.opened_project.photos[index].is_main_img = true;
                    self.showLoader = false;
                });
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
                                update_data["main_image_name"] = null
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
                                self.photos.splice(idx, 1);
                                if (is_main_image) {
                                    self.opened_project.main_image_id = null;
                                    self.opened_project.main_image_name = null;
                                    self.opened_project.main_thumb_url = null;
                                }
                            }
                            self.showLoader = false;
                        });
                    }
                });
            },
            checkout() {
                // Check for existing checkout ID in project document
                // Create checkout object in Shopify
                // Save checkout ID to project document
                this.saveTitle(false);
                if (this.projectMainImg) {
                    if (this.numImages < 50) {
                        this.$swal({
                            text: "Your project must have at least 50 images before proceeding to checkout.",
                            type: "warning",
                            confirmButtonColor: "#c31d8a"
                        })
                    } else {
                        if (this.checkoutId) {
                            const checkout_id = this.checkoutId;
                            const ordersRef = fb.ordersCollection.doc(checkout_id)
                            ordersRef.get()
                                .then((docSnapshot) => {
                                    if (docSnapshot.exists) {
                                        ordersRef.onSnapshot(() => {
                                            shopify.checkout.create().then(checkout => {
                                                let projectRef = fb.projectsCollection.doc(this.projectId);
                                                const checkout_id = checkout.id;
                                                projectRef
                                                    .update({
                                                        checkout_id: checkout.id
                                                    })
                                                    .then(() => {
                                                        this.$router.push({
                                                            name: "cart",
                                                            params: {checkoutId: checkout_id}
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });
                                            });
                                        });
                                    } else {
                                        this.$router.push({
                                            name: "cart",
                                            params: {checkoutId: checkout_id}
                                        });
                                    }
                                });

                        } else {
                            shopify.checkout.create().then(checkout => {
                                let projectRef = fb.projectsCollection.doc(this.projectId);
                                const checkout_id = checkout.id;
                                projectRef
                                    .update({
                                        checkout_id: checkout.id
                                    })
                                    .then(() => {
                                        this.$router.push({
                                            name: "cart",
                                            params: {checkoutId: checkout_id}
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            });
                        }
                    }
                } else {
                    this.$swal({
                        text: "You must select a main image before proceeding to checkout.",
                        type: "warning",
                        confirmButtonColor: "#c31d8a"
                    })
                }

            },
            vdropzoneMounted() {
                let self = this;
                self.active_dropzone = self.$refs.customDropzone;
            },
            vdropzoneSendingMultiple(files, xhr, formData) {
                let self = this;
                self.showLoader = true;
                self.hideDropzoneErrors();
                formData.append("project_id", this.projectId)
            },
            vdropzoneSuccessMultiple(files, response) {
                let self = this;
                if (response.success == false) {
                    self.serverErrors = response.errors;
                    self.showDismissibleAlert = true;
                    self.active_dropzone.removeAllFiles()
                } else {
                    let uploaded_photos = response.data.uploaded_images;
                    let batch = fb.db.batch();
                    let projectRef = fb.projectsCollection.doc(self.projectId);
                    if(self.project_title) {
                        projectRef.update({
                            title: self.project_title,
                            date_updated: new Date(),
                        }).then(() => {
                            self.consoleData("project title updated")
                        }).catch(error => {
                            self.consoleData("error updating project title : "+error)
                        })
                    }
                    let projectphotosRef = projectRef.collection("photos");
                    uploaded_photos.forEach(function (asset, aIndex) {
                        batch.set(projectphotosRef.doc(), self.$helpers.addTimestamps(asset, true))
                    })
                    if(parseInt(response.data.uploaded_images.length) > 0) {
                        projectRef.update({
                            total_photos: parseInt(self.opened_project.total_photos) + parseInt(response.data.uploaded_images.length)
                        })
                    }
                    batch.commit().then(function () {
                        self.size_errors = response.data.size_errors;
                        self.type_errors = response.data.type_errors;
                        self.uploaded_files = response.data.uploaded_images.length;
                        self.getProjectWithPhotos();
                        self.active_dropzone.removeAllFiles()
                    });

                }
            },
            vdropzoneQueueComplete() {
                let self = this;
                self.consoleData("vdropzoneQueueComplete")
                self.showLoader = false;
            },
            vdropzoneErrorMultiple(files, message) {
                let self = this;
                self.consoleData("error multiple: "+message)
                self.showLoader = false;
            },
            getProjectWithPhotos() {
                let self = this;
                let projectRef = fb.projectsCollection.doc(self.projectId);
                let opened_project = {};
                self.showLoader = true;
                projectRef.get().then(function (dbProject) {
                    opened_project = dbProject.data();
                    opened_project["id"] = dbProject.id;
                    opened_project["photos"] = [];
                    self.photos  = [];
                    projectRef.collection("photos").where("date_deleted", "==", null).orderBy("date_created", "desc")
                        .get().then(function (photosQuerySnapShot) {
                        let assetIndex = 0;
                        photosQuerySnapShot.forEach(function (assetDoc, adIndex) {
                            opened_project["photos"][assetIndex] = assetDoc.data()
                            opened_project["photos"][assetIndex]["id"] = assetDoc.id;
                            assetIndex++;
                        })
                        self.opened_project = opened_project;
                        self.project_title =  self.$options.filters.capitalize(opened_project.title);
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
            vdropzoneFilesAdded(files) {
                let self = this;
            },
            vdropzoneMaxFilesExceeded(filee) {
                this.consoleData("vdropzoneMaxFilesExceeded", file)
            },
            vdropzoneMaxFilesReached(files) {
                let self = this;
                let removeIndexes = [];
                $.each(files, (fIdx, file) => {
                    removeIndexes.push(file);
                })
                removeIndexes.forEach((rIndex,rIdx) => {
                    self.active_dropzone.removeFile(rIndex);
                })
            },
            hideDropzoneErrors() {
                let self = this;
                self.type_errors = 0;
                self.size_errors = 0;
                self.uploaded_files = 0;
            },
            goToNextPage() {
                let self = this;
                if(self.project_title) {
                    self.showLoader = true;
                    let title = self.project_title.toLowerCase();
                    let titleTerms = self.getStringTerms(title);
                    let projectRef = fb.projectsCollection.doc(self.projectId);
                    projectRef
                        .update({title: title, title_terms:titleTerms, date_updated: new Date()})
                        .then(() => {
                            self.consoleData("Project saved.");
                            self.showLoader = false;
                            self.$router.push({name:'ProjectView', params: {projectId: self.projectId}});
                        })
                        .catch(function (error) {
                            self.consoleData("Error writing document: "+ error);
                        });
                } else {
                    self.$router.push({name:'ProjectView', params: {projectId: self.projectId}});
                }
            },
            vdropzoneThumbnail(file, dataUrl) {
                let self = this;
                console.log("thumb")
            },
            vdropzoneRemovedFile(file, error, xhr) {
                console.log("file removed", file, error, xhr)
            },
        }
    };
</script>
