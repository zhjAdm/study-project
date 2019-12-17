<template>
    <div>
        <span style="font-size:14px;">当前学期：</span><el-link type="primary">{{datas.semester}}</el-link>
        <el-card v-for="(project,index) in datas.projects" :key="index" style="margin-top: 20px;">
            <span style="margin-left:20px;font-size: 14px;">
                项目名称：{{project.name}}
            </span>
            <hr>
            <span v-if="project.projectStageList.length == 0">
                        当前项目没有进度
                    </span>
            <el-steps v-if="project.projectStageList.length != 0" :active="project.projectStageList.length-1" simple finish-status="success">
                <el-step v-for="(stage,index) in project.projectStageList" :key="index" :title="stage.name"></el-step>
            </el-steps>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "report-time",
        data(){
            return{
                datas:{}
            }
        },
        methods:{
            init(){
                this.getData()
            },
            getData(){
                this.$axios.post("/project/getProjectStageBySemesters",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.datas = res.data
                })
            }
        }
    }
</script>

<style scoped>

</style>