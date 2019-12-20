<template>
    <div style="background-color: rgba(99%,99%,99%,0.5);">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to=""><span @click="show='profess'" >专业项目进度</span></el-breadcrumb-item>
            <el-breadcrumb-item v-if="show=='class' || show=='group'" ><span @click="show='class'">班级项目进度</span></el-breadcrumb-item>
            <el-breadcrumb-item v-if="show=='group'">小组项目进度</el-breadcrumb-item>
        </el-breadcrumb>
        <hr>
        <transition name="fade">
            <div v-if="show=='group'">
                <el-card v-for="(p,index) in groups" :key="index" v-if="p.project.length>0">
                    <span style="font-size:14px;">小组名称：</span><el-link type="primary">{{p.name}}</el-link>
                    <span><el-button @click="exportGroupReport(p)" size="mini">生成报告</el-button></span>
                    <hr>
                    <div v-for="(project,pindex) in p.project" :key="pindex">

                        <span style="margin-left:20px;font-size: 14px;">
                            项目名称：{{project.name}}
                        </span>
                        <br><br>
                        <span v-if="project.projectStageList.length == 0">
                            当前项目没有进度
                        </span>
                        <el-steps v-if="project.projectStageList.length != 0" :active="project.projectStageList.length-1" simple finish-status="success">
                            <el-step v-for="(stage,index) in project.projectStageList" :key="index" :title="stage.name"></el-step>
                        </el-steps>

                    </div>
                </el-card>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="show=='class'">
                <el-card v-for="(p,index) in classs" :key="index" style="margin-top: 10px;" v-if="p.projects.length>0">
                    <span style="font-size:14px;">班级名称：</span>{{p.className}}
                    <hr>
                    <div v-for="(project,pindex) in p.projects" :key="pindex">
                        <span style="margin-left:20px;font-size: 14px;">
                            项目名称：<el-button @click="lookClassGroupInfo(project.id)" size="mini">{{project.name}}</el-button>
                        </span>
                        <br><br>
                        <span v-if="project.projectStageList.length == 0">
                            当前项目没有进度
                        </span>
                        <el-steps v-if="project.projectStageList.length != 0" :active="project.projectStageList.length-1" simple finish-status="success">
                            <el-step v-for="(stage,index) in project.projectStageList" :key="index" :title="stage.name"></el-step>
                        </el-steps>
                    </div>
                </el-card>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="show=='profess'">
                <el-card v-for="(p,index) in profess" :key="index" style="margin-top:10px;" v-if="p.projects.length>0">
                    <span style="font-size:14px;">专业名称：</span><el-button @click="lookProfessClassInfo(p.professionalId)" size="mini">{{p.professionalName}}</el-button>
                    <hr>

                    <div>
                        <div v-for="(project,pindex) in p.projects" :key="pindex">
                            项目名称:{{project.name}}
                            <span v-if="project.projectStageList.length == 0">
                                当前项目没有进度
                            </span>
                            <el-steps v-if="project.projectStageList.length != 0" :active="project.projectStageList.length-1" simple finish-status="success">
                                <el-step v-for="(stage,index) in project.projectStageList" :key="index" :title="stage.name"></el-step>
                            </el-steps>
                        </div>
                    </div>
                </el-card>
            </div>
        </transition>

    </div>
</template>

<script>
    export default {
        name: "report-profess",
        data(){
            return{
                profess:[],
                classs:[],
                groups:[],
                show:'profess'
            }
        },
        methods:{
            init(){
                this.show='profess'
                this.getProfessTable();
            },
            getProfessTable(){
                this.$axios.post("/project/getProjectStageByAll",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.profess = res.data;
                }).catch(err=>{

                })
            },
            lookProfessClassInfo(id){
                this.show = 'class';
                this.$axios.post("/project/getProjectStageByProfessional",{
                    professionalId:id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.classs = res.data;
                }).catch(err=>{

                })

            },
            lookClassGroupInfo(id){
                this.show = 'group';
                this.$axios.post("/project/getProjectStageByClass",{
                    classId:id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.groups = res.data;
                })
            },
            exportGroupReport(group){
                window.open("/api/file/projectGroupLecture?groupId="+group.id,"_blank")
            }
        }
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>