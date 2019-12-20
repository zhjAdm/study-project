<template>
    <div >
        <el-table
                :data="projects"
                height="750"
                border
                style="width: 100%">
            <el-table-column
                    prop="projectName"
                    label="项目名称"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="简介"
                    width="240">
            </el-table-column>
            <el-table-column
                    prop="semester"
                    label="学期"
                    width="190">
            </el-table-column>
            <el-table-column
                    prop="professionalName"
                    label="专业"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="grade"
                    label="年级"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="teacherName"
                    label="创建者"
                    width="90">
            </el-table-column>
            <el-table-column
                    label="编辑"
                    width="160">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑项目" :visible.sync="editVir">
            <el-form ref="form" :model="editFormContent" label-width="120px" size="mini">
                <el-form-item label="项目名称">
                    <el-input v-model="editFormContent.projectName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="项目简介">
                    <el-input v-model="editFormContent.number"></el-input>
                </el-form-item>
                <el-form-item label="项目专业">
                    <el-input v-model="editFormContent.professionalName" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="选择年级" prop="grade">
                    <el-select v-model="editFormContent.grade" placeholder="请选择">
                        <el-option
                                v-for="item in grades"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="项目操作手册">
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            action=""
                            :limit="1"
                            :on-change="fileChange"
                            :on-success="uploadSuccess"
                            :file-list="editFormContent.file"
                            :auto-upload="false">
                        <el-button slot="trigger" size="medium" type="info">选取文件</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item size="large">
                    <el-button type="primary" @click="setEdit(editFormContent.id)">提交修改</el-button>
                    <el-button @click="editVir=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "project-release",
        data(){
            return{
                projects:[],
                editVir:false,
                editFormContent:{},
                professs:[],
                grades:[],
            }
        },
        methods:{
            init(){
                this.$axios.post("/project/getGrade",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.grades=res.data;
                });
                this.getAllProjectRelease();
                this.getProfess();
            },
            getProfess(){
                this.$axios.post("/user/getProfessional",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.professs=res.data;
                })
            },
            getAllProjectRelease(){
                this.$axios.post("/project/getProjectModel",{
                    action:"all"
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.projects = res.data;
                })
            },
            handleEdit(index,row){
                this.editVir = true;
                this.editFormContent = row
            },
            handleDelete(index,row){
                this.$confirm('此操作将永久删除该发布项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/deleteProjectModel",{
                        id:row.id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.projects.splice(index,1)
                        this.$message.success("删除成功!")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            setEdit(id){

                let formData = new FormData()
                if(this.editFormContent.file != undefined){
                    formData.append("file",this.editFormContent.file)
                }
                formData.append("grade",this.editFormContent.grade);
                formData.append("number",this.editFormContent.number);
                formData.append("id",id);

                this.$http.post('/project/reviseProjectModel',formData,{
                        timeout:10000,
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }
                ).then(res => {
                    //console.log(res)
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.editVir = false;
                }).catch(err => {
                    console.log(err)
                    //this.$message('创建失败,请重试！');
                })
            },
            fileChange(file){
                this.editFormContent.file = file.raw;
            },
            uploadSuccess(response, file, fileList){
            },
        }
    }
</script>

<style scoped>

</style>