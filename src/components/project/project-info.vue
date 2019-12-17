<template>
<!--  项目内选项卡  -->
    <div style="margin-top:10px;" >
        <el-tabs @tab-click="handleClick" v-model="nowTab" type="border-card" style="min-height: 800px;">

<!--            <el-tab-pane label="项目详情" name="detail">-->
<!--                <project-detail ref="detail"></project-detail>-->
<!--            </el-tab-pane>-->

            <el-tab-pane label="项目运行" name="info">
                <project-plan ref="info"></project-plan>
            </el-tab-pane>
            <el-tab-pane label="项目资源" name="totalFile">
                <total-file ref="totalFile"></total-file>
            </el-tab-pane>
            <el-tab-pane label="项目成员" name="student" v-if="$route.query.isLook == undefined">
                <project-student ref="student"></project-student>
            </el-tab-pane>
            <el-tab-pane label="项目评分" v-if="($route.query.ht==1 || $cookies.get('user').role<4)&& $route.query.isLook == undefined" name="score">
                <project-score ref="score"></project-score>
            </el-tab-pane>
            <el-tab-pane label="项目问卷" name="ques">
                <project-question ref="ques"></project-question>
            </el-tab-pane>
            <el-tab-pane label="项目签到" name="signin" v-if="$cookies.get('user').role<4">
                <signin ref="signin"></signin>
            </el-tab-pane>
            <el-tab-pane label="项目中心" name="center">
                <project-center ref="center"></project-center>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ProjectFinal from "./project-final";
    import ProjectCenter from "./project-center";
    import GroupFile from "./group-file";
    import GroupScore from "./group-score";
    import Signin from "./signin/signin";
    import ClassScore from "./score/class-score";
    import TotalFile from "./total-file";
    import ProjectScore from "./score/project-score";
    export default {
        name: "project-info",
        data() {
            return {
                stage:2,
                projectId:"",
                ht:0,
                nowTab:"info",
                bgStyle:{
                    backgroundImage:'url('+require("../../assets/images/bg/bg-page.png")+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100%",
                    minHeight:'800px'
                }
            };
        },
        mounted(){
            this.projectId = this.$route.query.projectId
            this.ht = this.$route.query.ht;
        },
        methods:{
            handleClick(tab, event) {
                this.$refs[tab.name].init();
            }
        },
        components:{
            ProjectScore,
            TotalFile,
            ClassScore,
            Signin,
            GroupScore,
            GroupFile,
            ProjectCenter,
            ProjectFinal,
            ProjectQuestion:resolve => {require(['./project-question'],resolve)},
            ProjectFile:resolve => {require(['./project-file'],resolve)},
            ProjectStudent:resolve => {require(['./project-student'],resolve)},
            ProjectPlan:resolve => {require(['./project-plan'],resolve)}
        }
    }
</script>

<style scoped>

</style>