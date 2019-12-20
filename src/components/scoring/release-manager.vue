<template>
    <div>
        <el-divider content-position="left">当前学期考核方案</el-divider>
            <div style="width:96%;margin:0 auto;">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item v-for="(project,index) in nowTimeProject" :key="index" :title="project.projectName" :name="project.id">
                        <div style="border-left: 1px solid #409EFF;border-right:1px solid #409EFF;padding: 10px; ">
                            <div>项目简介：{{project.number}}</div>
                            <br>
                            <div>
                                当前班级考核状态
                            </div>
                            <hr>
                            <el-table
                                    :data="project.datas"
                                    border>
                                <el-table-column
                                        prop="name"
                                        label="项目名称"
                                        width="300">
                                </el-table-column>
                                <el-table-column
                                        prop="className"
                                        label="所属班级"
                                        width="300">
                                </el-table-column>
                                <el-table-column
                                        prop="teachername"
                                        label="创建者"
                                        width="90">
                                </el-table-column>
                                <el-table-column
                                        label="考核状态"
                                        width="90">
                                    <template slot-scope="scope">
                                    <span v-if="scope.row.replyStatus==0">
                                        未考核
                                    </span>
                                        <span v-if="scope.row.replyStatus==1">
                                        进行中
                                    </span>
                                        <span v-if="scope.row.replyStatus==2">
                                        考核结束
                                    </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <br>
                            当前发布项目考核方案
                            <el-button size="mini" @click="testInfoEdit(project)" >新建考核方案</el-button>
                            <hr>
                            <el-table
                                    :data="project.testPlans"
                                    @expand-change="rowClick"
                                    style="width: 100%">
                                <el-table-column type="expand">
                                    <template slot-scope="props">
                                        <el-form label-position="left" class="demo-table-expand">
                                            <el-form-item label="评审方式">
                                                <div v-html="props.row.content">
                                                    {{props.row.content}}
                                                </div>
                                            </el-form-item>
                                        </el-form>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="方案名称"
                                        prop="name"
                                        width="400">
                                </el-table-column>
                                <el-table-column
                                        label="时间"
                                        prop="time"
                                        width="160">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                                size="mini"
                                                @click="testPlanEdit(project,scope.$index, scope.row)">编辑</el-button>
                                        <el-button
                                                size="mini"
                                                type="primary"
                                                @click="testPlanResult(project,scope.$index, scope.row)">查看评分结果</el-button>
                                        <el-button
                                                size="mini"
                                                type="danger"
                                                @click="testPlanDelete(project,scope.$index, scope.row,project.id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>

        <el-dialog title="编辑考核内容" :visible.sync="testInfoEditVir">
            <el-form ref="form" :model="testInfo" label-width="140px" size="mini">
                <!--<el-form-item label="选择考核班级">
                    <el-select v-model="testInfo.projectIds" multiple placeholder="请选择">
                        <el-option
                                v-for="item in nowChildProjects"
                                :key="item.id"
                                :label="item.className"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="考核时间备注">
                    <el-input v-model="testInfo.time" style=""/>
                </el-form-item>
                <el-form-item label="考核评分方案表">
                    <el-select v-model="testInfo.standardId" placeholder="请选择">
                        <el-option
                                v-for="item in testForm"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="考核地点分配">
                    <el-tag
                            :key="tagIndex"
                            v-for="(tag,tagIndex) in testInfo.list"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tagIndex)">
                        {{tag.room}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>-->
                <el-form-item label="是否需要小组评审">
                    <el-checkbox v-model="testInfo.isGroup"/>
                </el-form-item>
                <el-form-item label="评审人员分配">
                    <div  v-for="(place,placeIndex) in testInfo.list"  :key="placeIndex">
                        <el-input v-model="place.room"></el-input>
                        <el-link type="success" @click="addAccountPre(place)">+临时评审账号</el-link>
                        <br>
                        <!--<span v-for="(ac,acIndex) in place.users" :key="acIndex">
                            {{ac.username}}&nbsp;
                            <i class="el-icon-delete" @click="place.users.splice(acIndex,1)"/>
                            &nbsp;
                            <i class="el-icon-edit" @click="tempAccount=ac,addTempTeacherVir=true,editUserVir=true"/>
                            <br>
                        </span>-->
                        <br>
                        <el-select v-model="place.teacherIds" filterable multiple placeholder="请选择">
                            <el-option
                                    v-for="item in teachers"
                                    :key="item.username"
                                    :label="item.name+':'+item.username"
                                    :value="item.username">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" size="mini" @click="submitTestInfo">立即创建</el-button>
                    <el-button size="mini" @click="testInfoEditVir=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog :visible.sync="addTempTeacherVir">
            <el-form>
                <el-form-item label="账号">
                    <el-input type="" v-model="tempAccount.username" placeholder="请输入账号"/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" show-password v-model="tempAccount.password" placeholder="请输入密码"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addAccount" v-if="editUserVir == false">确定添加</el-button>
                    <el-button v-else @click="addTempTeacherVir=false">确定修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "release-manager",
        data(){
            return{
                size:"",
                activeNames:[],
                editSubmitUrl:"",
                spstVir:false,
                nowTimeProject:[],
                nowPlace:{},//当前操作的地点，用来添加临时账户
                editUserVir:false,//编辑用户变量
                nowProject:"",//当前操作的项目 用来更新项目状态
                addTempTeacherVir:false,//临时评审人员添加页面显示变量
                tempTestTeacherVir:false,//临时评审人员管理变量
                testInfoEditVir:false,
                testInfo:{
                    list:[],
                    projectIds:[],
                    users:[]
                },
                tempAccount:{},//临时添加账号
                testPlans:[],
                accounts:[],
                teachers:[],
                nowChildProjects:[],
                testForm:[],
                inputVisible: false,
                inputValue: ''
            }
        },
        mounted(){
        },
        methods:{
            init(){
                this.activeNames = [];
                this.getNowTimeSemeter()
                this.getScoreTeacher();
                this.getTestForm();
            },
            //获取项目考核列表
            getReplyList(id){
                this.$axios.post("/gradeResult/getReplyList",{
                    id:id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    for (let i = 0; i < this.nowTimeProject.length; i++) {
                        if(this.nowTimeProject[i].id==id){
                            this.nowTimeProject[i].testPlans=res.data;
                            this.$forceUpdate();
                        }
                    }
                })
            },
            handleChange(val){
                this.getReplyList(val[val.length-1]);
                this.$axios.post("/project/getProjectByProjectModel",{
                    projectModelId:val[val.length-1]
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    for (let i = 0; i < this.nowTimeProject.length; i++) {
                        if(this.nowTimeProject[i].id==val[val.length-1]){
                            this.nowTimeProject[i].datas=res.data;
                            this.$forceUpdate();
                        }
                    }
                })
            },
            getNowTimeSemeter(){
                this.$axios.post("/project/getProjectModel",{
                    action:"now"
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.nowTimeProject = res.data;
                })
            },
            //获取当前用户的考核评分表
            getTestForm(){
                this.$axios.post("/gradeResult/getStandardList",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.testForm = res.data;
                })
            },
            //新建考核方案
            testInfoEdit(p){
                this.size=p.datas.length;
                for(let i=0;i<this.size;i++){
                     this.testInfo.list.push({room:"请输入教室"});
                     window.console.log("12"+i);
                }
                window.console.log(this.testInfo.list.length);
                this.nowProject = p;
                window.console.log(p);
                
                if(this.testForm.length == 0){
                    this.$confirm('系统检测到你当前未设置考核评分表,是否前往添加?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({
                            name:"UserInfo",
                            query:{
                                id:'testForm'
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }
                this.testInfo.projectIds = [];
                this.nowChildProjects = [];
                for (let i = 0; i < p.datas.length; i++) {
                    if(p.datas[i].replyStatus == 0){
                        this.nowChildProjects.push({className:p.datas[i].className,id:p.datas[i].id})
                    }
                }
                this.testInfo.id = p.id;
                this.testInfoEditVir = true;
                this.testInfo.type = 0;//设置编辑考核方案提交类型
            },
            addAccountPre(place){
                this.editUserVir = false;
                this.addTempTeacherVir=true;
                this.nowPlace = place;
            },
            addAccount(){
                if(this.nowPlace.users == undefined){
                    this.nowPlace.users = [];
                }
                this.nowPlace.users.push(this.tempAccount);
                this.$message.success("添加成功!");
                this.tempAccount = {};
            },
            handleClose(index) {
                this.testInfo.list.splice(index, 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.testInfo.list.push({room:inputValue});
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            //获取老师
            getScoreTeacher(){
                this.$axios.post("/user/getTeacher",{
                    action:"allteacher",
                    page:1,
                    size:10000
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.teachers = res.data.list;
                }).catch(err => {
                    console.log('create-err:'+err)
                })
            },

            //提交考核方案
            submitTestInfo(){

                if(this.testInfo.isGroup == true){
                    this.testInfo.isGroup=1;
                }else{
                    this.testInfo.isGroup=0;
                }
                this.$axios.jsonPost("/gradeResult/addReply",this.testInfo,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "Content-Type":"application/json"
                    }
                }).then(res=>{
                    this.testInfoEditVir = false;
                    this.$message.success("发布成功!")
                    this.handleChange([this.nowProject.id])

                })
            },
            //展开某一行详细内容
            rowClick(row, column, event){
                this.$axios.post("/gradeResult/getReplyContent",{
                    replyId:row.replyId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$set(row,'content','')
                    row.content = res.data.content
                })
            },
            //编辑考核方案
            testPlanEdit(p,index,row){
                this.nowProject = p;
                this.testInfo = row;
                //给当前编辑内容添加项目列表
                this.testInfo.projectIds = [];
                this.nowChildProjects = [];
                for (let i = 0; i < p.datas.length; i++) {
                    if(p.datas[i].replyStatus == 0){
                        this.nowChildProjects.push({className:p.datas[i].className,id:p.datas[i].id})
                    }
                }
                this.testInfo.id = p.id;

                this.$axios.post("/gradeResult/getReplyContent",{
                    replyId:row.replyId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.testInfo.list = res.data.list;
                    //设置是否需要小组评审
                    this.testInfo.isGroup = false;
                    if(res.data.isGroup == 1){
                        this.testInfo.isGroup = true;
                    }
                    //设置评审班级
                    for (let i = 0; i < res.data.projects.length; i++) {
                        this.nowChildProjects.push({className:res.data.projects[i].className,id:res.data.projects[i].id})
                        this.testInfo.projectIds.push(res.data.projects[i].id)
                    }
                    for (let i = 0; i < res.data.list.length; i++) {
                        var tempRoom = res.data.list[i]
                        this.testInfo.list[i].teacherIds = [];

                        //设置评审老师
                        for (let j = 0; j < tempRoom.teachers.length; j++) {
                            this.testInfo.list[i].teacherIds.push(tempRoom.teachers[j].username)
                        }
                    }
                    this.testInfoEditVir = true;
                })
                this.testInfo.type = 1;//设置编辑考核方案提交类型
            },
            //考核方案删除
            testPlanDelete(p,index,row,id){
                this.$confirm('此操作将永久删除该考核方案, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/gradeResult/deleteReply",{
                        replyId:row.replyId,
                        projectModelId:id,
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        p.testPlans.splice(index,1);
                        this.handleChange([p.id]);
                        this.$message.success("删除成功!")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            testPlanResult(p,index,row){
                const { href } = this.$router.resolve({
                    name: `ScoringResult`,
                    query: {
                        replyId:row.replyId
                    }
                });
                window.open(href, "_blank");
            }
        }
    }
</script>

<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>