<template>
    <div>

    </div>
</template>

<script>
    export default {
        name: "scoring-history",
        data() {
            return {
                nowTimeProject:""
            }
        },
        methods:{
            init(){
                this.getAllTest();
            },
            getAllTest(){
                this.$axios.post("/project/getProjectModel",{
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.nowTimeProject = res.data;
                })
            },
        }
    }
</script>

<style scoped>

</style>