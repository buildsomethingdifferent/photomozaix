<template>
  <div class="dashboard">
    <div class="global_loader" v-show="showLoader">
      <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
    </div>
    <b-alert
      :show="isFlashMessage('Dashboard')"
      dismissible
      @dismissed="dismissAlert"
      :variant="$store.state.flashMessage.type"
    >{{$store.state.flashMessage.message}}</b-alert>
    <h1>Shared Projects</h1>
    <div class="start-new-project">
      <p>
        Ready to make something memorable?
        <button
          @click="createNewProject"
          class="button"
        >Start New Project</button>
      </p>
    </div>

    <div v-if="projects.length > 0" class="project-grid">
      <div :key="idx" v-for="(project, idx) in projects" class="project" :id="project.id">
        <router-link
          :to="{ name: project.status == 'Ordered' ? 'ProjectView' : 'ProjectEdit',
                        params: { projectId: project.id }}"
          class="thumb_project"
        >
          <img
            v-if="project.main_thumb_url"
            :src="s3_base_url+project.id+'/thumb_'+project.main_image_name"
          />
          <img v-else src="../assets/thumb-default.jpg" />
        </router-link>
        <p class="project-title">
          <router-link
            :to="{ name: project.status == 'Ordered' ? 'ProjectView' : 'ProjectEdit',
                            params: { projectId: project.id }}"
          >{{ project.title | capitalize}}</router-link>
          <br />
          <span class="text-muted">
            No. of Images:
            <span class="no_count">{{project.total_photos}}</span>
          </span>
        </p>
        <div class="project-buttons">
          <router-link
            :to="{ name: 'ProjectView',
                                params: { projectId: project.id }}"
            class="project_action view_project"
          >&nbsp;</router-link>
          <span @click="modalAction('show', project.id)" class="project_action share_project">&nbsp;</span>
        </div>
      </div>
    </div>
    <div v-if="showLoader == false && projects.length <= 0">No project exists</div>
    <!--modal code starts-->
    <b-modal
      ref="addUpdateCouponModal"
      id="addUpdateCouponModal"
      title="Share Project"
      :hide-footer="true"
      @close="modalAction('hide')"
      no-close-on-esc
      no-close-on-backdrop
    >
      <div class="columns is-multiple mt-2">
        <div class="column is-12 pb-0">
          <b-form-group label="Email" label-for="title" invalid-feedback="Email is required">
            <b-form-input
              name="email"
              id="email"
              v-model="email"
              class="input customInput"
              v-validate="'required|email'"
              :class="[errors.first('email') ? 'field_error' : '']"
            ></b-form-input>
            <b-popover
              v-if="errors.first('email')"
              :target="'email'"
              triggers="hover"
              :placement="'leftbottom'"
              :content="errors.first('email')"
            ></b-popover>
          </b-form-group>
        </div>
      </div>
      <div class="columns is-multiple text-center">
        <div class="column is-12 btnsContainter">
          <b-button
            type="button"
            variant="success"
            class="customButtonMedium width_200 mediumColor"
            @click="shareProject($event)"
            ref="shareBtn"
          >Share</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "SharedWithMe",
  data() {
    return {
      loading: { type: Boolean },
      projects: [],
      hasOrder: { type: Boolean },
      currentUser: {},
      email: "",
      shareProjectId: null,
      s3_base_url: process.env.VUE_APP_S3_BASE_URL,
      start_at: null,
      start_after: null,
      per_page: 20
    };
  },
  created() {
    let self = this;
    self.removeFlashMessage(self.$options.name);
    self.currentUser = self.$helpers.getCurrentUser();
    if (self.$helpers.emptyOrNull(self.currentUser)) {
      self.$helpers.logOutUser();
    }
    window.addEventListener("scroll", self.scrollListener);
    self.getSharedProjects();
    self.loading = false;
  },
  methods: {
    scrollListener() {
      let self = this;
      if (self.$helpers.bottomOfWindow() && self.showLoader == false) {
        self.getSharedProjects();
      }
    },
    createNewProject() {
      let self = this;
      const userId = self.currentUser.uid;
      let defaultTitle = "Untitled Project";
      defaultTitle = defaultTitle.toLowerCase();
      let titleTerms = self.getStringTerms(defaultTitle);
      let email = self.currentUser.email;
      email = email.toLowerCase();
      let emailTerms = self.getStringTerms(email);
      let name = null;
      let name_terms = null;
      if (self.currentUser.first_name) {
        name = self.currentUser.first_name + " " + self.currentUser.last_name;
        name = name.toLowerCase();
        name_terms = self.getStringTerms(name);
      }
      let new_project = {
        title: defaultTitle,
        title_terms: titleTerms,
        user: userId,
        user_email: email,
        email_terms: emailTerms,
        user_name: name,
        name_terms: name_terms ? name_terms : [],
        total_photos: 0,
        total_orders: 0,
        completed_orders: 0,
        main_thumb_url: null,
        main_image_id: null,
        main_image_name: null,
        status: "new"
      };
      new_project = self.$helpers.addTimestamps(new_project);
      self.fb.projectsCollection
        .add(new_project)
        .then(docRef => {
          let project_id = docRef.id;
          this.$router.push({
            name: "ProjectEdit",
            params: { projectId: project_id }
          });
        })
        .catch(err => {
          self.consoleData(err);
          this.errorMsg = err.message;
        });
    },
    getSharedProjects() {
      let self = this;
      const userId = this.currentUser.uid;
      self.showLoader = true;
      //  let sharedProjects = self.fb.projectSharedCollection.where("share_with", "==", self.currentUser.email)
      //     .where("date_deleted", "==", null);
      let sharedProjects = self.fb.projectSharedCollection
        .where("share_with", "array-contains", self.currentUser.email)
        .where("date_deleted", "==", null);
      if (self.start_after) {
        sharedProjects = sharedProjects.startAfter(self.start_after);
      }
      sharedProjects
        .limit(self.per_page)
        .get()
        .then(function(sharedQuerySnapshot) {
          let total_docs = sharedQuerySnapshot.docs.length;
          if (total_docs > 0) {
            window.addEventListener("scroll", self.scrollListener);
            self.start_at = sharedQuerySnapshot.docs[0];
            self.start_after = sharedQuerySnapshot.docs[total_docs - 1];
          } else {
            window.removeEventListener("scroll", self.scrollListener);
          }
          sharedQuerySnapshot.forEach(function(sharedDoc) {
            if (sharedDoc.exists) {
              self.fb.projectsCollection
                .doc(sharedDoc.data().project_id)
                .get()
                .then(pDoc => {
                  let project = pDoc.data();
                  project["id"] = pDoc.id;
                  let multipleTimesAssigned = self.projects.find(sProject => {
                    return sProject.project_id == pDoc.id;
                  });
                  if (multipleTimesAssigned === undefined) {
                    self.projects.push(project);
                  }
                })
                .catch(error => {
                  self.consoleData(
                    "error getting project for shared: " + error
                  );
                });
            }
          });
          self.showLoader = false;
        })
        .catch(function(error) {
          self.showLoader = false;
          self.consoleData("Error getting projects: " + error);
        });
    },
    modalAction(action, project_id = null, btn = null) {
      let self = this;
      if (project_id) {
        self.shareProjectId = project_id;
      }
      if (action == "show") {
        self.$bvModal.show("addUpdateCouponModal");
      }
      if (action == "hide") {
        if (btn) {
          btn.target.disabled = false;
        }
        self.email = "";
        self.shareProjectId = null;
        self.$bvModal.hide("addUpdateCouponModal");
      }
    },
    shareProject() {
      let self = this;
      self.$validator.validateAll().then(valid => {
        //if validation fails
        if (!valid) {
          self.$helpers.consoleData(
            "form Validation Fails while adding coupon"
          );
          return false;
        } else {
          // form validated
          let url =
            process.env.VUE_APP_API_BASE_URL +
            "project/" +
            self.shareProjectId +
            "/share";
          let data = {
            email: self.email,
            base_url: process.env.VUE_APP_BASE_URL
              ? process.env.VUE_APP_BASE_URL
              : "http://localhost:8080/",
            shared_by: self.currentUser.email
          };
          if (!self.emptyOrNull(self.currentUser)) {
            data["first_name"] = self.currentUser.first_name;
            data["last_name"] = self.currentUser.last_name;
          }
          self.showLoader = true;
          self.$http.post(url, data).then(
            response => {
              let response_data = response.body;
              if (response_data.success) {
                let share_code = response_data.data.share_code;
                let project_id = response_data.data.project_id;
                let share_with = response_data.data.share_with;
                let data = {
                  project_id: project_id,
                  share_code: share_code,
                  share_with: share_with,
                  shared_by: self.currentUser.email,
                  shared_by_id: self.currentUser.uid,
                  used: false
                };
                data = self.$helpers.addTimestamps(data);
                self.fb.projectSharedCollection
                  .add(data)
                  .then(addedDoc => {
                    self.showLoader = false;
                    self.simpleAlert({
                      type: "success",
                      text: "Your project has been shared with " + share_with
                    });
                    self.showLoader = false;
                    self.modalAction("hide", null, event);
                  })
                  .catch(error => {
                    self.showLoader = false;
                    self.consoleData("error sharing project: " + error);
                  });
              } else {
                self.showLoader = false;
                self.simpleAlert({
                  type: "error",
                  text: response_data.errors[0]
                });
              }
            },
            response => {
              self.consoleData("error vue resource");
              self.showLoader = false;
              self.simpleAlert({
                type: "error",
                text: "Something went wrong. Please try again"
              });
            }
          );
        }
      });
    }
  }
};
</script>
