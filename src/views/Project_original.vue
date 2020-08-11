<template>
  <div class="project">
    <router-link to="/dashboard" class="back"><i class="fal fa-angle-left"></i> Back to Your Projects</router-link>
    <h1 v-if="hasOrder">View Your Project</h1>
    <h1 v-else>Edit Your Project</h1>
    <div v-if="loading">Loading...</div>
    <form :key="idx" v-for="(p,idx) in projects" @submit.prevent="saveProject">
      <div class="project-side">
        <div class="project-controls">
          <input type="hidden" v-model="checkoutId" />
          <div class="buttons">
          <button class="button secondary" @click="saveProject">Save Project</button>
          <button class="button next" type="button" v-bind:disabled="isCheckoutDisabled" @click="checkout"><span v-if="hasOrder">Order Again</span><span v-else>Select Quantity</span> <i class="fal fa-angle-right"></i></button>
          </div>
          <div>
            <div class="title-block">
                <label for="projectTitle">Project Title</label><br>
                <input type="text" v-model="projectTitle" required v-on:blur="saveTitle" />
            </div>
          </div>
          <div class="instructions" v-if="!hasOrder"><strong>To Get Started:</strong>
            <ol>
              <li>Upload your photos</li>
              <li>Select your main image</li>
              <li>Save your project</li>
              <li>And click "Select Quantity"</li>
            </ol>
          </div>
          <div class="num-img" v-if="numImages"><strong>Number of images:</strong> {{ numImages }}</div>
          <div ref="projectMainImg" class="main-img-block">
            <span><strong>Main Image</strong></span><br>
            <img v-if="projectMainImg" :src="projectMainImg" /><img v-else src="../assets/thumb-default.jpg" />
          </div>
        </div>
      </div>
      <div class="project-main">
        <vue-dropzone v-if="hasOrder == false" :options="dropzoneOptions" :useCustomSlot=true id="photoUpload" ref="customDropzone" v-on:vdropzone-file-added="fileAdded" v-on:vdropzone-reset="cleanupDropzone">
          <div class="dropzone-custom-content">
              <p><span class="subtitle dropzone-custom-title">Drag and drop to upload photos.</span><br>
              &#8230;or click to select a file from your computer</p><br><p>Accepted file type: jpg</p><br>
              <p>Note: We suggest using 100-200 photos to create your PhotoMozaix.<br>
                <b><u>You can use as few as 50 photos, but the images will repeat a few times each.</u></b></p>
        </div>
        </vue-dropzone>
        <div class="photo-grid">
          <figure :key="idx" v-for="(photo, idx) in photos" v-bind:class="{'main-img photo': photo.properties.is_main_img, 'main-img-disabled photo': !photo.properties.is_main_img}"><img v-if="photo.properties.thumb_url" :src="photo.properties.thumb_url" :alt="photo.properties.name" :id="photo.id" /><div v-else>Loading...</div><figcaption><p class="img-controls" v-if="!hasOrder"><span ref="markMainImage" @click="markMainImage(idx)" v-if="!photo.properties.is_main_img" class="main-img-btn"><i class="fas fa-star"></i> Set As Main Image</span><span v-else class="main-img-btn"><i class="fas fa-star"></i> Main Image</span><br><span @click="requestDelete(idx)" class="delete-project">Delete <i class="far fa-trash-alt"></i></span></p></figcaption></figure>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
const uuidv4 = require("uuid/v4");
import vue2Dropzone from "vue2-dropzone";
const fb = require("../config/firebaseConfig.js");
// const shopify = require("../config/shopifyConfig.js");
export default {
  name: "Project",
  props: ["projectId"],
  data() {
    return {
      dropzoneOptions: {
        url: "/",
        addRemoveLinks: true,
        method: "put",
        autoQueue: true,
        autoProcessQueue: false,
        acceptedFiles: '.jpg,.jpeg'
      },
      loading: { type: Boolean },
      hasOrder: { type: Boolean },
      numImages: "0",
      projects: [],
      photos: [],
      projectMainImg: "",
      projectTitle: "",
      checkoutId: "",
      filePath: "",
      mainImgId: "",
      isCheckoutDisabled: { type: Boolean }
    };
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  mounted() {
    this.loading = true;
    this.isCheckoutDisabled = false;
    const userId = this.$store.state.currentUser.uid;
    let projectRef = fb.projectsCollection.doc(this.projectId);
    let photosRef = fb.projectsCollection
      .doc(this.projectId)
      .collection("photos");
    projectRef.onSnapshot(snap => {
      if (snap.exists) {
        let project_data = snap.data();
        if (project_data.user == userId) {
          const projects = [];
          projects.push(project_data);
          this.projects = projects;
          this.projectMainImg = project_data.main_thumb_url;
          this.projectTitle = project_data.title;
          this.checkoutId = project_data.checkout_id;
          this.hasOrder = false
          const hasOrder = false
          fb.ordersCollection
            .where("project", "==", this.projectId)
            .get()
            .then(snap => {
              snap.forEach(doc => {
                const hasOrder = false;
                shopify.checkout.fetch(doc.id).then(checkout => {
                  if (checkout.completedAt) {
                    const hasOrder = true
                    this.hasOrder = hasOrder
                  }
                })
              })
            })


          photosRef.orderBy('date_created','desc').onSnapshot(snap => {
            if (!snap.empty) {
              const photos = [];
              snap.forEach(doc => {
                photos.push({ id: doc.id, properties: doc.data() });
                if (doc.data().is_main_img) {
                    this.$data.mainImgId = doc.id
                }
              });
              this.photos = photos;
              this.loading = false;
              this.numImages = photos.length;
            } else {
              this.loading = false;
            }
          });
        } else {
          this.$router.push({name: "UserDashboard"});
        }
      } else {
        this.errorMsg = "Something went wrong. Please try again.";
      }
    });
  },
  methods: {
    saveTitle() {
      let self = this;
      let projectRef = fb.projectsCollection.doc(this.projectId);
      projectRef
        .update({ title: this.projectTitle })
        .then(() => {
         self.consoleData("Title saved.");
        })
        .catch(function(error) {
          self.consoleData("Error writing document: ", error);
        });
    },
    fileAdded(file) {
      const reader = new FileReader();
      this.isCheckoutDisabled = true;
      reader.onload = e => {
        let projectRef = fb.projectsCollection.doc(this.projectId);
        let photosRef = projectRef.collection("photos");
        let fileName = file.name
        const docId = uuidv4();
        let dateCreated = new Date();
        photosRef.doc(docId).set({
            name: fileName,
            url: '',
            thumb_url: '',
            date_created: dateCreated,
            is_main_img: false
        })
        .then(() => {
          this.storageUpload(docId, e.target.result, file, r => {
            let fileDownloadUrl = r.object_info.publicURL
            photosRef.doc(docId).update({
              url: fileDownloadUrl
            })
            .then(() => {
                this.$refs.customDropzone[0].removeFile(file);
            })
            .catch(err => {
                console.log(err);
            });
          })
        })
        .catch(err => {
            console.log(err);
        });
      };
      reader.readAsDataURL(file);
    },
    storageUpload(docId, filedata, filehandle, cb) {
      var progressBar = filehandle.previewElement.children[2];
      let uuid_string = docId;
      this.filePath = this.projectId + "/" + uuid_string
      const imageRef = fb.storageRef.child(this.filePath);
      var task = imageRef.putString(filedata, "data_url");
      progressBar.opacity = 1;
      task.on(
        "state_changed",
        function progress(snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressBar.children[0].style.width = progress + "%";
        },
        function(error) {
          console.log(error);
        },
        function() {
            task.snapshot.ref
            .getMetadata()
            .then(meta => {
            console.log(meta);
                task.snapshot.ref.getDownloadURL().then(downloadURL => {
                    var previewEl = filehandle.previewElement
                    previewEl.remove();
                    var response = {
                        object_info: {
                            publicURL: downloadURL,
                            uuid: uuid_string
                        }
                    }
                    return cb(response);
                })
            })
            .catch(err => {
                console.log(err);
            });
            progressBar.style.opacity = 0;
        }
      );
    },
    'showSuccess': function(file) {
      console.log('file uploaded')
    },
    cleanupDropzone() {
      console.log("Cleaning up...");
      this.isCheckoutDisabled = false;
    },
    markMainImage(idx) {
        let projectRef = fb.projectsCollection.doc(this.projectId);
        let photosArray = this.$data.photos;
        if(this.$data.mainImgId) {
            projectRef
            .collection("photos")
            .doc(this.$data.mainImgId)
            .update({
              is_main_img: false
            })
            .then(() => {
                console.log('Removed main image.')
            })
            .catch(err => {
              console.log(err);
            });
        }
        this.$data.mainImgId = photosArray[idx].id
        projectRef
            .collection("photos")
            .doc(this.$data.mainImgId)
            .update({
              is_main_img: true
            })
            .then(() => {
                projectRef.update({ main_thumb_url: photosArray[idx].properties.thumb_url })
                console.log('Updated main image.')
            })
            .catch(err => {
              console.log(err);
        });
    },
    requestDelete(idx) {
        this.$swal({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#c31d8a",
            cancelButtonColor: "#b9acd2",
            confirmButtonText: "Yes, delete it!"
        }).then(result => {
            if (result.value) {
                let photosArray = this.$data.photos;
                let projectRef = fb.projectsCollection.doc(this.projectId);
                projectRef
                .collection("photos")
                .doc(photosArray[idx].id)
                .delete()
                .then(() => {
                    let filePath = this.projectId+'/'+photosArray[idx].id
                    let thumbFilePath = this.projectId+'/thumb_'+photosArray[idx].id
                    fb.storageRef.child(filePath)
                    .delete()
                    .then(() => {
                        fb.storageRef.child(thumbFilePath)
                        .delete()
                        .then(() => {
                            photosArray.splice(idx, 1);
                            console.log("Document successfully deleted!");
                        })
                    })
                    if (photosArray[idx].properties.is_main_img) {
                        projectRef.update({ main_thumb_url: "" })
                    }
                })
                .catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            }
        });
    },
    saveProject() {
      this.$swal({
        position: "top-end",
        type: "success",
        title: "Your project has been saved",
        showConfirmButton: false,
        timer: 1500
      });
      return;
      //let project_id = docRef.id;
      //let storageRef = fb.storage.ref()
    },
    checkout() {
      // Check for existing checkout ID in project document
      // Create checkout object in Shopify
      // Save checkout ID to project document
      this.saveTitle();
      if ( this.projectMainImg ) {
        if(this.numImages<50) {
          this.$swal({
              text: "Your project must have at least 50 images before proceeding to checkout.",
              type: "warning",
              confirmButtonColor: "#c31d8a"
          })
        }
        else {
          if (this.checkoutId) {
            const checkout_id = this.checkoutId;
            const ordersRef = fb.ordersCollection.doc(checkout_id )
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
                            name: "Cart",
                            params: { checkoutId: checkout_id }
                          });
                        })
                        .catch(err => {
                          console.log(err);
                        });
                    });
                  });
                } else {
                  this.$router.push({
                    name: "Cart",
                    params: { checkoutId: checkout_id }
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
                    name: "Cart",
                    params: { checkoutId: checkout_id }
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            });
          }
        }
      }
      else {
        this.$swal({
            text: "You must select a main image before proceeding to checkout.",
            type: "warning",
            confirmButtonColor: "#c31d8a"
        })
      }
    
    }
  }
};
</script>
