<template>
<!--    个人中心首页-->
    <div style="margin-top: 20px;height: 100%;width: 100%;">
        <div style="float:left;margin-left:50px;text-align: center;">
            <el-avatar shape="circle" :size="80" :src="$cookies.get('user').img"></el-avatar>
        </div>
        <br clear="all">
        <div style="width: 200px;float:left;background-color: rgba(99%,99%,99%,0.5);">
            <div style="width: 100%;">
                <el-radio-group v-model="isCollapse" style="margin-left:20px;margin-bottom: 20px;">
                    <el-radio-button :label="false">展开</el-radio-button>
                    <el-radio-button :label="true">收起</el-radio-button>
                </el-radio-group>
                <el-menu :default-active="selectedMenu" class="el-menu-vertical-demo" @select="handleOpen" :collapse="isCollapse">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">个人信息</span>
                        </template>
                        <el-menu-item index="info">我的资料</el-menu-item>
                        <el-menu-item index="record">操作记录</el-menu-item>
                        <el-menu-item index="score" v-if="$cookies.get('user').role==4">项目成绩</el-menu-item>
                        <el-menu-item index="worksUpload" v-if="$cookies.get('user').role==4">我的风采</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2" v-if="$cookies.get('user').role<4">
                        <template slot="title">
                            <i class="el-icon-document"></i>
                            <span slot="title">我的资源</span>
                        </template>
                        <el-menu-item index="pack">项目教学包</el-menu-item>
                        <el-menu-item index="file">网盘资源</el-menu-item>
                        <el-menu-item index="question">调查问卷</el-menu-item>
                        <el-menu-item index="testForm" v-if="$cookies.get('user').role<3">项目考核评价表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3" v-if="$cookies.get('user').role<4">
                        <template slot="title">
                            <i class="el-icon-postcard"></i>
                            <span slot="title">我的工作</span>
                        </template>
                        <el-menu-item index="notice">通知公告</el-menu-item>
                        <el-menu-item index="worksExamine" >作品审核</el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">通知提醒</span>
                        </template>
                        <el-menu-item index="remind">任务提醒</el-menu-item>
                    </el-submenu>

                </el-menu>

            </div>
        </div>

        <my-info ref="info" v-bind:selectedMenu="selectedMenu"></my-info>
        <task-remind ref="remind" v-bind:selectedMenu="selectedMenu"></task-remind>
        <user-file ref="file" v-bind:selectedMenu="selectedMenu"></user-file>
        <user-pack ref="pack" v-bind:selectedMenu="selectedMenu"></user-pack>
        <teacher-examine ref="worksExamine" v-bind:selectedMenu="selectedMenu"></teacher-examine>
        <student-upload ref="worksUpload" v-bind:selectedMenu="selectedMenu"></student-upload>
        <activity-question ref="question" v-bind:selectedMenu="selectedMenu"></activity-question>
        <my-score ref="score" v-bind:selectedMenu="selectedMenu"></my-score>
        <notice-index ref="notice" v-bind:selectedMenu="selectedMenu"></notice-index>
        <oper-review ref="record" v-bind:selectedMenu="selectedMenu"></oper-review>
        <project-form ref="testForm" v-bind:selectedMenu="selectedMenu"></project-form>

    </div>
</template>

<script>
    import UserPack from "./user-pack";
    import UserFile from "./user-file";
    import MyInfo from "../my/my-info";
    import TeacherExamine from "../my/teacher-examine";
    import StudentUpload from "../my/student-upload";
    import TaskRemind from "../my/task-remind";
    import Question from '@/components/activity/activity-question'
    import ArchivesReview from "../my/archives-review";
    import MyScore from "../my/my-score";
    import OperReview from "../my/oper-review";
    import NoticeIndex from "../my/notice-index";
    import ProjectForm from "../my/project-form";
    import ScoreForm from "../my/score-form";

    export default {
        name: "user-info",
        data(){
            return{
                selectedMenu:"info",
                page:{
                    pageSizes:[10, 50, 100, 200],
                    pageSize:10,
                    pageNum:1,
                    pageTotal:0,
                },
                bgStyle:{
                    backgroundImage:'url('+require("../../assets/images/bg/bg-page.png")+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100%"
                },
                isCollapse:false,
                files:[],
            }
        },
        components:{
            ScoreForm,
            ProjectForm,
            NoticeIndex,
            OperReview,
            MyScore,
            ArchivesReview,
            'activity-question':Question,
            TaskRemind,
            StudentUpload,
            TeacherExamine,
            MyInfo,
            UserFile,
            UserPack
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                var id = this.$route.query.id;
                if(id != undefined){
                    this.handleOpen(id,undefined)
                }
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getOper("page="+this.page.pageNum+"&size="+this.page.pageSize);
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getOper("page="+val+"&size="+this.page.pageSize);
            },
            getOper(param){

            },
            handleOpen(key,keyPath){
                this.selectedMenu = key;
                this.selectedMenu = key;
                this.$refs[key].init();
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .menu-title{
        margin-top: 10px;
        margin-left:50px;
        font-size: 18px;
        height:40px;
        line-height: 40px;
        width: 60%;
        text-align: left;
        cursor: pointer;
    }
    html body{
    }
</style>