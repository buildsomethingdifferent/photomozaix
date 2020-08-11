<template>
  <div class="checkout">
    <router-link to="" class="back"><i class="fal fa-angle-left"></i> Back to Your Project</router-link>

    <h1>Checkout</h1>

    <div class="checkoutSections mt-5">
        <div class="columns">
            <div class="column is-6 mr-4">
                <div class="columns">
                    <div class="column pb-0">
                        <b-form-group label="Email" class="innerHeading" label-for="email" invalid-feedback="Email is required">
                            <b-form-input name="email" placeholder="Email" class="input customInput grayBg inputEmailIcon leftIcon" v-validate="'required|email'"></b-form-input>
                        </b-form-group>
                    </div>

                    <div class="column pb-0">
                        <b-form-group label="Password" class="innerHeading" label-for="password" invalid-feedback="Password is required">
                            <b-form-input type="password" name="email" placeholder="Password" class="input customInput grayBg inputPasswordIcon leftIcon" v-validate="'required|password'"></b-form-input>
                        </b-form-group>
                    </div>
                </div>

                <div class="columns is-multiline mt-3">
                    <div class="column is-12 pb-0">
                        <div class="innerHeading">
                            Contact Information
                        </div>
                    </div>
                    <div class="column pb-0">
                        <b-form-group label-for="first_name" invalid-feedback="First Name is required">
                            <b-form-input type="password" name="first_name" placeholder="First Name" class="input customInput grayBg inputUserIcon leftIcon" v-validate="'required'"></b-form-input>
                        </b-form-group>
                    </div>
                    <div class="column pb-0">
                        <b-form-group label-for="last_name" invalid-feedback="Last Name is required">
                            <b-form-input type="password" name="last_name" placeholder="Last Name" class="input customInput grayBg inputUserIcon leftIcon" v-validate="'required'"></b-form-input>
                        </b-form-group>
                    </div>
                </div>

                <div class="columns">
                    <div class="column pb-0">
                        <b-form-group label-for="address" invalid-feedback="Address is required">
                            <b-form-input name="address" placeholder="Address" class="input customInput grayBg inputLocationIcon leftIcon" v-validate="'required'"></b-form-input>
                        </b-form-group>
                    </div>
                </div>

                <div class="columns">
                    <div class="column pb-0">
                        <b-form-group label-for="city" invalid-feedback="City is required">
                            <b-form-input name="city" placeholder="City" class="input customInput grayBg inputLocationIcon leftIcon" v-validate="'required'"></b-form-input>
                        </b-form-group>
                    </div>
                </div>

                <div class="columns">
                    <div class="column pb-0">
                        <b-form-group label-for="city" invalid-feedback="City is required">
                            <b-form-select v-model="selected" :options="options" class="input grayBg customInput"></b-form-select>
                        </b-form-group>
                    </div>
                    <div class="column pb-0">
                        <b-form-group label-for="city" invalid-feedback="City is required">
                            <b-form-select v-model="selected" :options="options" class="input grayBg customInput"></b-form-select>
                        </b-form-group>
                    </div>
                    <div class="column pb-0">
                        <b-form-group label-for="zip" invalid-feedback="Zip Code is required">
                            <b-form-input name="zip" placeholder="Zip Code" class="input customInput grayBg" v-validate="'required'"></b-form-input>
                        </b-form-group>
                    </div>
                </div>

                <div class="columns">
                    <div class="column pb-0">
                        <b-form-group label-for="phone" invalid-feedback="Phone No. is required">
                            <b-form-input name="phone" placeholder="Phone" class="input customInput grayBg inputPhoneIcon leftIcon" v-validate="'required'"></b-form-input>
                        </b-form-group>
                    </div>
                </div>
            </div>
            <div class="column is-6 ml-4">
                <div class="columns mt-4 is-multiline is-mobile alignFlexCenter">
                    <div class="column pb-0 is-7">
                        <div class="innerHeading linkColor">Product Name</div>
                    </div>

                    <div class="column is-2 pb-0 text-center">
                        <div class="innerHeading linkColor">Qty</div>
                    </div>

                    <div class="column is-3 pb-0 text-right">
                        <div class="innerHeading linkColor">Price</div>
                    </div>
                </div>
                <hr class="medium mt-0">

                <div class="columns is-multiline is-mobile alignFlexCenter">                    
                    <div class="column is-7">
                        <div class="innerHeading">PhotoMozaix Print</div>
                    </div>

                    <div class="column is-2 text-center">
                        <b-form-select v-model="selectedQty" :options="qty" class="input grayBg customInput"></b-form-select>
                    </div>

                    <div class="column is-3 text-right">
                        <div class="innerHeading">$540</div>
                    </div>
                </div>
                
                <hr class="medium mt-0">

                <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                    <div class="column is-12">
                        <div class="innerHeading">Discount</div>
                    </div>
                </div>

                <div class="columns is-multiline is-mobile alignFlexCenter">
                    <div class="column is-9">
                        <b-form-input name="value" placeholder="Discount Code" class="input customInput" v-validate="'required|decimal:2'"></b-form-input>
                    </div>

                    <div class="column is-3">
                        <b-button variant="info" class="customButtonMedium width_200 lightColor">APPLY</b-button>
                    </div>
                </div>
                <hr class="medium mt-0 mb-0">

                <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                    <div class="column mt-4">
                        <div class="innerHeading">Subtotal</div>
                    </div>

                    <div class="column mt-4 text-right">
                        <div class="innerHeading">$400</div>
                    </div>
                </div>

                <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                    <div class="column ">
                        <div class="innerHeading">Shipping Method</div>
                    </div>
                </div>

                <div class="columns mt-5 is-multiline is-mobile alignFlexCenter">
                    <div class="column is-12 pb-0">
                        <div style="border:1px solid #ccc;" class="p-3 veryLightGrayBg">
                            <b-form-radio v-model="selected" name="some-radios" class="fullWidthRadio" value="A">
                                <div class="flexElem" style="justify-content: space-between;">
                                    <span>Standard Shipping</span>
                                    <span>$10.00</span>
                                </div>
                            </b-form-radio>
                        </div>
                    </div>
                    
                    <div class="column is-12 pt-0">
                        <div style="border:1px solid #ccc; border-top:none" class="p-3 veryLightGrayBg">
                            <b-form-radio v-model="selected" name="some-radios" class="fullWidthRadio" value="B">
                                <div class="flexElem" style="justify-content: space-between;">
                                    <span>Express Shipping</span>
                                    <span>$40.00</span>
                                </div>
                            </b-form-radio>
                        </div>
                    </div>
                </div>
                <div class="columns is-multiline is-mobile alignFlexCenter mb-0">
                    <div class="column ">
                        <div class="innerHeading">Total</div>
                    </div>

                    <div class="column text-right">
                        <div class="innerHeading">
                            <span style="font-size: 1.9rem">$450</span>
                        </div>
                    </div>
                </div>

                <div class="columns is-multiline is-mobile mt-3">
                    <div class="column">
                        <button class="customButtonLarge blockButton lightColor">CHECKOUT</button>
                    </div>
                </div>
            </div>
        </div>
        
        <hr class="light mt-5">
        
        <div id="features" class="et_pb_section et_pb_section_1 et_pb_section_parallax et_pb_with_background et_section_regular">
            <div class="columns">
                <div class="column">
                    <div class="text-center customHeading">Pricing</div>
                </div>
            </div>
			<div class="et_pb_row et_pb_row_1 columns">
				<div class="et_pb_column et_pb_column_1_3 et_pb_column_1 ds-vertical-align column  et_pb_css_mix_blend_mode_passthrough">
                    <div class="priceBoxContainer">
                        <div class="et_pb_module et_pb_text et_pb_text_1 et_pb_bg_layout_light  et_pb_text_align_left">
                            <div class="et_pb_text_inner">
                                <h3 style="text-align: left;">Single<br> PhotoMozaix</h3>
                                <h2 style="text-align: left;">$59</h2>
                                <p style="text-align: left;">for your first&nbsp;PhotoMozaix<br> poster, plus $10 shipping.</p>
                            </div>
                        </div> <!-- .et_pb_text -->

                        <div class="et_pb_module et_pb_image et_pb_image_0 mt-3">
                            <span class="et_pb_image_wrap "><img src="https://photomozaix.com/wp-content/uploads/2018/09/Qty.png" alt="photo collage"></span>
                        </div>
                    </div>
			    </div> <!-- .et_pb_column -->
                
                <div class="et_pb_column et_pb_column_1_3 et_pb_column_2 ds-vertical-align column et_pb_css_mix_blend_mode_passthrough">
                    <div class="priceBoxContainer">
                        <div class="et_pb_module et_pb_text et_pb_text_2 et_pb_bg_layout_light  et_pb_text_align_left">
                            <div class="et_pb_text_inner">
                                <h3>Additional<br> Copies</h3>
                                <h2 style="text-align: left;">$<b>39 </b></h2>
                                <p style="text-align: left;">for each&nbsp;additional&nbsp;copy.</p>
                            </div>
                        </div> <!-- .et_pb_text -->
                        <div class="et_pb_module et_pb_image et_pb_image_1 mt-3">			
                            <span class="et_pb_image_wrap "><img src="https://photomozaix.com/wp-content/uploads/2018/10/Qty-Copies2.png" alt="mosaic"></span>
                        </div>
                    </div>
			    </div> <!-- .et_pb_column -->

                <div class="et_pb_column et_pb_column_1_3 et_pb_column_3 column et_pb_css_mix_blend_mode_passthrough">
                    <div class="priceBoxContainer">
                        <div class="et_pb_module et_pb_text et_pb_text_3 et_pb_bg_layout_light  et_pb_text_align_left">
                            <div class="et_pb_text_inner">
                                <h3>10 or more<br> Copies</h3>
                                <h2 style="text-align: left;">$29</h2>
                                <p style="text-align: left;"><span>for each, if ordering 10 or more of the same print <em>(including your first print)</em>,<br> plus <strong>free shipping</strong>.<br> </span><span style="font-size: small;"><em>Discounts not applicable.</em></span></p>
                            </div>
                        </div> <!-- .et_pb_text -->
                        
                        <div class="et_pb_module et_pb_image et_pb_image_2 mt-3">
                            <span class="et_pb_image_wrap "><img src="https://photomozaix.com/wp-content/uploads/2018/10/Qty-Copies-10.png" alt="photo collage maker"></span>
                        </div>
                    </div>
                </div> <!-- .et_pb_column -->
			</div> <!-- .et_pb_row -->
        </div> <!-- .et_pb_row -->

        <hr class="light mt-5">
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        selected: null,
        selectedQty: 1,
        options: [
          { value: null, text: 'Please select an option', disabled: true},
          { value: 'a', text: 'This is First option' },
          { value: 'b', text: 'Selected Option' },
          { value: { C: '3PO' }, text: 'This is an option with object value' }
        ],
        qty: [
          { value: '1', text: '1' },
          { value: '2', text: '2' },
        ],
      }
    }
  }
</script>