<template>
    <div v-if="show" style="width: 100%;margin:0 auto;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item ><span style="font-weight:bold;cursor: pointer;" @click="goBack">当前位置:&nbsp;任务列表</span></el-breadcrumb-item>
            <el-breadcrumb-item>{{task.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <div style="background-color: #8492a6;color: #fff;height:35px;line-height: 35px;">
            <span style="margin-left: 20px;">任务详情：</span>
        </div>
        <br>
        <div v-if="$route.query.isLook == undefined" style="padding-left: 26px;">
            <el-button  type="danger" plain @click="startScorePre(task)" v-if="$route.query.end==0 &&task.status == 0 && ($route.query.ht==1 || $cookies.get('user').role<4)">开始评分</el-button>
            <span v-if="task.status == 1 &&(task.appraiseType == 2 || task.appraiseType == 0) && ($route.query.ht==1 || $cookies.get('user').role<4)">
                <el-link type="info" @click="groupScoreDetail({groupId:''},'group')">小组评分详情</el-link>
            </span>
        </div>
        <br>
        <el-divider content-position="left">任务详情</el-divider>
        <div style="width:95%;margin:0 auto;font-size:14px;min-height:40px;box-shadow: 0 2px 4px rgba(0,0,0,0.40), 0 0 6px rgba(0, 0, 0, .04)">
            <p style="margin: 10px; height:40px;line-height: 40px;">{{task.details}}</p>
        </div>
        <el-divider content-position="left">任务成员</el-divider>
        <div style=" width:95%;margin:0 auto;" v-if="$route.query.isLook == undefined">
            <el-card v-for="(u,i) in userList" :key="i" style="margin-top: 8px;box-shadow: 0 2px 4px rgba(0,0,0,0.40), 0 0 6px rgba(0, 0, 0, .04)">
                <div slot="header" style="font-size: 18px;">
                    {{u.name}} &nbsp;&nbsp;&nbsp;
                    <span style="font-size: 14px" v-if="task.groupType == 0">{{u.groupId}}</span>
                    <span style="margin-left: 30px" v-if="task.status == 0 && $cookies.get('user').role == 4">
                        <el-button v-if="$cookies.get('user').role==4 && (u.status == 0 || u.status == 3) && task.status == 0" @click="uploadPre(u)" size="mini">上传作业</el-button>
                        <el-button size="mini" style="margin-left: 10px;" @click="editFun($event)" >管理文件</el-button>
                    </span>
                </div>

                <div v-if="task.status == 1" style="font-size: 14px;margin-top:10px;">
                <el-divider content-position="left">评分情况</el-divider>
                    <span v-if="task.appraiseType == 1 || task.appraiseType == 0">
                        <el-tag effect="plain">
                            <span style="font-size: 18px;">老师评分:{{u.teacherAppraisal}}</span>
                        </el-tag>
                        <i v-if="$cookies.get('user').role<4 &&task.status == 1" @click="scorePre(u,'teacher')" style="color: #000;cursor: pointer;font-size: 18px;" class="el-icon-edit-outline"></i>
                    </span>
                    <span v-if="task.appraiseType == 2|| task.appraiseType == 0">
                        <span style="font-size: 18px;">小组评分:{{u.groupAppraisal}}</span>
                        <i v-if="$cookies.get('user').role==4&&task.status == 1" @click="scorePre(u,'group')" style="color: #000;cursor: pointer;font-size: 18px;" class="el-icon-edit-outline"></i>
                    </span>
                    <span v-if="task.appraiseType == 3 || task.appraiseType == 0">
                        <span style="font-size: 18px;">组内评分:{{u.userAppraisal}}</span>
                        <i v-if="$cookies.get('user').role==4&&task.status == 1" @click="scorePre(u,'user')" style="color: #000;cursor: pointer;font-size: 18px;" class="el-icon-edit-outline"></i>
                    </span>
                    <span style="margin-left:10px" v-if="task.status == 1&&(task.appraiseType == 3 || task.appraiseType == 0) && ($route.query.ht==1 || $cookies.get('user').role<4)" >
                        <el-link type="info" @click="groupScoreDetail(u,'user')">组内评分详情</el-link>
                    </span>
                </div>

                <div v-for="(num,nin) in u.taskFileNumbers" :key="nin">
                    <div>
                        <el-divider content-position="left">{{num.name}}</el-divider>
                        <div v-for="(file,index) in num.files" :key="file.id">
                            <el-card shadow="hover" style="font-size:14px;width:400px;">
                                <a :href="Global.baseDownloadUrl+'fileName='+file.name+'&path='+file.path">
                                    {{file.name}}
                                </a>
                                <span style="float: right;margin-top:-10px;" v-if="editModel">
                                    <i class="el-icon-error" style="float:left;cursor:pointer;" @click="removeFileOper(0,u.taskFileNumbers,file,index)" v-if="num.status==0"></i>
                                </span>
                                <br>
                                <span >上传者:{{file.author}}</span><br>
                                <span >上传时间:{{file.time}}</span>

                                <span style="float: right;" v-if="$cookies.get('user').role < 4"><el-link type="success" @click="shareFilePre(file)">分享 </el-link></span>
                                &nbsp;
                                <span style="float: right;" v-if="$cookies.get('user').role < 4"><el-link type="warning" @click="shareFileOper(0,file)">收藏 &nbsp;</el-link></span>
                            </el-card>
                        </div>
                        <br>
                        <span v-if="($cookies.get('user').role==4 )&& (u.status == 0) && (num.status==0)">
                            <el-button @click="submitWorkFile(u,num)" size="mini">提交作业</el-button>
                        </span>
                        <br>
                        当前作业状态:
                        <span v-if="num.status===0">未提交</span>
                        <span v-if="num.status===1">未审核</span>
                        <span v-if="num.status===2">通过</span>
                        <span v-if="num.status===3">驳回</span>
                        <div >
                            <br>
                            <span style="color: #3a8ee6;">导师评价：</span>
                            <el-divider direction="vertical"></el-divider>
                            <el-button @click="assessScoreOpen(u,num)" size="mini">评价意见</el-button>


                            <br>
                            <br>

                        </div>
                    </div>

                </div>
            </el-card>
        </div>
        <start-score v-on:reloadData="reloadData" ref="scorePane"></start-score>
        <look-score ref="getScorePane" v-on:reloadData="reloadData" v-bind:groups="groups"></look-score>
        <el-dialog title="评价意见"
                   :visible.sync="assessScoreVir"
                   width="70%">
            <div v-if="$cookies.get('user').role < 4">
                <editor-bar  v-model="editor.info" :isClear="isClear" :initContent="initContent" ref="editor">
                </editor-bar>
                <br><br>
                <el-dialog title="附件"
                           :visible.sync="assessScoreFileVir"
                           width="40%"
                           append-to-body>
                    <div v-for="(file,index) in assessFile" :key="index">
                        <el-card shadow="hover" >
                            <a :href="Global.baseDownloadUrl+'fileName='+file.name+'&path='+file.path">{{file.name}}</a>
                            <span style="float: right;margin-top:-10px;" v-if="enclosEditModel">
                            <i class="el-icon-error" style="float:left;cursor:pointer;" @click="removeFileOper(1,userInfo['assessList'+scoreNum],file,index)"></i>
                        </span><br>

                        </el-card>
                    </div><br><br>
                    <div v-if="$cookies.get('user').role < 4">
                        <el-button size="mini" @click="teacherUploadPre()">上传附件</el-button>
                        <el-button size="mini" @click="enclosEditModel=!enclosEditModel" v-if="enclosEditModel==false">管理附件</el-button>
                        <el-button size="mini" @click="enclosEditModel=!enclosEditModel" v-if="enclosEditModel == true">取消管理</el-button>
                    </div>
                </el-dialog>

                <el-button type="success" size="mini" @click="scoreSubmit(2)">通过</el-button>
                <el-button type="danger" size="mini" @click="scoreSubmit(3)">驳回</el-button>
                <el-button @click="assessScoreFileVir=true,userInfo=fu,scoreNum=fnum" size="mini">附件</el-button>
            </div>
            <div v-else>
                <div v-html="content" style="white-space:pre-wrap">
                    {{content}}
                </div>
            </div>
        </el-dialog>

        <el-dialog title="上传文件"
                :visible.sync="upFileVir"
                width="410px">
            <el-upload
                    class="upload-demo"
                    drag
                    ref="upload"
                    :action="up.url"
                    :data="up.data"
                    name="files"
                    :headers="up.headers"
                    :on-success="upSuccess"
                    :file-list="up.fileList"
                    :auto-upload="false"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-button style="margin-left:250px;" @click="uploadLocal">确定上传</el-button>
        </el-dialog>

        <el-dialog title="分享文件"
                :visible.sync="shareFileVir"
                width="610px">

            <el-tabs tab-position="left" v-model="shareObj.action" style="height: 200px;">
                <el-tab-pane label="老师" name="teacher">
                    <div style="height: 250px;width:100%;overflow: scroll;">
                        <div v-for="(tea,ind) in teachers" :key="ind" style="margin: 5px;">
                            <el-radio :label="tea.username" v-model="shareObj.id">
                                {{tea.name}}--{{tea.username}}
                            </el-radio>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="项目" name="project">
                    <div style="height: 250px;width:100%;overflow: scroll;">
                        <div v-for="(pro,ind) in projects" :key="ind" style="margin: 5px;">
                            <el-radio :label="pro.id" v-model="shareObj.id">
                                {{pro.name}}--{{pro.teachername}}
                            </el-radio>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <el-button style="margin-left:250px;" @click="shareFileOper(1)" >分享</el-button>
        </el-dialog>

    </div>
</template>

<script>
    import StartScore from "./start-score";
    import LookScore from "./look-score";
    import EditorBar from '@/components/EditorBar'

    export default {
        name: "task-content",
        components:{
            LookScore,
            StartScore,
            EditorBar,
        },
        watch:{
            content(){
            }
        },
        props:['show'],
        data(){
            return{
                fu:'',
                fnum:'',
                assessFile:[],
                initContent: '',
                editorContent: '',
                teacherAssessVar:false,
                projects:[],
                assessImages:[],
                tempAssessImages:[],//插入图片临时上传数组
                scoreNum:{},
                assessScoreVir:false,//导师评价
                assessScoreFileVir:false,//导师附件
                enclosEditModel:false,//附件管理按钮
                upFileVir:false,//上传文件
                shareObj:{},
                content: '',
                editorOption: {},
                task:{},
                userList:[],
                userInfo:{},
                teachers:[],
                shareFileVir:false,
                groups:[],
                up:{
                    url:"/api/user/studentInputFile",
                    data:{},
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    },
                    fileList:[]
                },
                editModel:false,//管理文件按钮
                editor: {
                    info: ''
                },
                isClear: true
            }
        },
        methods:{
            init(val){
                this.task = val;
                this.getTaskMembers();
                this.getGroups();
            },
            /*getGroups(){
                let that = this;
                this.$axios.post("/project/getGroup",{id:this.$route.query.projectId},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.groups = res.data;
                    this.$forceUpdate();
                    // eslint-disable-next-line no-unused-vars
                }).catch(err => {
                })
            },*/

            goBack(){
                this.$emit("showTaskList")
            },
            //获取当前任务成员 人或小组
            getTaskMembers(u){
                var that = this;
                this.$axios.post("/project/getStudentInputFile",{
                    taskId:that.task.id,
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.userList = res.data;
                    if(u!=undefined){
                        this.getUserFile(u);
                    }
                    // eslint-disable-next-line no-unused-vars
                }).catch(err => {

                })
            },
            editFun(event){
                if(this.editModel == false) {
                    this.editModel = true;
                    event.srcElement.innerText = "取消编辑";
                }
                else {
                    this.editModel = false;
                    event.srcElement.innerText = "管理文件";
                }
            },
            getUserFile(u){
                this.userInfo = u;
            },//开始评分准备工作
            startScorePre(task){
                //var that = this;
                this.$confirm('开始评分后该任务将不允许修改, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/startTaskAppraisal",{
                        taskId:this.task.id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        if(res.code === 0){
                            task.status = 1;
                        }
                        // eslint-disable-next-line no-unused-vars
                    }).catch(err => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //开始评分
            scorePre(u,type){
                this.$refs.scorePane.init(this.task,u,type);
            },
            //分享文件准备工作
            shareFilePre(file){
                this.shareFileVir = true;
                this.shareObj = file;
                this.shareObj.fileName = file.name;
                var that = this;
                this.$axios.post("/user/getTeacher",{page:1,size:1000},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.teachers = res.data.list;
                })
                this.$axios.post("/project/getProject",{
                    action:"start",
                    page:1,
                    size:1000
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.projects = res.data.list;
                    // eslint-disable-next-line no-unused-vars
                }).catch(err => {
                })
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
                        // eslint-disable-next-line no-unused-vars
                    }).then(res => {
                        this.$message.success("删除成功!");
                        files.splice(index,1);
                    }).catch(err => {
                        window.console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            shareFileOper(num,file){
                if(num === 0){//收藏
                    this.shareObj = file;
                    this.shareObj.id='';
                    this.shareObj.action = "oneself";
                    this.shareObj.fileName = file.name;
                }
                var that = this;
                this.$axios.post("/user/teacherShareFile",this.shareObj,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if(res.code === 0){
                        this.$message.success("操作成功!");
                        that.shareFileVir=false;
                    }else{
                        this.$message.error("操作失败!"+res.message)
                    }

                }).catch(err => {
                    this.$message.error("操作失败!")
                })
            },
            //学生上传准备
            uploadPre(u){
                this.upFileVir=true;
                this.up.url = "/api/user/studentInputFile";
                this.up.data.task = this.task.id;
                this.up.data.group = u.groupId;
            },
            teacherUploadPre(){
                this.upFileVir = true;
                //上传老师附件
                this.up.url = "/api/user/teacherAssess";
                //this.up.data.id=this.userInfo['fileList'+this.scoreNum];
                this.up.data.groupId=this.userInfo.groupId;
                this.up.data.taskId=this.userInfo.taskId;
                this.up.data.id=this.scoreNum.id;
            },
            //上传操作
            uploadLocal(){
                this.$refs.upload.submit();
            },
            upSuccess(res){
                if(res.code === 0){
                    this.$message.success("上传成功！");
                    //重新加载用户文件
                    this.getTaskMembers(this.userInfo);
                    this.upFileVir = false;
                    this.assessScoreFileVir = false;
                }else{
                    this.$message.error("上传失败!"+res.message)
                }
            },
            //评价意见提交
            scoreSubmit(status){
                let that = this;
                window.console.log("修改测试"+that.$refs.editor.value);
                this.$axios.post("/user/teacherAssess",{

                    assess:that.$refs.editor.value,
                    taskId:this.task.id,
                    groupId:this.userInfo.groupId,
                    status:status,
                    id:this.scoreNum.id
                },{
                    timeout:100000,
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if(res.code === 0){
                        that.getTaskMembers();
                        that.$message.success("评价成功！");
                        //that.userInfo['assess'+that.scoreNum] = that.content;
                        that.assessScoreVir = false;
                    }else{
                        that.$message.error("")
                    }
                })
            },
            assessScoreOpen(u,num){
                this.$axios.post("/project/getStudentInputFileAssess",{
                    id:num.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.content = res.data.assess;
                    window.console.log(res.data);
                    this.initContent=res.data.assess;
                    this.assessFile=res.data.fileList;
                    window.console.log(this.assessFile);
                });
                this.assessScoreVir=true;
                this.userInfo = u;
                this.scoreNum = num;
                this.content = num.assess;
                this.fu=u;
                this.fnum=num;
                window.console.log("修改后"+num.assess);
            },
            groupScoreDetail(u,type){
                let routeData = this.$router.resolve({
                    name: "ScoreContent",
                    query: {
                        taskId:this.task.id,
                        groupId:u.groupId,
                        projectId:this.$route.query.projectId,
                        type:type
                    }
                });
                window.open(routeData.href, '_blank');
                //this.$refs.getScorePane.init(this.task,u,type);
            },
            reloadData(){
                this.init(this.task);
            },
            submitWorkFile(u,num){
                let that = this;
                this.$axios.post("/user/studentInputFileOK",{
                    taskId:u.taskId,
                    groupId:u.groupId,
                    id:num.id
                },{
                    timeout:100000,
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if(res.code === 0){
                        that.getTaskMembers();
                        that.$message.success("提交成功!");
                        //num.assess = that.content;
                        that.assessScoreVir = false;
                    }else{
                        that.$message.error("")
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>