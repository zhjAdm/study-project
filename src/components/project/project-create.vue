<template>
    <div style="width:100%;height:800px;background-color: rgba(99%,99%,99%,0.6);">
        <div class="createProjectDiv">
            <el-form ref="form" :model="sizeForm" :rules="rules" label-width="80px" size="mini">

                <el-form-item label="选择项目" prop="projectModelId">
                    <el-select v-model="sizeForm.projectModelId" placeholder="请选择">
                        <el-option
                                v-for="item in nowTimeProject"
                                :key="item.id"
                                :label="item.projectName+'—'+item.grade+'级—'+item.professionalName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="专业导师" prop="teacherId">
                    {{$cookies.get('user').name}}
                </el-form-item>

                <el-form-item label="项目导师" prop="teacherId">
<!--                    <el-transfer filterable v-model="sizeForm.teacherId" :data="tutorData" :titles="['选择导师', '已选择']"></el-transfer>-->
                    <el-select v-model="sizeForm.teacherId" size="mini" placeholder="可输入进行搜索" filterable>
                        <el-option
                                v-for="item in tutorData"
                                :key="item.key"
                                :label="item.label+':'+item.key"
                                :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="项目班级" prop="classId">
                    <el-select size="mini" v-model="sizeForm.classId" filterable placeholder="选择班级">
                        <el-option
                                v-for="item in allClass"
                                :key="item.classId"
                                :label="item.className"
                                :value="item.classId"
                                >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="上传封面">
                    <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture"
                            ref="uploadCover"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            :on-preview="handlePictureCardPreview"
                            :auto-upload="false"
                            :multiple="false"
                            :on-change="imgChange"
                            :limit="1">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="教学包">
                    <el-select v-model="sizeForm.projectPackage" placeholder="请选择">
                        <el-option
                                v-for="item in myPacks"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    &nbsp;
                    <el-button @click="getPackContent"  v-if="sizeForm.projectPackage != undefined" size="mini">预览当前教学包</el-button>
                </el-form-item>

                <el-form-item size="large" >
                    <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "project-create",
        data(){
            return{
                nowTimeProject:[],
                myPacks:[],
                allClass:[],
                uploadSuccessNumber:0,
                dialogImageUrl: '',
                dialogVisible: false,
                rules:{
                    teacherId:[
                        { required: true, message: '请选择导师', trigger: 'change' }
                    ],
                    classId:[
                        { required: true, message: '请选择班级', trigger: 'change' }
                    ],
                    projectModelId:[
                        { required: true, message: '请选择项目', trigger: 'change' }
                    ]
                },
                sizeForm: {
                    teacherId:"",
                    imgFile:{},
                    project:"",
                    pack:"",
                    projectModelId:""
                },
                tutorData:[
                ]
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                var that = this;
                this.$axios.post("/user/getTeacher",{
                    action:"allteacher",
                    page:1,
                    size:10000
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    var tempData = res.data.list;
                    for (let i = 0; i < tempData.length; i++) {
                        if(this.$cookies.get('user').username == tempData[i].username){
                            continue;
                        }
                        that.tutorData.push({label:tempData[i].name,key:tempData[i].username})
                    }
                }).catch(err => {
                    window.console.log('create-err:'+err)
                });
//
                this.$axios.post("/project/getProjectModelBySemester",{
                    semesterId:that.$cookies.get("time").id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.nowTimeProject = res.data;
                });
                this.getTeachPack();
                this.getAllClass();
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
            getTeachPack(){
                this.$axios.post("/project/getProjectInfo",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.myPacks = res.data;
                })
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
                formData.append("file",this.sizeForm.imgFile);
                formData.append("projectModelId",this.sizeForm.projectModelId);
                formData.append("teacherId",[this.sizeForm.teacherId]);
                formData.append("classId",this.sizeForm.classId);
                if(this.sizeForm.projectPackage != undefined){
                    formData.append("projectPackage",this.sizeForm.projectPackage)
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/project/addProject',formData,{
                            timeout:10000,
                            headers:{
                                Accept:"*/*",
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }
                        ).then(res => {
                            //console.log(res)
                            this.$message({
                                message: '创建成功',
                                type: 'success'
                            });
                            loading.close()
                            this.$refs.form.resetFields();
                            this.$refs.uploadCover.clearFiles();
                        }).catch(err => {
                            console.log(err)
                            loading.close()
                            this.$message('创建失败,请重试！');
                        })
                    } else {
                        console.log('error submit!!');
                        loading.close()
                        this.$message.error("请填写必要参数!")
                        return false;
                    }
                });
            },
            uploadSuccess(response, file, fileList){
            },
            uploadError(err, file, fileList){
                this.$message.error('文件上传失败');
            },
            handlePreview(file) {
                window.console.log(file);
            },
            handlePictureCardPreview(file) {
                this.dialogVisible = true;
            },
            imgChange(file, fileList){
                this.sizeForm.imgFile = file.raw;
            },
            //预览教学包
            getPackContent(){
                for (let i = 0; i < this.myPacks.length; i++) {
                    if(this.myPacks[i].id === this.sizeForm.projectPackage){
                        let routeData = this.$router.resolve({
                            name: `ProjectInfo`,
                            query: {
                                projectId:this.myPacks[i].projectId,
                                isLook:1
                            }
                        });
                        window.open(routeData.href, '_blank');
                    }
                }
            }
        }
    }
</script>

<style scoped>
.createProjectDiv{
    width:700px;
}
</style>