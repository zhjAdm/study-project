<template>

    <div style="width:100%;height:800px;background-color: rgba(99%,99%,99%,0.6);">
        <div style="width: 700px;">
            <el-form ref="form" :model="sizeForm" :rules="rules" label-width="80px" size="mini">
                <el-form-item label="项目名称" prop="projectNameId">
                    <el-select v-model="sizeForm.projectNameId" placeholder="请选择">
                        <el-option
                                v-for="item in projectNames"
                                :key="item.projectNameId"
                                :label="item.projectName+'——'+item.professionalName"
                                :value="item.projectNameId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目简介" prop="number">
                    <el-input v-model="sizeForm.number" ></el-input>
                </el-form-item>
                <el-form-item label="选择年级" prop="grade">
                    <el-select v-model="sizeForm.grade" placeholder="请选择">
                        <el-option
                                v-for="item in grades"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择学期" >
                    <el-input v-model="$cookies.get('time').semester" disabled></el-input>
                </el-form-item>
                <el-form-item label="上传项目操作手册" prop="file">
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :limit="1"
                            :on-change="fileChange"
                            :on-success="uploadSuccess"
                            :file-list="sizeForm.file"
                            :auto-upload="false">
                        <el-button slot="trigger" size="medium" type="info">选取文件</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item size="large" >
                    <el-button type="primary" @click="onSubmit('form')">发布项目</el-button>
                </el-form-item>

            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        name: "project-release",
        data(){
            return{
                sizeForm: {
                    name: '',
                    number: '',
                    file:[],
                    time:"",
                    projectNameId:'',
                    grade:''
                },
                grades:[],
                projectNames:[],
                time:[],
                rules:{
                    projectNameId: [
                        { required: true, message: '请输入项目名称', trigger: 'change' }
                    ],
                    number:[
                        { required: true, message: '请输入项目简介', trigger: 'blur' }
                    ],
                    file:[
                        {required:true}
                    ],
                    grade:[
                        { required: true, message: '请选择年级', trigger: 'change' }
                    ]
                }
            }
        },
        mounted(){
            this.init();
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

                this.$axios.post("/project/getProjectName",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.projectNames=res.data;
                })
            },
            fileChange(file,){
                this.sizeForm.file[0] = file.raw;
            },

            onSubmit(formName) {

                const loading = this.$loading({
                    lock: true,
                    text: '正在创建项目，请稍等',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                //let form = this.$refs['form'].$el
                let formData = new FormData();
                formData.append("file",this.sizeForm.file[0]);
                formData.append("projectNameId",this.sizeForm.projectNameId);
                formData.append("grade",this.sizeForm.grade);
                formData.append("number",this.sizeForm.number);
                formData.append("semesterId",this.$cookies.get("time").id);

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/project/addProjectModel',formData,{
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
                            loading.close();
                            this.$refs.form.resetFields();
                            this.$refs.upload.clearFiles();
                            this.$refs.uploadCover.clearFiles();
                        }).catch(err => {
                            console.log(err);
                            loading.close()
                            //this.$message('创建失败,请重试！');
                        })
                    } else {
                        loading.close();
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