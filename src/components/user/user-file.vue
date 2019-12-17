<template>
    <div v-if="selectedMenu == 'file' && $cookies.get('user').role<4">
        <div style="float: left;margin-left: 20px;width:70%;" >
            <el-card style="font-size:18px;width: 100%;padding-bottom: 20px">
                <div slot="header">
                    资源列表
                    <div style="float: right;">
                        <el-upload
                                class="upload-demo"
                                ref="upload"
                                action="/api/user/teacherInputFile"
                                :on-preview="handlePreview"
                                name="files"
                                :data="{type:1,node:nowNode,id:''}"
                                :on-remove="handleRemove"
                                :headers="uploadHeader"
                                :on-success="uploadSuccess"
                                :file-list="fileList"
                                :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                            <el-button style="margin:0 10px;" size="small" type="primary" @click="newFolder">新建文件夹</el-button>
                        </el-upload>
                    </div>

                </div>
                <div>
                    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 20px">
                        <el-breadcrumb-item><a @click="toPageIndex(-1,-1)">目录</a></el-breadcrumb-item>
                        <el-breadcrumb-item  v-for="(page,index) in indexs" :key="index">
                            <a @click="toPageIndex(page,index)">{{page.name}}</a>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <div style="margin: 20px 20px;" v-if="this.files.length == 0">
                        您还没上传过文件哦～
                    </div>
                    <div style="margin-top: 20px">
                        <el-card  v-for="(file,fin) in this.files" :key="fin" style="float:left;margin:0 10px;width:98%;" shadow="hover" >
                            <!--@mouseenter="changeActive($event)" @mouseleave="removeActive($event)"-->
                            <div class="el-dropdown-link" style="height: 20px;font-size:16px; ">
                                <i style="size: 60px;color: #3a8ee6" class="el-icon-folder" v-if="file.type===0"/>
                                <i style="size: 60px;color: #e62111" class="el-icon-folder" v-if="file.type===1"/>
                                <a style="margin-left: 10px;line-height: 20px;" @click="openDir(file)">{{file.name}}</a>
                                <br>
                                <div style="float: right">
                                    <span style="margin-right:60px;font-size: 14px;">上传者:{{file.author}}</span>
                                    <span style="margin-right:60px;font-size: 14px;">上传时间:{{file.time}}</span>
                                    <el-link style="margin-right:20px " type="success" @click="shareFilePre(file)">分享 </el-link>
                                    <el-link style="margin-right:20px " type="danger" @click="removeFile(file,fin)">删除</el-link>
                                    <el-link type="primary" @click="restName(file)">重命名</el-link>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-card>

        </div>

        <el-dialog title="文件上传"
                :visible.sync="uploadLocalFile"
                width="410px"
                center>
            <br>

            <el-upload
                    class="upload-demo"
                    drag
                    ref="teaUpload"
                    :action="teaUp.url"
                    :data="teaUp.data"
                    name="files"
                    :headers="teaUp.headers"
                    :on-success="upSuccess"
                    :file-list="teaUp.fileList"
                    :auto-upload="false"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-button style="margin-left:40px;" @click="uploadLocal">确定上传</el-button>

        </el-dialog>

        <el-dialog title="分享文件"
                :visible.sync="shareFileVir"
                width="610px">

                <div style="height: 250px;width:100%;overflow: scroll;">
                    <div v-for="(tea,ind) in teachers" :key="ind" style="margin: 5px;">
                        <el-radio :label="tea.username" v-model="shareObj.id">
                            {{tea.name}}--{{tea.username}}
                        </el-radio>
                    </div>
                </div>

            <el-button style="margin-left:250px;" @click="shareFileOper()" >分享</el-button>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "user-file",
        props: ['selectedMenu'],
        data() {
            return {
                indexs:[],
                nowNode:0,
                editModel: false,
                shareObj: {},
                teachers: [],
                shareFileVir: false,
                teaUp: {
                    url: "/api/user/teacherInputFile",
                    data: {},
                    headers: {
                        "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                    },
                    fileList: [
                    ]
                },
                uploadLocalFile: false,
                page: {
                    pageSizes: [10, 50, 100, 200],
                    pageSize: 10,
                    pageNum: 1,
                    pageTotal: 0,
                },
                files: [],
                fileTypes:[{
                    name:"我的文件",
                    label:"1"
                },{
                    name:"收到的分享",
                    label:"2"
                },{
                    name:"我的收藏",
                    label:"3"
                }],//文件分类
                nowFileType:"",
                uploadHeader:{
                    "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                },
                fileList:[],

            }
        },
        methods: {
            init() {
                this.getOper()
            },
            getOper() {
                var that = this;
                this.$axios.post("/user/getDriveFileByNode", {
                    node: this.nowNode,
                },{
                    headers: {
                        "X-Auth-Token": that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    window.console.log(res.data);
                    this.files=res.data;
                }).catch(err => {
                    window.console.log(err);
                    that.$message.error("获取文件失败!")
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getOper({
                    page: this.page.pageNum,
                    size: this.page.pageSize,
                    label:this.nowFileType
                });
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getOper({
                    page: this.page.pageNum,
                    size: this.page.pageSize,
                    label:this.nowFileType
                });
            },
            uploadLocal() {
                this.$refs.teaUpload.submit();
            },
            upSuccess(res, file, fileList) {
                if (res.code === 0) {
                    this.$message.success("上传成功!")
                } else {
                    this.$message.success("上传失败!" + res.message)
                }
            },
            removeFileOper(files, file, index) {
                var url = "/user/deleteDriveFile";
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$axios.post(url, {
                        id: file.id
                    }, {
                        headers: {
                            "X-Auth-Token": that.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        files.splice(index, 1);
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
            shareFilePre(file) {
                this.shareFileVir = true;
                this.shareObj = file;
                this.shareObj.fileName = file.name;
                var that = this;
                this.$axios.post("/user/getTeacher", {page: 1, size: 1000}, {
                    headers: {
                        "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.teachers = res.data.list;
                })
            },
            shareFileOper() {
                var that = this;
                this.shareObj.action = 'teacher';
                this.$axios.post("/user/teacherShareFile", this.shareObj, {
                    headers: {
                        "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if (res.code === 0) {
                        this.$message.success("操作成功!")
                        that.shareFileVir = false;
                    } else {
                        this.$message.error("操作失败!" + res.message)
                    }
                }).catch(err => {
                    this.$message.error("操作失败!")
                })
            },
            selectFileType(val){
                this.getOper(
                    {
                        page: this.page.pageNum,
                        size: this.page.pageSize,
                        label:val
                    }
                )
            },
            handleRemove(file, fileList) {
                window.console.log(file, fileList);
            },uploadSuccess(){
                this.$message.success("上传成功!");
                this.init();
            },
            newFolder(){
                this.$axios.post("/user/teacherInputFile",{
                    type:0,
                    node:this.nowNode,
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    window.console.log(res.data);
                    this.files.push(res.data)
                })
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            openDir(folder){
                if(folder.type===0){
                    this.nowNode=folder.id;
                    window.console.log(this.nowNode);
                    this.$axios.post("/user/getDriveFileByNode",{
                        node:this.nowNode,
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.files=res.data;
                        this.nowNode = folder.id;
                        this.indexs.push(folder);
                        this.$forceUpdate();
                    })
                }else if(folder.type===1){
                    window.open(this.Global.baseDownloadUrl+"fileName="+folder.name+'&path='+folder.path,"_blank");
                }

            },
            handlePreview(file) {
                window.console.log(file);
            },
            toPageIndex(index,num){
                if(num === -1){
                    this.nowNode=0;
                    this.getOper();
                    this.indexs = [];
                }else{
                    this.indexs.splice(num,this.indexs.length-num);
                    this.openDir(index);
                }

            },
            removeFile(file,index){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/user/deleteDriveFile",{
                        id:file.id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        window.console.log(res);
                        this.$message.success("删除成功!");
                        this.files.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            restName(file){

                this.$prompt(file.name, '提示',)
                    .then(({ value }) => {
                        this.$axios.post("/user/reviseDriveFileName",{
                            id:file.id,
                            name:value
                        },{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }).then(res=>{
                            window.console.log(res);
                            file.name=value
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });

            },
        }
    }
</script>

<style scoped>
    .block{
        text-align: center;
        margin-top: 20px;
    }
</style>