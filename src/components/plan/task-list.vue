<template>
    <div>
        <div v-if="showList">
            <div style="width:100%;height:35px;line-height:35px;background:#D3DCE6;">
                <span style="margin-left:20px;">任务列表</span>
                <span style="float:right;margin-right: 30px;" v-if="$cookies.get('user').role < 4">
                    <el-link type="primary" :underline="false" @click="exportStageFile">导出当前阶段文件</el-link>
                </span>
            </div>
            <br>
            <div v-for="(v,i) in theTaskList" :key="i" :title="v.name" :name="v.id" >
                <el-card class="box-card">
                    <div slot="header" class="clearfix" @click="clickTask(v)">
                        <span>{{v.name}}</span>
                        <el-dropdown style="float: right; padding: 3px 0" v-if="$route.query.end==0 &&($route.query.ht==1 || $cookies.get('user').role<4)">
                              <span class="el-dropdown-link">
                                <i class="el-icon-more" style="font-size:24px;"/>
                              </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><span @click="editTaskPre(v)">编辑</span></el-dropdown-item>
                                <el-dropdown-item ><span @click="deleteTask(v,i)">删除</span></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div style="margin-left:12px;font-size: 14px;" @click="clickTask(v)">
                        是否开始评分: <span v-if="v.status == 1">已经开始</span>
                        <span v-else >未开始</span><br>
                        最终提交时间: {{v.time}}<br>任务总分:{{v.totalScore}}<br>
                        评分提交方式：<span v-if="v.groupType==0">个人</span><span v-else> 小组</span> <br>
                        是否允许超时：<span v-if="v.timeOut==0">允许</span><span v-else> 不允许</span><br>
                        任务总分：<span >{{v.totalScore}}</span><br>
                        评分方式：
                        <span v-if="v.appraiseType == 0">
                            <br>
                            &nbsp;老师评分权重:{{v.teacherScale}}%<br>
                            &nbsp;小组评分权重:{{v.groupScale}}%<br>
                            &nbsp;组内评分权重:{{v.userScale}}%<br>
                        </span>
                        <span v-if="v.appraiseType == 1">
                            老师评分
                        </span>
                        <span v-if="v.appraiseType == 2">
                            小组评分
                        </span>
                        <span v-if="v.appraiseType == 3">
                            组内评分
                        </span>
                    </div>
                </el-card>
            </div>
        </div>
        <edit-task ref="editTaskCom" v-on:editTask="editTask" v-bind:show="editTaskVisible"/>
        <task-content ref="taskContent" v-bind:show="show" v-on:showTaskList="showTaskList"/>

    </div>
</template>

<script>

    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import TaskContent from "./task-content";
    import EditTask from "./edit-task";

    export default {
        name: "plan-task",
        props:{
            taskList:{
                type:Array
            },
            stage:{
                type:Object
            }
        },
        components: {
            EditTask,
            TaskContent,
        },
        mounted(){
            this.init();
        },
        data(){
            return{
                editTaskVisible:false,
                nowTaskId:"",//当前选择的任务id,
                nowTask:{},//当前选择的任务对象
                theTaskList:[],
                userList:[],
                userInfo:{},
                show:false,
                showList:true
            }
        },
        methods:{
            clickTask(v){
                this.showList = false;
                this.show=true
                this.$refs.taskContent.init(v);
            },
            showTaskList(){
                this.showList = true;
                this.show=false
            },
            init(id){
                this.getGroups();
                this.show=false;
                this.showList = true;
                this.nowTaskId = "";
                var that = this;
                this.theTaskList = this.taskList;
                if(id != undefined && id != 'undefined'){
                    this.$axios.post("/project/getTask",{
                        stageId:id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        that.theTaskList = res.data;
                    }).catch(err => {

                    })
                }
            },
            getGroups(){
                var that = this;
                this.$axios.post("/project/getGroup",{id:this.$route.query.projectId},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.groups = res.data;
                    this.$forceUpdate();
                }).catch(err => {
                })
            },
            getUserFile(u){
                this.userInfo = u;
            },
            //删除文件按钮
            removeFileOper(num,files,file,index){
                var url = "/user/deleteTaskFile";
                if(num == 1){
                    url = "/user/deleteTeacherAssessFile";
                }
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post(url,{
                        id:file.id,
                        path:file.path,
                        projectId:this.$route.query.projectId
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        if(res.code === 0){
                            this.$message.success("删除成功!")
                            files.splice(index,1);
                        }else{
                            this.$message.error("删除失败!"+res.message)
                        }
                    }).catch(err => {
                        console.log(err)
                        this.$message.error("删除失败!");
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

            //设置任务信息
            editTask(obj){
                this.$emit("editTask",obj)
                this.$refs.editTaskCom.init(undefined,false);
            },
            editTaskPre(v){
                this.editTaskVisible=true;
                this.$refs.editTaskCom.init(v,true);
            },

            deleteTask(val,ind){
                this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/deleteTask",{
                        projectId:this.$route.query.projectId,
                        taskId:val.id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        if(res.code === 0){
                            this.$message.success("删除成功!")
                            this.$emit("delTask",ind)
                        }else{
                            this.$message.error("删除失败!"+res.message)
                        }
                    }).catch(err => {
                        this.$message.error("删除失败!")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            exportStageFile(){
                window.open("/api/file/downloadStagesFile?projectId="+this.$route.query.projectId+'&stagesId='+this.stage.id+'&stagesName='+this.stage.name);
            }

        }
    }
</script>

<style scoped>
    .text1 {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 340px;
        margin-left: 20px;
        float: left;
    }
    .box-card:hover {
        border:1px solid #3a8ee6;
        cursor: pointer;
    }
    /*任务下拉菜单*/
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>