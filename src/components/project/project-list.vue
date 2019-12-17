<template>
    <div style="width:100%;height:800px;background-color: rgba(99%,99%,99%,0.6);">
        <div style="float: right;">
        <el-select v-if="status == 'end'" v-model="nowSemes" @change="changeSemes" size="mini" placeholder="请选择学期">
            <el-option
                    v-for="item in semes"
                    :key="item.id"
                    :label="item.semester"
                    :value="item.id">
            </el-option>
        </el-select>
        </div>
        <br>

        <div class="box-card" v-for="(project,index) in projectData" :key="index">
            <a @click="routeTo(project)">
                <div class="box-card">
                    <div style="height: 260px;width: 260px" :style="{backgroundImage:'url('+project.img+')',backgroundRepeat:'no-repeat',backgroundSize:'100% 100%'}" >

                            <span>{{project.name}}</span>
                            <el-dropdown style="float: right; padding: 3px 0" v-if="$cookies.get('user').role<4">
                              <span class="el-dropdown-link">
                                <i class="el-icon-more" style="font-size:24px;color:#000;"/>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item><span @click="getProjectForId(project.id)">编辑</span></el-dropdown-item>
                                    <el-dropdown-item ><span @click="removeProject(project.id,index)">删除</span></el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                    </div>
                    <div style="background-color:rgba(99%,99%,99%,0.5);height:80px;line-height: 50px;color: #021111;width: 240px;padding:0 10px; ">
                        <div style="font-size: 10px">{{project.className}}</div>
                        <div style="color:#475669;font-size: 16px;margin: 0 0;float:right;">
                            <el-avatar size="small" style="margin-top: 0px;" :src="project.userimg"></el-avatar>
                            <div style="float:right;margin-left:10px;margin-top: -5px;">
                                <span style="margin-right: 5px;">
                                    {{project.teachername}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <br clear="all">
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="page.pageSizes"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.pageTotal">
            </el-pagination>
        </div>

        <el-dialog title="项目信息编辑"
                :visible.sync="editProjectVir">

            <el-breadcrumb separator="/">
                <el-breadcrumb-item >当前项目导师:</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(pro_tea,index) in nowProject.teacher" :key="index">{{pro_tea.name}}</el-breadcrumb-item>
            </el-breadcrumb>

            <el-divider content-position="left">重新选择导师</el-divider>

            <el-select v-model="nowTeaId" size="mini" placeholder="可输入进行搜索" filterable>
                <el-option
                        v-for="item in teacherList"
                        :key="item.username"
                        :label="item.name+':'+item.username"
                        :value="item.username">
                </el-option>
            </el-select>
            <el-divider content-position="left">重新选择班级</el-divider>
            <el-select size="mini" v-model="nowProject.classId" filterable placeholder="选择班级">
                <el-option
                        v-for="item in allClass"
                        :key="item.classId"
                        :label="item.className"
                        :value="item.classId">
                </el-option>
            </el-select>

            <el-divider content-position="left">重新选择封面</el-divider>
            选择封面:
            <el-upload
                    action=""
                    list-type="picture"
                    ref="uploadCover"
                    :auto-upload="false"
                    :multiple="false"
                    :limit="1"
                    :on-change="imgChange">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-divider content-position="left">提交操作</el-divider>
            <el-button @click="submitEditProject">提交</el-button>

        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: "project-list",
        data(){
            return {
                editProjectVir:false,
                nowProject:{},
                teacherList:[],
                page:{
                    pageSizes:[8, 50, 100, 200],
                    pageSize:8,
                    pageNum:1,
                    pageTotal:0
                },
                allClass:[],
                nowTeaId:"",
                status:"",
                projectData:[],
                sizeForm: {
                    file:[]
                },
                bgStyle:{
                    backgroundImage:'url('+require("../../assets/images/bg/bg-page.png")+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100%"
                },
                nowSemes:"",
                semes:[]
            }
        },
        mounted(){
            this.init("start");
        },
        methods:{
            init(status){
                this.status = status;
                if(status == 'create' || status == 'release'){
                    return;
                }
                this.getProject(status,this.page.pageNum,this.page.pageSize)
                this.getProjecgSemeAll();
                this.getAllClass();
            },
            getProjecgSemeAll(){
                this.$axios.post("/project/getSemesterAll",{

                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.semes = res.data;
                })
            },
            getAllClass(){
                this.$axios.post("/user/getProfessionalClass","",{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    var claArr = res.data
                    this.allClass = claArr;
                }).catch(err => {
                    this.$message.error("获取班级信息失败!")
                })
            },
            getProject(status,page,size){
                this.loading = true;
                var that = this;
                this.$axios.post("/project/getProject",{
                    action:status,
                    page:page,
                    size:size
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.projectData = res.data.list;
                    that.page.pageTotal = res.data.total;
                    this.loading = false;
                }).catch(err => {
                    //console.log("err"+err)
                    that.$message.error("获取项目信息失败，请刷新重试！");
                    this.loading = false;
                })
            },
            getProjectSemester(val,page,size){
                this.$axios.post("/project/getProjectBySemester",{
                    id:val,
                    page:page,
                    size:size
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    if(res.data!=null){
                        this.projectData = res.data.list;
                        this.page.pageTotal = res.data.total;
                    }else{
                        this.projectData = [];
                        this.page.pageTotal = 0;
                    }
                })
            },
            changeSemes(val){
                this.getProjectSemester(val,1,8);
            },
            imgChange(file,filesList){
                this.sizeForm.file.push(file.raw)
            },
            getProjectForId(val){
                this.editProjectVir = true;
                this.$axios.post("/project/getProjectById",{
                    id:val
                },{headers:{"X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']}})
                    .then(res => {
                    this.nowProject = res.data;
                }).catch(err => {

                })

                this.$axios.post("/user/getTeacher",{
                    action:"teacher",
                    page:1,
                    size:10000
                },{headers:{"X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']}})
                    .then(res => {
                        this.teacherList = res.data.list;
                        for (let i = 0; i < this.nowProject.teacher.length; i++) {
                            if(this.nowProject.teacher[i].username == res.data.list[i].username){
                                res.data.list[i].check = true;
                            }
                        }
                    })
            },
            submitEditProject(){
                let formData = new FormData()
                formData.append("file",this.sizeForm.file[0])
                formData.append("id",this.nowProject.id)
                var tempTeacherArr = [];
                for (let i = 0; i < this.teacherList.length; i++) {
                    if(this.teacherList[i].check == true){
                        tempTeacherArr.push(this.teacherList[i].username)
                    }
                }
                formData.append("teacherId",[this.nowTeaId]);
                this.$axios.relPost('/project/reviseProject',formData ,{
                        timeout:10000,
                        headers:{"X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']}
                    }).then(res => {
                    //console.log(res)
                    if(res.code===0){
                        this.$message({
                            message: '修改成功!',
                            type: 'success'
                        });
                    }else{
                        this.$message('修改失败');
                    }
                }).catch(err => {
                    this.$message('修改失败');
                })

                this.editProjectVir = false;
            },
            routeTo(project){
                var ht = 0;//助教
                for (let i = 0; i < project.assistant.length; i++) {
                    if(this.$cookies.get('user').username == project.assistant[i]){
                        ht = 1;
                    }
                }
                if(project.status == null){
                    project.status = 0;
                }
                this.$router.push({
                    name: `ProjectInfo`,
                    query: {
                        projectId:project.id,
                        ht:ht,
                        end:project.status
                    }
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                if(this.nowSemes != ''){
                    this.getProjectSemester(val,this.page.pageNum,this.page.pageSize);
                }else{
                    this.getProject(this.status,this.page.pageNum,this.page.pageSize)
                }
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                if(this.nowSemes != ''){
                    this.getProjectSemester(val,this.page.pageNum,this.page.pageSize);
                }else{
                    this.getProject(this.status,this.page.pageNum,this.page.pageSize)
                }
            },
            removeProject(val,index){
                this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/deleteProject",{
                        id:val
                    },{
                        headers:{"X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']}
                    }).then(res => {
                        if(res.code == 0){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.projectData.splice(index,1);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 260px;
        height: 340px;
        float:left;
        margin-left:30px;
        margin-top:10px;
    }
    .title{
        float: left;
    }
    .block{
        text-align: center;
        margin-top: 20px;
    }
</style>