<template>
    <div>
          <b-button v-b-modal.addCoupon>Launch demo modal</b-button>

            <b-modal id="addCoupon" title="Add Coupon Code">
                <p class="my-4">Hello from modal!</p>
            </b-modal>
        <div class="flexElem panelHeader flexResponsive">
            <div class="flexElem" style="justify-content: space-between">
                <div class="panelHeading">
                    Coupon Codes
                </div>
                <button class="actionButton ml-3">ADD COUPON CODE</button>
            </div>

            <div class="flexElem flexResponsive">
                <input type="text" class="inputControl searchIcon" placeholder="Coupon Code">
                <input type="text" class="inputControl datepicker calendarIcon" placeholder="03/07/2019">
            </div>
        </div>

        <div class="panelContent">
            <div class="table-responsive">
                <table class="themeTable">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th class="text-center">Type</th>
                            <th class="text-center">Value</th>
                            <th class="text-center">Max Use</th>
                            <th class="text-center">Used</th>
                            <th>Valid Till</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>24257892513655</td>
                            <td class="text-center numVal">%</td>
                            <td class="text-center numVal">10 </td>
                            <td class="text-center numVal">5</td>
                            <td class="text-center numVal">3</td>
                            <td>12/07/2019</td>
                            <td>
                                <a href="#!" class="action action_forward"></a>
                                <a href="#!" class="action action_delete"></a>
                            </td>
                        </tr>

                        <tr>
                            <td>24257892513655</td>
                            <td class="text-center numVal">%</td>
                            <td class="text-center numVal">10 </td>
                            <td class="text-center numVal">5</td>
                            <td class="text-center numVal">3</td>
                            <td>12/07/2019</td>
                            <td>
                                <a href="#!" class="action action_forward"></a>
                                <a href="#!" class="action action_delete"></a>
                            </td>
                        </tr>

                        <tr>
                            <td>24257892513655</td>
                            <td class="text-center numVal">%</td>
                            <td class="text-center numVal">10 </td>
                            <td class="text-center numVal">5</td>
                            <td class="text-center numVal">3</td>
                            <td>12/07/2019</td>
                            <td>
                                <a href="#!" class="action action_forward"></a>
                                <a href="#!" class="action action_delete"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="flexElem panelFooter flexResponsive">
            <div class="flexElem flexResponsive">
                <button class="footerNav">Previous</button>
                <div style="margin-left: 20px; display: flex;align-items: center">
                    <span>Page</span>
                    &nbsp;
                    <input type="text" value="2" class="footerNav input">
                    &nbsp;
                    <span>Of 10</span>
                </div>
            </div>

            <div class="flexElem flexResponsive" style="justify-content: flex-end">
                <div style="margin-right: 20px">
                    <select class="footerNav input">
                        <option value="1">1 Rows</option>
                        <option value="2">2 Rows</option>
                        <option value="3">3 Rows</option>
                        <option value="4">4 Rows</option>
                        <option value="5">5 Rows</option>
                        <option value="6">6 Rows</option>
                        <option value="7">7 Rows</option>
                        <option value="8">8 Rows</option>
                        <option value="9">9 Rows</option>
                        <option value="10">10 Rows</option>
                    </select>
                </div>
                <button class="footerNav">Next</button>
            </div>
        </div>
    </div>

</template>

<script>
    const fb = require("../../config/firebaseConfig.js");
    export default {
        name: "projects",
        data() {
            return {
                projects: [],
                errorMsg:"",
                auth_user:{}
            };
        },
        created(){
            let self = this;
            var projects = [];
            self.auth_user = fb.auth.currentUser;
            console.log(self.auth_user.uid)
            var shah = fb.db.
            collectionGroup("assets").where("file_size", "==", "5").get()
                .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    projects.push(doc.data())
                });
            }).catch((error) => console.log(error.message));
            console.log(projects)
            return false;
            fb.projectsCollection.add({
                user_uid:self.auth_user.uid,
                title: "first project",
                featured_image_url:"",
                status:"pending",
                created_at:"05-05-2019 00:00:00000",
                updated_at:"05-05-2019 00:00:00000",
                deleted_at:null,
            }).then((docRef) => {
                console.log(docRef)
                console.log(docRef.id)
                fb.projectsCollection.doc(docRef.id).collection("assets").doc().set({
                    "file_name" : "test name",
                    "file_size" : "5",
                    "file_url" : "test url",
                    "created_at" : fb.timestamp.fromDate(new Date("yyyy-mm-dd")),
                }).then(assetsRef => {

                }).catch((err) => {
                    alert("error while adding assets: "+err.message);
                });
               fb.projectsCollection.get().then((querySnapshot) => {
                   querySnapshot.forEach((doc) => {
                       self.projects.push(doc.data())
                   });
               });
            }).catch((err) => {
                alert("error while creating project: "+err.message);
            });
        },
        mounted(){

        }

    }
</script>

<style>

</style>
