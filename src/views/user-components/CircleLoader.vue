<template>
    <div class="full_loader">
        <div class="skill_container">
            <div class="c100 xt-small" :class="'p'+progress">
                <span>{{progress}}%</span>
                <div class="slice">
                    <div class="bar"></div>
                    <div class="fill"></div>
                </div>
            </div>
            <div class="skill_name" id="skill_name">{{message}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CircleLoader",
        props:{
            progress: {
                type: Number,
                required: false,
                default: 0
            },
            message: {
                type: String,
                required: false,
                default: "Downloading..."
            }
        }
    }
</script>

<style scoped>

</style>
