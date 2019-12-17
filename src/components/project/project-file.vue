<template>
    <el-card style="background-color: rgba(99%,99%,99%,0.6);">

        <div style="width:100%;height:100%;margin-bottom: 15px;" v-if="$route.query.end==0 &&$route.query.isLook == undefined">
                <el-button slot="trigger" plain type="primary" @click="teacherShare()" v-if="$cookies.get('user').role!=4">导入我的资源文件</el-button>
                <el-button type="success" plain @click="editFun($event)" v-if="$cookies.get('user').role!=4">编辑模式</el-button>

        </div>
        <el-collapse v-model="activeNames" @change="groupHandleChange">
            <el-collapse-item v-for="(stage,index) in stages" :key="index" :title="stage.name" :name="stage.id">
                <div v-for="(file,index) in stage.projectFileList" :key="index" style="width: 40%;float:left;margin:10px;cursor:pointer">
                        <el-card shadow="hover" >
                    <a :href="Global.baseDownloadUrl+'fileName='+file.name+'&path='+file.path">
                            {{file.name}}
                    </a>
                        <span style="float: right;margin-top:-10px;" v-if="editModel">
                            <i class="el-icon-error" style="float:left;cursor:pointer;" @click="removeStudentFromGroup(stage.projectFileList,file,index)"></i>
                        </span>
                            <br>
                            <span style="float:right;">上传者:{{file.author}}</span><br>
                            <span style="float:right;">上传时间:{{file.time}}</span>
                        </el-card>
                </div>
            </el-collapse-item>
        </el-collapse>

        <el-dialog title="文件分享"
                :visible.sync="shareMyFile"
                width="680px"
                center>

            <div style="margin-left:230px;">
                <el-select v-model="nowProjectStageId" placeholder="请选择阶段">
                    <el-option
                            v-for="item in stages"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>

            </div>
            <br>

            <div style="text-align: center">
                <el-transfer
                        style="text-align: left; display: inline-block"
                        v-model="teaUp.shareFile"
                        filterable
                        :titles="['我的文件', '已选择']"
                        :button-texts="['删除已选择', '选择我的文件']"
                        :props="teaUp.props"
                        :format="{
                            noChecked: '${total}',
                            hasChecked: '${checked}/${total}'
                          }"

                        :data="teaUp.data">
                </el-transfer>
                <el-button type="primary" @click="shareFileFun">确定分享</el-button>
            </div>

        </el-dialog>

    </el-card>
</template>

<script>
    export default {
        name: "project-file",
        data() {
            return {
                teaUp:{
                    data:[],
                    shareFile:[],
                    props:{
                        key:"id",
                        label:"name"
                    }
                },
                editModel:false,
                uploadLocalFile: false,
                shareMyFile: false,
                stages:[
                ],
                activeNames: ['1'],
                value:"",
                nowProjectStageId:""
            };
        },
        mounted(){

        },
        methods: {
            init(){
                this.getProjectFile();
            },
            getProjectFile(){
                var that = this;
                this.$axios.post("/project/getProjectFile",{
                    id:that.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(data => {
                    that.stages = data.data;
                })
            },
            teacherShare(){
                this.shareMyFile=true;
                var that = this;
                this.$axios.post("/user/getDriveFile",{page:1, size:10000},{
                        headers:{
                            "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                        }
                }).then(res => {
                    that.teaUp.data = res.data.list;
                })
            },

            groupHandleChange(val){
                for (let i = 0; i < val.length; i++) {
                    if(val[i] == 1){
                        continue;
                    }

                }
            },
            shareFileFun(){
                if(this.nowProjectStageId == undefined || this.nowProjectStageId == ''){
                    this.$message.error("请选择阶段!")
                    return;
                }

                //分享文件
                var that = this;
                this.$axios.post("/project/driveFileInput",{
                    ids:that.teaUp.shareFile.toString(),
                    projectId:that.$route.query.projectId,
                    projectStageId:this.nowProjectStageId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.$message.success("分享成功");
                    var tea = that.teaUp.data;
                    var shareFile = that.teaUp.shareFile;
                    for (let i = 0; i < tea.length; i++) {
                        for (let j = 0; j < shareFile.length; j++) {
                            if(shareFile[j]==tea[i].id){
                                tea[i].author = that.$cookies.get("user").name
                                that.stages.push(tea[i])
                            }
                        }
                    }
                    that.getProjectFile();
                    that.shareMyFile = false;
                }).catch(err => {
                    console.log(err)
                    this.$message.error("分享失败!")
                })
            },
            editFun(event){
                if(this.editModel == false) {
                    this.editModel = true;
                    event.srcElement.innerText = "取消编辑";
                }
                else {
                    this.editModel = false;
                    event.srcElement.innerText = "编辑";
                }
            },
            removeStudentFromGroup(members,file,index){
                var url = "/project/deleteProjectFile";
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$axios.post(url,{
                        id:file.id
                    },{
                        headers:{
                            "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        members.splice(index,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(err => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            uploadLocal(){
                this.stuUp.data.id = this.$route.query.projectId;
                this.$refs.studentUpload.submit();
            },
            stuUpUploadSuccess(response, file, fileList){
                if(response.code != 0){
                    this.$message.error("上传失败!错误原因："+response.message);
                }
            }

        }
    }
</script>

<style scoped>

</style>