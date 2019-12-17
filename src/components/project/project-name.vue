<template>

    <div style="width:100%;height:800px;background-color: rgba(99%,99%,99%,0.6);">
        <div style="width: 100%;">
            <el-form ref="form" :model="sizeForm" :rules="rules" label-width="80px" size="mini" style="display: inline-block">
                <el-form-item label="项目名称" prop="projectName">
                    <el-input v-model="sizeForm.projectName" style="width:300px;"></el-input>
                </el-form-item>
                <el-form-item label="选择专业" prop="professionalId">
                    <el-select v-model="sizeForm.professionalId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in professs"
                                :key="item.professionalId"
                                :label="item.professionalName"
                                :value="item.professionalId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="large" >
                    <el-button type="primary" @click="onSubmit('form')">添加项目</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :data="projectNames"
                    border
                    style="width:100%;text-align: center;height:600px;display: inline-block">
                <el-table-column
                        prop="projectName"
                        label="项目名称"
                        width="266">
                </el-table-column>
                <el-table-column
                        prop="professionalName"
                        label="专业名称"
                        width="266">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button style="color: #000;" @click="handleEdit(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
                        <el-button style="color: #000;" @click="deletePro(scope.$index, projectNames,scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑项目" :visible.sync="dialogTableVisible" center width="30%">
            <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" size="mini" style="display: inline-block">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="editForm.projectName" style="width:300px;"></el-input>
                </el-form-item>
                <el-form-item label="选择专业" prop="professional">
                    <el-select v-model="editForm.professionalId" filterable placeholder="请选择">
                        <el-option
                                v-for="item in professs"
                                :key="item.professionalId"
                                :label="item.professionalName"
                                :value="item.professionalId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="large" >
                    <el-button type="primary" @click="submitEditForm('editForm')">提交修改</el-button>
                    <!--<el-button type="primary" @click="onSubmit('form')">添加项目</el-button>-->
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "project-name",
        data(){
            return{
                sizeForm: {
                    projectName: '',
                    professionalId:''
                },
                editForm: {
                    projectNameId: "",
                    projectName: "",
                    username: "",
                    professionalId: "",
                    professionalName: "",
                    semesterId: ""
                },
                dialogTableVisible:false,
                professs:[],
                projectNames:[],
                time:[],
                rules:{
                    projectName: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ],
                    professionalId:[
                        { required: true, message: '请选择专业', trigger: 'change' }
                    ]
                }
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.$axios.post("/user/getProfessional",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.professs=res.data;
                });
                this.$axios.post("/project/getProjectName",{action:"oneself"},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.projectNames=res.data;
                })
            },
            onSubmit(formName) {
                let formData = new FormData();
                formData.append("projectName",this.sizeForm.projectName);
                formData.append("professionalId",this.sizeForm.professionalId);

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/project/addProjectName',formData,{
                                timeout:10000,
                                headers:{
                                    "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                                }
                            }
                        ).then(res => {
                            //console.log(res)
                            this.$message({
                                message: '创建成功',
                                type: 'success'
                            });
                            this.$refs.form.resetFields();
                            this.$refs.upload.clearFiles();
                            this.$refs.uploadCover.clearFiles();
                        }).catch(err => {
                            window.console.log(err);
                            //this.$message('创建失败,请重试！');
                        })
                    } else {
                        window.console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitEditForm(formName){
                let formData = new FormData();

                formData.append("projectNameId",this.editForm.projectNameId);
                formData.append("projectName",this.editForm.projectName);
                formData.append("professionalId",this.editForm.professionalId);

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/project/reviseProjectName',formData,{
                                timeout:10000,
                                headers:{
                                    "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                                }
                            }
                        ).then(res => {
                            window.console.log(res);
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });

                            this.dialogTableVisible = false;
                        }).catch(err => {
                            window.console.log(err);
                            this.$message({
                                message: '修改失败',
                                type: 'success'
                            });

                            this.dialogTableVisible = false;
                            //this.$message('创建失败,请重试！');
                        })
                    } else {

                        window.console.log('error submit!!');
                        return false;
                    }
                });
            },
            deletePro(index,datas,row){
                this.$confirm('此操作将永久删除该项目名称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/deleteProjectName",{
                        projectNameId:row.projectNameId
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        datas.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            handleEdit(index,row) {
                //this.editUserName = true;
               // this.getRole();
                //编辑用户按钮点击
                this.dialogTableVisible = true;
                window.console.log(row);
                this.editForm = row;
            },
        }
    }
</script>

<style scoped>

</style>