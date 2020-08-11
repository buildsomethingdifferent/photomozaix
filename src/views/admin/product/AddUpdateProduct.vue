<template>
    <div>
        <b-form>
            <b-form-group
                    id="input-group-1"
                    label="Set Base Price:"
                    label-for="base_price"
            >
                <b-form-checkbox name="check-button" switch></b-form-checkbox>
            </b-form-group>
            <b-form-group
                    id="input-group-1"
                    label="Include Base Price:"
                    label-for="base_price"
            >
            <b-form-checkbox name="check-button" switch></b-form-checkbox>
            </b-form-group>


            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
    </div>
</template>

<script>
    export default {
        name: "AddUpdateProduct"
    }
</script>

<style scoped>

</style>
