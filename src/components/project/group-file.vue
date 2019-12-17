<template>
    <div style="height: 800px;">
            <div style="float: right;" v-if="$cookies.get('user').role==4">
                <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="/api/user/studentInputPublicFile"
                        :on-preview="handlePreview"
                        name="file"
                        :data="{projectId:this.$route.query.projectId,type:1,groupId:groups[0].id,node:nowNode,id:''}"
                        :on-remove="handleRemove"
                        :headers="uploadHeader"
                        :on-success="uploadSuccess"
                        :file-list="fileList"
                        :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <el-button @click="newFolder" style="margin:0 10px;" size="small" type="primary">新建文件夹</el-button>
                </el-upload>
            </div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><a @click="toPageIndex(0,0)">小组目录</a></el-breadcrumb-item>
                <el-breadcrumb-item  v-for="(page,index) in indexs" :key="index">
                    <a @click="toPageIndex(page,index)">{{page.name}}</a>
                </el-breadcrumb-item>
            </el-breadcrumb>
            <div style="float:left;">
                <el-card style="margin: 10px 0;padding-bottom: 10px;width:880px" shadow="never" v-for="(group,index) in groups" :key="index" >

                    <div slot="header" style="width:100%;" v-if="groups.length>1">
                        {{group.name}}
                    </div>
                    <el-card  v-for="(file,fin) in group.files" :key="fin" style="float:left;margin:0 10px;width:98%;" shadow="hover" >
                        <!--@mouseenter="changeActive($event)" @mouseleave="removeActive($event)"-->
                        <div class="el-dropdown-link" style="height: 20px;font-size:16px; ">
                                <i style="size: 60px;color: #3a8ee6" class="el-icon-folder" v-if="file.type===0"/>
                                <i style="size: 60px;color: #e62111" class="el-icon-folder" v-if="file.type===1"/>
                                <a style="margin-left: 10px;line-height: 20px;" @click="openDir(group,file)">{{file.name}}</a>
                                <div style="float: right">
                                    <el-link style="margin-right:20px " type="danger" @click="removeFile(file,group.files,fin)">删除</el-link>
                                    <el-link type="primary" @click="restName(file)">重命名</el-link>
                                </div>
                        </div>
                    </el-card>
                </el-card>
            </div>
    </div>
</template>

<script>
    export default {
        name: "group-file",
        data(){
            return{
                groups:[],
                fileList:[],
                indexs:[],
                nowGroups:{},
                nowNode:0,
                uploadHeader:{
                    "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                }
            }
        },
        methods:{
            init(){
                this.getGroupFiles();
            },
            getGroupFiles(){
                this.$axios.post("/user/getPublicFile",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.groups = res.data;
                })
            },
            restName(file){

                this.$prompt(file.name, '提示',)
                .then(({ value }) => {
                    this.$axios.post("/user/reviseFileName",{
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
            newFolder(){
                this.$axios.post("/user/studentInputPublicFile",{
                    groupId:this.groups[0].id,
                    type:0,
                    node:this.nowNode,
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    let group = this.groups[0];
                    group.files.push({
                        groupId:group.id,
                        type:0,
                        node:this.nowNode,
                        name:"新建文件夹",
                        id:res.data
                    })
                })
            },
            toPageIndex(index,num){
                window.console.log("测试目录"+num);
                if(num === 0){
                    this.nowNode=0;
                    this.getGroupFiles();
                    this.indexs = [];
                }else{
                    this.indexs.splice(num,this.indexs.length-num);
                    this.openDir(this.nowGroup,index);
                }
            },
            openDir(group,folder){
                if(folder.type===0){
                    this.nowGroup = group;
                    this.nowNode=folder.id;
                    window.console.log(this.nowNode);
                    this.$axios.post("/user/getGroupProjectFileByRoot",{
                        groupId:folder.groupId,
                        node:this.nowNode,
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.nowNode = folder.id;
                        window.console.log(this.nowNode);
                        group.files = res.data;
                        this.groups.length=0;
                        this.groups.push(group);
                        if(this.indexs.length===0){
                            this.indexs.push(group);
                        }
                        this.indexs.push(folder);
                        this.$forceUpdate();
                    })
                }else if(folder.type===1){
                    window.open(this.Global.baseDownloadUrl+"fileName="+folder.name+'&path='+folder.path,"_blank");
                }

            },
            removeFile(file,files,index){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/user/deletePublicFile",{
                        id:file.id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        window.console.log(res);
                        this.$message.success("删除成功!");
                        files.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {p
                window.console.log(file, fileList);
            },
            handlePreview(file) {
                window.console.log(file);
            },
            uploadSuccess(){
                this.$message.success("上传成功!");
                this.init();
            },
            /*downloadFile(file){
                window.open(this.Global.baseDownloadUrl+"fileName="+file.name+'&path='+file.path,"_blank");
            }*/
            changeActive($event) {
                $event.currentTarget.className = 'el-card  maaXwzJ';
            },
            removeActive($event) {
                $event.currentTarget.className = 'el-card ';
            }

        }
    }
</script>

<style >
    .maaXwzJ {
        background: #F4FBFF;
        border-color: #CBEDFF;
    }

</style>