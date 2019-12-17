<template>
    <div>
        <div style="width: 80%;height:100px;margin: 0 auto;">
            <el-card class="box-card" v-for="(p,ind) in projects" :key="ind">
                <div slot="header" class="clearfix" style="font-size:14px;">
                    <span>{{p.name}}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
                </div>
                <div style="font-size: 14px;">
                    教学目标：{{p.number}}
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "old-release",
        data(){
            return{
                projects:[]
            }
        },
        methods:{
            init(){
                this.getReleaseProjectInfo()
            },
            getReleaseProjectInfo(){
                this.$axios.post("/project/getProjectModel",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.projects = res.data
                })
            }
        }
    }
</script>

<style scoped>

</style>