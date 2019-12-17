<template>
    <div v-if="show=='setUser'">
        <div>
            <el-button @click="addUserPre" size="mini">添加用户</el-button>
            <el-button size="mini" @click="uploadVir=true">批量添加</el-button>
            <el-button size="mini" @click="downloadExcel" type="text">下载批量导入模板</el-button>
        </div>
        <div style="margin-top: 15px;width:560px;margin:40px auto;">
            <el-select v-model="defaultSearchType" placeholder="请选择搜索类别" style="width: 120px;">
                <el-option
                        v-for="(item,index) in searchType"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-input v-if="defaultSearchType!='type'" placeholder="请输入关键字" v-model="search" class="input-with-select" style="width:360px;">
                <el-button slot="append" icon="el-icon-search" @click="searchOper"></el-button>
            </el-input>
            <el-select v-if="defaultSearchType=='type'" v-model="nowSelectRole" placeholder="请选择搜索类别" style="width: 120px;">
                <el-option
                        v-for="(item,index) in roles"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-button v-if="defaultSearchType=='type'" icon="el-icon-search" @click="searchOper"></el-button>
        </div>

        <div style="width:100%;">
            <el-table
                    :data="tableData"
                    border
                    :cell-style="tableRowClassName"
                    :header-cell-style="tableHeaderStyle"
                    style="margin:0 auto;width:1000px;text-align: center;">
                <el-table-column
                        fixed
                        prop="username"
                        label="工号"
                        width="170">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="auth"
                        label="用户类型"
                        :formatter="formatUserType"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="性别"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="telephone"
                        label="手机号"
                        width="180">
                </el-table-column>

                <el-table-column
                        prop="college"
                        label="院系"
                        width="140">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="370">
                    <template slot-scope="scope">
                        <el-button style="color: #f0f0f0;" @click="resetPwd(scope.row)" type="text" size="small">重置密码</el-button>
                        <el-button style="color: #f0f0f0;" @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                        <el-button style="color: #f0f0f0;" @click="deleteUser(scope.$index, tableData,scope.row)" type="text" size="small">删除用户</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="block" style="margin-left: 25%;">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="编辑用户" :visible.sync="dialogTableVisible" center width="30%">
            <el-form :model="editForm" :rules="editRule" status-icon ref="editForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="学工号" prop="username">
                    <el-input v-model="editForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" prop="auth">
                    <el-select v-model="editForm.auth" placeholder="请选择" @change="authChange">
                        <el-option
                                v-for="item in authData"
                                :key="item.roleId"
                                :label="item.auth"
                                :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio v-model="editForm.sex" label="男">男</el-radio>
                    <el-radio v-model="editForm.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="手机号" prop="telephone" >
                    <el-input v-model="editForm.telephone"></el-input>
                </el-form-item>
                <el-form-item label="院系" prop="college">
                    <el-input v-model="editForm.college"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitEditForm('editForm')">提交</el-button>
                    <el-button @click="resetEditForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog  title="上传" :visible.sync="uploadVir">
            <el-upload
                    class="upload-demo"
                    drag
                    :on-success="uploadSuccess"
                    action="/api/user/addUserFile"
                    name="file"
                    :headers='{"X-Auth-Token":$cookies.get("user")["X-Auth-Token"]}'
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "set-user",
        props:['show'],
        data(){
            return{
                upExcel:{

                },
                editRule:{
                    username:[{ required: true, message: '请输入工号', trigger: 'blur' }],
                    name:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
                    auth:[{ required: true, message: '请选择类型', trigger: 'blur' }],
                    sex:[{ required: true, message: '请选择性别', trigger: 'blur' }],
                    telephone:[{ required: true, message: '请输入手机号', trigger: 'blur' }],
                    college:[{ required: true, message: '请选择院系', trigger: 'blur' }]
                },
                dialogTableVisible:false,
                editForm:{},
                authData:[],
                roles:[
                    {name:"院长/教学院长", id:0},
                    {name:"教研室主任", id:1},
                    {name:"项目主任", id:2},
                    {name:"导师", id:3},
                    {name:"学生", id:4},
                    {name:"临时账号", id:5}
                ],
                nowSelectRole:0,
                searchType:[
                    {label:"姓名",value:"name"},
                    {label:"工号",value:"username"},
                    {label:"用户类型",value:"type"},
                    {label:"手机号",value:"telephone"}
                ],
                defaultSearchType:"name",
                defaultTeacherType:"all",
                search:"",
                pageSizes:[10, 50, 100, 200],
                pageSize:10,
                pageNum:1,
                total:0,
                percentage:0,
                tableData:[],
                uploadVir:false,
                editUserName:true
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.getOper();
            },
            resetPwd(row){
                //重置密码
                this.$alert('你确定要重置此用户密码吗', '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$axios.post('/user/resetPwd',{username:row.username},{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }).then( res => {
                            if(res.code===0){
                                this.$message({
                                    type: 'success',
                                    message: "重置成功!"
                                });
                            }else{
                                var mes = res.message
                                this.$message({
                                    type: 'success',
                                    message: "重置失败!错误信息:"+mes
                                });
                            }

                        }).catch(err => {

                        })
                    }
                });
            },
            downloadExcel(){
                window.open('/api/file/getUserModel','_blank')
            },
            addUserPre(){
                this.editForm = {
                    username:"0",
                    college:"旅游学院"
                };
                this.dialogTableVisible = true;
                this.editUserName = false;
                this.getRole();
            },
            handleEdit(index, row) {
                this.editUserName = true;
                this.getRole();
                //编辑用户按钮点击
                this.dialogTableVisible = true;
                window.console.log(row);
                this.editForm = row;
            },
            getRole(){
                var that = this;
                this.$axios.post("/user/getRole","",{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    for(var i=0;i<res.data.length;i++){
                        if(res.data[i].auth==='admin'){
                            res.data[i].auth = "院长/教学院长";
                            res.data[i].roleId = "admin"
                        }else if(res.data[i].auth==='teacher'){
                            res.data[i].auth = "导师";
                            res.data[i].roleId = "teacher"
                        }else if(res.data[i].auth==='director'){
                            res.data[i].auth = "教研室主任";
                            res.data[i].roleId = "director"
                        }else if(res.data[i].auth==='student'){
                            res.data[i].auth = "学生";
                            res.data[i].roleId = "student"
                        }else if(res.data[i].auth==='temporary'){
                            res.data[i].auth = "临时账号";
                            res.data[i].roleId = "temporary"
                        }else if(res.data[i].auth==="projectdirector"){
                            res.data[i].auth = "项目主任";
                            res.data[i].roleId = "projectdirector"
                        }
                    }
                    that.authData = res.data;
                }).catch(err => {
                    this.$message.error("获取用户角色失败");
                })
            },
            deleteUser(index, rows,row){
                this.$alert('你确定要删除此用户吗', '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        //删除用户
                        this.$axios.post("/user/deleteUser",{username:row.username},{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }).then(res => {
                            if(res.code === 0){
                                this.$message({
                                    type: 'success',
                                    message: "删除成功!"
                                });
                            }else{
                                var mes = res.message
                                this.$message({
                                    type: 'success',
                                    message: "删除失败!错误信息:"+mes
                                });
                            }
                        }).catch(err => {

                        })
                        rows.splice(index, 1);
                    }
                });
            },
            searchOper(){
                //搜索
                this.getOper()
            },
            uploadSuccess(response){
                if(response.code != 0){
                    this.$message.error(response.message);
                }else{
                    this.$message.success(response.message)
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getOper();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getOper();
            },
            tableHeaderStyle(){
                return 'background:#0182ce;color:#f0f0f0;'
            },
            tableRowClassName({row, column, rowIndex, columnIndex}){
                var style = "background:#0182ce;color:#f0f0f0;";
                if(rowIndex%2==0){
                    style+= "background-color:rgba(14%,64%,96%,0.6);color:#000;";
                }else{

                }
                return style;
            },
            getOper(){
                var that = this;
                var url = "/user/selectTeacher";

                if(this.defaultSearchType=='type'){
                    this.search = this.nowSelectRole;
                }

                this.$axios.post(url,{
                    page:this.pageNum,
                    size:this.pageSize,
                    id:this.search,
                    action:this.defaultSearchType
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(function (res) {
                    that.total = res.data.total
                    that.tableData = res.data.list;

                }).catch(function (error) {
                    console.log(error);
                    that.$message({
                        showClose: true,
                        message: '获取用户信息异常',
                        type: 'warning'
                    });
                });
            },
            formatUserType(row, column, cellValue){
                if(cellValue === 'teacher' || cellValue === 3){
                    return '导师'
                }else if(cellValue === 'director'){
                    return "教研室主任"
                }else if(cellValue === 'admin'){
                    return "院长/教学院长"
                }else if(cellValue === 'student'){
                    return "学生"
                }else if(cellValue === 'temporary'){
                    return "临时账号"
                }else if(cellValue==="projectdirector"){
                    return "项目主任"
                }
                return cellValue;
            },
            resetEditForm(){
                this.editForm = [];
            },
            authChange(cellValue){
                // let obj = {};
                // obj = this.authData.find((item)=>{
                //     return item.roleId === val;
                // })
                //this.editForm.auth = obj.auth;
                var val = 0;
                if(cellValue === 'teacher'){
                    val = 3
                }else if(cellValue === 'director'){
                    val = 2
                }else if(cellValue === 'admin'){
                    val = 1;
                }else if(cellValue === 'student'){
                    val = 4
                }
                this.editForm.roleId = val;
            },
            submitEditForm(formName){

                var url = "/user/reviseUser";
                if(this.editUserName === false){
                    url = "/user/addUser";
                    this.editForm.auth = this.editForm.roleId;
                    this.editForm = {
                        list:[this.editForm]
                    }
                }
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.jsonPost(url,that.editForm,{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                                "content-type":"application/json"
                            }
                        }).then( res => {
                            if(res.code === 0){
                                this.$message({
                                    type: 'success',
                                    message: "修改成功!"
                                });
                                that.dialogTableVisible = false;
                            }else{
                                this.$message.error("修改失败!错误信息:"+res.message);
                            }
                        }).catch(err => {
                            this.$message.error("修改失败！");
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
</style>