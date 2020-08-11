<template>
  <div>
    <div class="global_loader" v-show="showLoader">
      <vue-loaders :name="loaderName" color="#7359a6" scale="1"></vue-loaders>
    </div>
    <b-modal
      ref="addUpdateCouponModal"
      id="addUpdateCouponModal"
      title="Upload Finished Mozaix"
      :hide-footer="true"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <div v-if="serverErrors.length > 0">
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          <ul>
            <li v-for="error in serverErrors">{{error}}</li>
          </ul>
        </b-alert>
      </div>
      <template v-if="size_errors > 0 || type_errors > 0">
        <b-alert :show="true" dismissible @dismissed="hideDropzoneErrors" variant="info">
          <ul>
            <li v-if="uploaded_files > 0">
              {{"[" + uploaded_files + "] "}}
              {{uploaded_files == 1 ? "file is uploaded." : "files are uploaded."}}
            </li>
            <li v-if="size_errors > 0">
              {{'The files with size less than 100 KB are not supported and the system did not upload '}}
              {{ size_errors == 1 ? "this ":"these "}}
              {{ '['+ size_errors +'] '}}
              {{size_errors == 1 ? "File." : "Files."}}
            </li>
            <li
              v-if="type_errors > 0"
            >{{'The supported file types are jpg and jpeg so ['+type_errors+'] unsupported '}}{{type_errors == 1 ? "file type is not uploaded." : "file types are not uploaded."}}</li>
          </ul>
        </b-alert>
      </template>
      <vue-dropzone
        :options="dropzoneOptions"
        :useCustomSlot="true"
        id="photoUpload"
        ref="customDropzone"
        v-on:vdropzone-reset="cleanupDropzone"
        v-on:vdropzone-mounted="vdropzoneMounted"
        v-on:vdropzone-sending-multiple="vdropzoneSendingMultiple"
        v-on:vdropzone-success-multiple="vdropzoneSuccessMultiple"
        v-on:vdropzone-queue-complete="vdropzoneQueueComplete"
        v-on:vdropzone-error-multiple="vdropzoneErrorMultiple"
        v-on:vdropzone-files-added="vdropzoneFilesAdded"
      >
        <div class="dropzone-custom-content">
          <p>
            <span class="subtitle dropzone-custom-title">Drag and drop to upload photos.</span>
            <br />&#8230;or click to select a file from your computer
          </p>
          <br />
          <p>Accepted file type: jpg, jpeg</p>
          <br />
          <p>
            <strong>
              Max
              <big>40</big> photos at one time.
            </strong>
          </p>
        </div>
      </vue-dropzone>
      <div class="columns is-multiple text-center">
        <div class="column is-12 btnsContainter">
          <b-button
            class="customButtonMedium width_200 lightColor"
            @click="modalAction('hide')"
            ref="closeBtn"
          >Close</b-button>
        </div>
      </div>
      <div class="uploadedThumbs">
        <gallery :images="orderCollagesArray" :index="galleryIndex" @close="galleryIndex = null"></gallery>
        <div v-for="(collageThumb, cIdx) in orderCollagesThumbsArray" class="uploadedThumb">
          <div class="overControls">
            <span class="project_action view_project" @click="galleryIndex=cIdx">&nbsp;</span>
            <span class="project_action delete_project" @click="deleteImage(cIdx)">&nbsp;</span>
          </div>

          <img :src="collageThumb" alt />
        </div>
      </div>
    </b-modal>
    <div class="flexElem panelHeader flexResponsive">
      <div class="panelHeading">Finished Orders Listing</div>

      <div class="flexElem flexResponsive">
        <div class v-if="orders.length > 0">
          <download-excel
            :data="orders"
            :export-fields="exportableFields"
            name="Fininshed Orders Export"
          >
            <a href="#" class="action action_excel shah"></a>
          </download-excel>
        </div>

        <div class="hasSearch">
          <b-form-select
            name="status"
            v-model="searchStatus"
            @change="search('status')"
            :options="searchStatuses"
            class="input inputControl customInput"
            style="min-width: 100px;"
          ></b-form-select>
        </div>
        <div class="hasSearch">
          <input
            type="text"
            autocomplete="nope"
            class="inputControl searchIcon"
            v-model="search_order_no"
            placeholder="Search With Order Number"
            @keyup.enter="search('order_no')"
            @keypress="isFloat($event)"
          />
          <span class="searchBtn" @click="search('order_no')"></span>
        </div>
        <vue-date
          data-vv-name="valid_till"
          v-model="searchDate"
          :input-class="'inputControl datepicker calendarIcon'"
          placeholder="Search With Created Date"
          :clear-button="true"
          :clear-button-icon="'fas fa-times'"
          @input="search('date')"
        ></vue-date>
      </div>
    </div>

    <div class="panelContent">
      <div class="table-responsive" v-dragscroll.x="draggable">
        <table class="themeTable fixedLayout">
          <thead>
            <tr>
              <th>Customer Name / Order #</th>
              <th>Customer Email</th>
              <th>Project Title</th>
              <th>Number Of Mozaix</th>
              <th>Number Of Images</th>
              <th>Ordered Date</th>
              <th>Type Of Production</th>
              <th>Status</th>
              <th>Delivery Method</th>
              <th>Project ID</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(order, oIdx) in orderBy(orders, 'date_created', -1)">
              <td>{{order.first_name+ " / "+order.order_no}}</td>
              <td>
                <popper
                  trigger="click"
                  :options="{placement: 'right'}"
                  style="cursor:pointer"
                  class="linkColor"
                >
                  <div class="popper">
                    <p>
                      <strong>Name:</strong>
                      {{order.first_name}}
                    </p>
                    <p>
                      <strong>Email:</strong>
                      {{order.order_email}}
                    </p>
                    <p>
                      <strong>Phone No:</strong>
                      {{order.phone_no ? order.phone_no.replace("+1 ", "") : order.phone_no}}
                    </p>
                    <p>
                      <strong>Address:</strong>
                      {{order.address}}
                    </p>
                    <p>
                      <strong>City:</strong>
                      {{order.city}}
                    </p>
                    <p>
                      <strong>State:</strong>
                      {{order.region}}
                    </p>
                    <p>
                      <strong>Zip Code:</strong>
                      {{order.zip_code}}
                    </p>
                  </div>

                  <span slot="reference" class="right">
                    <u>{{order.order_email}}</u>
                  </span>
                </popper>
              </td>
              <td>
                <span
                  @mouseover="draggable=false"
                  @mouseout="draggable=true"
                >{{order.project_title}}</span>
              </td>
              <td>
                <router-link
                  :to="{name: 'OrderDetail', params:{orderId:order.id}}"
                >{{order.quantity}}</router-link>
              </td>
              <td>
                <span
                  @mouseover="draggable=false"
                  @mouseout="draggable=true"
                >{{order.project_photos_count ? order.project_photos_count: "0"}}</span>
              </td>
              <td>
                <span
                  @mouseover="draggable=false"
                  @mouseout="draggable=true"
                >{{order.date_created.toDate()| moment("ddd, Do MMM YYYY")}}</span>
              </td>
              <td>
                <span @mouseover="draggable=false" @mouseout="draggable=true">
                  <b-alert variant="danger" show v-if="order.express_production > 0">Express 1-2</b-alert>
                  <b-alert show v-else>Standard 4-5</b-alert>
                </span>
              </td>
              <template>
                <td v-if="getOrderStatus(oIdx) == 'Shipped'" class="order-status">
                  <span
                    class="completed"
                    @mouseover="draggable=false"
                    @mouseout="draggable=true"
                  >{{order.status}}</span>
                </td>
                <td v-else>
                  <span @mouseover="draggable=false" @mouseout="draggable=true">
                    <b-form-select
                      name="status"
                      :value="getOrderStatus(oIdx)"
                      :ref="'status-'+order.id"
                      :options="orderStatuses"
                      class="input customInput"
                      @change="changeStatus($event, oIdx, order.id, order.status, order.project_id, order.user_uid)"
                      style="min-width: 100px;"
                    ></b-form-select>
                  </span>
                </td>
              </template>
              <td class="order-status">
                <span
                  @mouseover="draggable=false"
                  @mouseout="draggable=true"
                  :class="order.shipping_method == 'self_pick' ? 'store' :
                                    order.shipping_method == 'express' ? 'ordered' : ''"
                >
                  {{order.shipping_method == 'self_pick' ? 'Store Pick Up' :
                  order.shipping_method == 'express' ? 'Express' : 'Standard'}}
                </span>
              </td>

              <td class="order-status">
                <router-link
                  :to="{name:'AdminViewProject', params: {projectId: order.project_id}}"
                  title="View Project"
                >{{order.project_id}}</router-link>
              </td>
              <td>
                <template v-if="order.downloading">
                  <CircleLoader :progress="order.progress"></CircleLoader>
                </template>
                <span
                  class="action action_download"
                  @click="createZip(order.id, order.project_id, oIdx, false)"
                  style="cursor: pointer"
                  title="Download images zip"
                ></span>
                <popper
                  trigger="click"
                  :options="{placement: 'bottom'}"
                  style="cursor:pointer"
                  class="linkColor"
                  @show="popperShow"
                >
                  <div class="popper copyMsg">
                    <div>Text Copied</div>
                  </div>
                  <span slot="reference" class="right">
                    <span
                      class="action action_copy"
                      style="cursor: pointer"
                      @click="copyProjectUrl($event, order.project_id)"
                      title="Copy Project Url"
                    ></span>
                  </span>
                </popper>
                <span
                  v-if="order.collage_uploaded"
                  class="action action_mozaix"
                  @click="createZip(order.id, order.project_id, oIdx, true)"
                  style="cursor: pointer"
                  title="Download Mozaix"
                ></span>
                <router-link
                  :to="{name:'AdminViewProject', params: {projectId: order.project_id}}"
                  class="action action_view"
                  title="View Project"
                ></router-link>
                <span
                  class="action action_forward"
                  @click="uploadCollage(order.id, order.project_id, oIdx)"
                  style="cursor: pointer"
                  title="Upload Mozaix"
                ></span>
              </td>
            </tr>
            <template v-if="showLoader == false && orders.length <= 0">
              <tr>
                <td colspan="11">
                  <span @mouseover="draggable=false" @mouseout="draggable=true">No Data Exists</span>
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
import Datepicker from "vuejs-datepicker";
import vue2Dropzone from "vue2-dropzone";
import VueGallery from "vue-gallery";
import Vue2Filters from "vue2-filters";
let FileSaver = require("file-saver");
let JSZip = require("jszip");
let JSZipUtils = require("jszip-utils");
import CircleLoader from "../user-components/CircleLoader";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
import JsonExcel from "vue-json-excel";
export default {
  name: "FinishedOrders",
  mixins: [Vue2Filters.mixin],
  components: {
    "vue-date": Datepicker,
    vueDropzone: vue2Dropzone,
    gallery: VueGallery,
    CircleLoader: CircleLoader,
    popper: Popper,
    "download-excel": JsonExcel
  },
  data() {
    return {
      orders: [],
      errorMsg: "",
      per_page: 20,
      search_order_no: "",
      searchDate: "",
      start_at: null,
      start_after: null,
      dropzoneOptions: {
        url: process.env.VUE_APP_API_BASE_URL + "upload/order/collage",
        addRemoveLinks: false,
        method: "post",
        autoQueue: true,
        autoProcessQueue: true,
        // acceptedFiles: '.jpg,.jpeg',
        uploadMultiple: true,
        parallelUploads: "500",
        timeout: "3600000",
        maxFiles: 40
      },
      activeOrderId: "",
      activeProjectId: "",
      serverErrors: [],
      active_dropzone: "",
      activeOrderIndex: "",
      orderCollagesArray: [],
      orderCollagesThumbsArray: [],
      orderCollages: [],
      galleryIndex: null,
      activeProject: null,
      s3_base_url: process.env.VUE_APP_S3_BASE_URL,
      size_errors: 0,
      type_errors: 0,
      uploaded_files: 0,
      orderStatuses: [
        { value: "Printed", text: "Printed" },
        { value: "Shipped", text: "Shipped" }
      ],
      searchStatuses: [
        { value: "Printed", text: "Printed" },
        { value: "Shipped", text: "Shipped" }
      ],
      searchStatus: "Printed",
      exportableFields: {
        "Order #": "order_id",
        "Shipping Name": "complete_name",
        "Shipping Address": "address",
        "Phone Number": "phone_no",
        Email: "order_email",
        "Number Of Images": "project_photos_count",
        "Number Of Mozaix ordered": "quantity",
        "Project Title": "project_title",
        "Coupon Code": "discount_code",
        "Coupon Discount": "total_discount",
        "Total Price": "grand_total",
        "Tracking Number": "tracking_number",
        Status: "status"
      },
      app_base_url: process.env.VUE_APP_BASE_URL,
      currentUser: this.$helpers.getCurrentUser()
    };
  },
  created() {
    let self = this;
    window.addEventListener("scroll", self.scrollListener);
    self.getOrders();
  },
  methods: {
    scrollListener() {
      let self = this;
      if (self.$helpers.bottomOfWindow() && self.showLoader == false) {
        self.getOrders();
      }
    },
    getOrders() {
      let self = this;
      let ordersRef = self.fb.ordersCollection
        .where("status", "==", self.searchStatus)
        .where("date_deleted", "==", null);
      ordersRef = self.addSearchQuery(ordersRef);
      ordersRef = ordersRef.orderBy("date_created", "desc");
      if (self.start_after) {
        ordersRef = ordersRef.startAfter(self.start_after);
      }
      self.showLoader = true;
      ordersRef
        .limit(self.per_page)
        .get()
        .then(ordersSnapShot => {
          let total_docs = ordersSnapShot.docs.length;
          if (total_docs > 0) {
            window.addEventListener("scroll", self.scrollListener);
            self.start_at = ordersSnapShot.docs[0];
            self.start_after = ordersSnapShot.docs[total_docs - 1];
          } else {
            window.removeEventListener("scroll", self.scrollListener);
          }
          ordersSnapShot.forEach(order => {
            let order_data = order.data();
            order_data["id"] = order.id;
            order_data["complete_name"] =
              order_data.first_name + " " + order_data.last_name;
            order_data["total_discount"] = self.$options.filters.currency(
              order_data["total_discount"]
            );
            order_data["grand_total"] = self.$options.filters.currency(
              order_data["grand_total"]
            );
            order_data["downloading"] = false;
            order_data["downloaded"] = 0;
            order_data["progress"] = 0;
            order_data["message"] = "Downloading...";
            self.orders.push(order_data);
          });
          self.showLoader = false;
        })
        .catch(function(error) {
          self.showLoader = false;
          self.$helpers.consoleData("Error getting orders: " + error);
        });
    },
    addSearchQuery(ordersRef) {
      let self = this;
      if (self.search_order_no) {
        ordersRef = ordersRef.where(
          "order_no",
          "==",
          parseInt(self.search_order_no)
        );
      }
      if (self.searchDate) {
        let date_obj = self.$helpers.formatDateQuery(self.searchDate);
        ordersRef = ordersRef
          .where("date_created", ">=", date_obj.start_date)
          .where("date_created", "<=", date_obj.end_date);
      }
      return ordersRef;
    },
    search(type) {
      let self = this;
      if (type == "order_no") {
        self.searchDate = "";
      }
      if (type == "date") {
        self.search_order_no = "";
      }
      self.orders = [];
      self.start_at = null;
      self.start_after = null;
      self.getOrders();
    },
    uploadCollage(orderId, projectId, orderIndex) {
      let self = this;
      self.activeOrderId = orderId;
      self.activeProjectId = projectId;
      self.activeOrderIndex = orderIndex;
      self.getCollageImages(orderId);
      self.modalAction("show");
    },
    modalAction(action) {
      let self = this;
      if (action == "show") {
        self.$bvModal.show("addUpdateCouponModal");
      }
      if (action == "hide") {
        self.activeOrderId = "";
        self.activeProjectId = "";
        self.activeOrderIndex = "";
        self.size_errors = 0;
        self.type_errors = 0;
        self.uploaded_files = 0;
        self.serverErrors = [];
        self.$refs["closeBtn"].disabled = false;
        self.$bvModal.hide("addUpdateCouponModal");
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
      let orderId = self.activeOrderId;
      formData.append("orderId", orderId);
      if (self.$refs.closeBtn) {
        self.$refs.closeBtn.disabled = true;
      }
    },
    vdropzoneSuccessMultiple(files, response) {
      let self = this;
      if (response.success == false) {
        self.serverErrors = response.errors;
        self.showDismissibleAlert = true;
        self.active_dropzone.removeAllFiles();
        if (self.$refs.closeBtn) {
          self.$refs.closeBtn.disabled = false;
        }
      } else {
        let uploaded_photos = response.data.uploaded_images;
        let order_before_update_status = null;
        let batch = self.fb.db.batch();
        let orderRefDoc = self.fb.ordersCollection
          .doc(self.activeOrderId)
          .collection("collages");
        uploaded_photos.forEach((asset, aIdx) => {
          batch.set(
            orderRefDoc.doc(),
            self.$helpers.addTimestamps(asset, true)
          );
          self.orderCollagesArray.unshift(
            self.s3_base_url +
              "order_collages/" +
              self.activeOrderId +
              "/customer_" +
              asset.name
          );
          self.orderCollagesThumbsArray.unshift(
            self.s3_base_url +
              "order_collages/" +
              self.activeOrderId +
              "/thumb_" +
              asset.name
          );
        });
        if (uploaded_photos.length > 0) {
          self.fb.ordersCollection
            .doc(self.activeOrderId)
            .update({
              date_updated: new Date(),
              collage_uploaded: true
            })
            .then(() => {
              self.orders[self.activeOrderIndex].collage_uploaded = true;
              self.consoleData("collage status updated in order");
            })
            .catch(error => {
              self.consoleData(
                "Error updating collage status in order: " + error
              );
            });
        }
        batch.commit().then(function() {
          self.consoleData("batch completed");
          self.size_errors = response.data.size_errors;
          self.type_errors = response.data.type_errors;
          self.uploaded_files = response.data.uploaded_images.length;
          self.active_dropzone.removeAllFiles();
          //self.orders.splice(self.activeOrderIndex,1);
          self.activeOrderIndex = "";
          //self.modalAction("hide");
          if (self.$refs.closeBtn) {
            self.$refs.closeBtn.disabled = false;
          }
          self.simpleAlert({
            type: "success",
            text: "Collage uploaded successfully"
          });
        });
      }
    },
    vdropzoneQueueComplete() {
      let self = this;
      self.showLoader = false;
    },
    vdropzoneErrorMultiple(files, message, xhr) {
      let self = this;
      self.showLoader = false;
      self.$refs["cancelBtn"].disabled = false;
      alert("error multiple");
    },
    cleanupDropzone() {
      this.consoleData("Cleaning up...");
    },
    getCollageImages(orderId) {
      let self = this;
      self.orderCollagesArray = [];
      self.orderCollagesThumbsArray = [];
      self.orderCollages = [];
      let collageRefDoc = self.fb.ordersCollection
        .doc(orderId)
        .collection("collages")
        .where("date_deleted", "==", null);
      collageRefDoc.get().then(collagesQuerySnapShot => {
        collagesQuerySnapShot.forEach(collage => {
          let collage_data = collage.data();
          collage_data["id"] = collage.id;
          let url =
            self.s3_base_url +
            "order_collages/" +
            orderId +
            "/customer_" +
            collage_data.name;
          self.orderCollagesArray.push(url);
          self.orderCollagesThumbsArray.push(
            self.s3_base_url +
              "order_collages/" +
              orderId +
              "/thumb_" +
              collage_data.name
          );
          self.orderCollages.push(collage_data);
        });
      });
    },
    deleteImage(index) {
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
          let id = self.orderCollages[index].id;
          self.fb.ordersCollection
            .doc(self.activeOrderId)
            .collection("collages")
            .doc(id)
            .update({
              date_deleted: new Date(),
              date_updated: new Date()
            })
            .then(() => {
              self.consoleData("collage deleted");
              self.orderCollages.splice(index, 1);
              self.orderCollagesArray.splice(index, 1);
              self.orderCollagesThumbsArray.splice(index, 1);
              self.showLoader = false;
            })
            .catch(error => {
              self.showLoader = false;
              self.consoleData("error deleting collage " + error);
            });
        }
      });
    },
    vdropzoneFilesAdded(files) {
      let self = this;
    },
    createZip(orderId, projectId, orderIndex, is_collage) {
      let self = this;
      if (projectId) {
        let assetsArray = [];
        if (is_collage) {
          self.fb.ordersCollection
            .doc(orderId)
            .collection("collages")
            .where("date_deleted", "==", null)
            .get()
            .then(collagesQuerySnapShot => {
              collagesQuerySnapShot.forEach(asset => {
                let asset_name = asset.data().name;
                assetsArray.push({ path: asset.data().url, name: asset_name });
              });
              if (assetsArray.length > 0) {
                self.orders[orderIndex].downloading = true;
                $("body").addClass("loaderOpen");
                self.downloadZip(
                  assetsArray,
                  projectId + ".zip",
                  assetsArray.length,
                  orderIndex
                );
              } else {
                self.simpleAlert({
                  type: "info",
                  text: "No files to download"
                });
              }
            });
        } else {
          self.fb.projectsCollection
            .doc(projectId)
            .collection("photos")
            .where("date_deleted", "==", null)
            .get()
            .then(assetsQuerySnapShot => {
              assetsQuerySnapShot.forEach(asset => {
                let asset_name = asset.data().name;
                if (asset.data().is_main_img) {
                  asset_name = "main_" + asset.data().name;
                }
                assetsArray.push({ path: asset.data().url, name: asset_name });
              });
              if (assetsArray.length > 0) {
                self.orders[orderIndex].downloading = true;
                $("body").addClass("loaderOpen");
                self.downloadZip(
                  assetsArray,
                  projectId + ".zip",
                  assetsArray.length,
                  orderIndex
                );
              } else {
                self.simpleAlert({
                  type: "info",
                  text: "No files to download"
                });
              }
            });
        }
      }
    },
    downloadZip(files, zipName = "default.zip", total_files, orderIndex) {
      let self = this;
      let zip = new JSZip();
      files.forEach((photo, pIdx) => {
        zip.file(
          photo.name,
          self.urlToPromise(photo.path, total_files, orderIndex),
          { base64: true, binary: true }
        );
      });
      zip.generateAsync({ type: "blob" }).then(function(content) {
        self.orders[orderIndex].message = "Creating Zip...";
        self.orders[orderIndex].downloading = false;
        self.orders[orderIndex].downloaded = 0;
        self.orders[orderIndex].progress = 0;
        $("body").removeClass("loaderOpen");
        FileSaver.saveAs(content, zipName);
      });
    },
    urlToPromise(url, total_files, orderIndex) {
      let self = this;
      return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function(err, data) {
          if (err) {
            reject(err);
          } else {
            let downloaded_files = JSON.stringify(
              self.orders[orderIndex].downloaded
            );
            downloaded_files = JSON.parse(downloaded_files);
            downloaded_files = parseInt(downloaded_files) + 1;
            let progress = parseInt(downloaded_files) / parseInt(total_files);
            progress = parseFloat(progress) * parseFloat("100");
            self.orders[orderIndex].downloaded = downloaded_files;
            self.orders[orderIndex].progress = parseInt(progress);
            let orderId = self.orders[orderIndex].id;
            resolve(data);
          }
        });
      });
    },
    hideDropzoneErrors() {
      let self = this;
      self.type_errors = 0;
      self.size_errors = 0;
      self.uploaded_files = 0;
    },
    changeStatus(newStatus, oIdx, orderId, oldStatus, project_id, user_id) {
      let self = this;
      let orderData = {
        status: newStatus,
        date_updated: new Date()
      };
      if (newStatus == "Shipped") {
        self
          .$swal({
            title: "Add Tracking Number",
            type: "info",
            input: "text",
            showCancelButton: true,
            cancelButtonColor: "#b9acd2",
            inputValidator: value => {
              if (!value) {
                return "You need to write something!";
              }
            }
          })
          .then(result => {
            if (result.value) {
              self.showLoader = true;
              orderData["tracking_number"] = result.value;
              self.fb.ordersCollection
                .doc(orderId)
                .update(orderData)
                .then(() => {
                  self.consoleData("order status updated");
                  self.search();
                  const increment = self.fb.firestore.FieldValue.increment(1);
                  self.fb.projectsCollection
                    .doc(project_id)
                    .update({
                      completed_orders: increment
                    })
                    .then(() => {
                      self.consoleData("completed order incremented");
                      self.fb.usersCollection
                        .doc(user_id)
                        .update({
                          completed_orders: increment
                        })
                        .then(() => {
                          self.consoleData(
                            "completed order incremented in users collection"
                          );
                          self.showLoader = false;
                        })
                        .catch(error => {
                          self.showLoader = false;
                          self.consoleData(
                            "error incrementing completed orders in users collection"
                          );
                        });
                    })
                    .catch(error => {
                      self.showLoader = false;
                      self.consoleData("error incrementing completed orders");
                    });
                })
                .catch(error => {
                  self.showLoader = false;
                  self.consoleData("error updating order status");
                });
            } else {
              self.$refs["status-" + orderId][0].$el.value = oldStatus;
            }
          });
      } else {
        self.showLoader = true;
        self.fb.ordersCollection
          .doc(orderId)
          .update(orderData)
          .then(() => {
            self.showLoader = false;
            self.consoleData("order status updated1");
          })
          .catch(error => {
            self.showLoader = false;
            self.consoleData("error updating order status");
          });
      }
    },
    getOrderStatus(oIdx) {
      let self = this;
      return self.orders[oIdx].status;
    },
    makeLink(data) {
      let share_url = `${process.env.VUE_APP_BASE_URL}shared/project/${data.project_id}/${data.share_code}`;
      let temp = $("<input id='shahziab'>");
      $("body").append(temp);
      temp.val(share_url).select();
      document.execCommand("copy");
      temp.remove();
    },
    popperShow(event) {
      setTimeout(() => {
        $("body").trigger("click");
      }, 2000);
    },
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    generateShareCode() {
      return this.makeid(7) + (new Date().getTime() / 1000).toFixed(0);
    },
    copyProjectUrl(event, project_id) {
      let self = this;
      let data = {
        project_id: project_id,
        share_code: this.generateShareCode(),
        share_with: "",
        shared_by: self.currentUser.email,
        shared_by_id: self.currentUser.uid,
        used: false
      };
      data = self.$helpers.addTimestamps(data);
      self.showLoader = true;

      let shared_projects = self.fb.projectSharedCollection
        .where("date_deleted", "==", null)
        .where("project_id", "==", project_id)
        .where("shared_by", "==", self.currentUser.email)
        .limit(1)
        .get()
        .then(res => {
          if (res.docs.length > 0) {
            const project = res.docs[0].data();
            self.makeLink(project);
          } else {
            self.fb.projectSharedCollection
              .add(data)
              .then(addedDoc => {
                addedDoc.get().then(res => {
                  const project = res.data();
                  self.makeLink(project);
                });
                self.showLoader = false;
              })
              .catch(error => {
                self.showLoader = false;
                self.consoleData("error sharing project: " + error);
              });
          }
        });
      self.showLoader = false;
    }
  }
};
</script>

<style>
</style>
