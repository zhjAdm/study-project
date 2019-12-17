<template>
<!--  视频上传页面  -->
    <div >
        <div style="margin-top: 15px;width:700px;margin:40px auto;">
            <div style="float:left;">
                <el-button type="primary" plain @click="editVir=true" v-if="editVir==false">编辑模式</el-button>
                <el-button type="primary" plain @click="editVir=false" v-else-if="editVir==true">取消编辑</el-button>
                <el-button type="danger" plain @click="deleteVideo" v-if="editVir==true">删除</el-button>
                <el-button type="primary" plain @click="uploadLocalFile=true" >上传教学包</el-button>
            </div>
            <div style="float:left;margin-left: 50px;">
                <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchVideo"></el-button>
                </el-input>
            </div>
            <br clear="all">
        </div>
        <div style="width:100%">
            <div v-for="(value,index) in data.list" :key="index" >
                <div style="float:left;">
                    <el-checkbox v-if="editVir" @change="checkChange(value)"></el-checkbox>
                </div>
                <el-card class="box-card">
                    <video class="video-js" controls='controls' :poster="Global.baseURL" style="width:100%;height:180px;" preload="none">
                        <source :src="value.url"
                                type="video/mp4">
                    </video>
                    <div>{{value.title}}</div>
                    <div>{{value.author}}</div>
                </el-card>
            </div>
        </div>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="data.total">
            </el-pagination>
        </div>

        <el-dialog title="视频上传"
                :visible.sync="uploadLocalFile"
                width="410px"
                center>

            <el-input v-model="up.data.title" placeholder="请输入视频名称"></el-input>
            <br>
            <br>
            <el-input v-model="up.data.introduction" placeholder="请输入视频简介"></el-input>
            <br>
            <br>
            <el-input v-model="up.data.author" placeholder="请输入作者"></el-input>
            <br>
            <br>

            <el-upload
                    class="upload-demo"
                    drag
                    ref="studentUpload"
                    :action="up.url"
                    :data="up.data"
                    name="file"
                    :on-success="upUploadSuccess"
                    :headers="up.headers"
                    :limit="1"
                    :file-list="up.fileList"
                    :auto-upload="false"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-button style="margin-left:40px;" @click="uploadLocal">确定上传</el-button>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "activity-video",
        data(){
            return{
                delFiles:[],
                uploadLocalFile:false,
                up:{
                    url:"/api/video/inputVideo",
                    data:{},
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    },
                    fileList:[]
                },
                editVir:false,
                search:"",
                pageSizes:[9, 50, 100, 200],
                pageSize:9,
                pageNum:1,
                data:{
                }
            }
        },
        components:{
        },
        mounted(){
            var that = this;
            this.getVideo("page=1&size="+that.pageSizes[0]);
        },
        methods:{
            getVideo(url){
                var that = this;
                if(that.search != ''){
                    url = "/video/getVideoByTitle?title="+that.search+"&"+url
                }else{
                    url = "/video/getVideo?"+url;
                }
                this.$axios.post(url,'',{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                })
                    .then(function (res) {
                        that.data = res.data;
                    }).catch(function (error) {
                    that.$message({
                        showClose: true,
                        message: '获取视频信息异常',
                        type: 'warning'
                    });
                });
            },
            searchVideo(){
                this.getVideo("page=1&size="+this.pageSize);
            },
            onPlayerPlay(){

            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getVideo("page="+this.pageNum+"&size="+this.pageSize);
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getVideo("page="+val+"&size="+this.pageSize);
            },
            upUploadSuccess(response, file, fileList){
                if(response.code != 0){
                    this.$message.error("上传失败!错误原因："+response.message);
                }else{
                    this.$message.success("上传成功！")
                    this.getVideo("page=1&size="+this.pageSizes[0]);
                }
            },
            uploadLocal(){
                this.$refs.studentUpload.submit();
            },
            deleteVideo(){
                var that = this;
                this.$axios.jsonPost("/video/deleteVideo",{
                    list:that.delFiles
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res => {
                    if(res.code === 0){
                        that.$message.success("删除成功!")
                        that.delFiles =[];
                        that.editVir=false;
                        that.getVideo("page="+that.pageNum+"&size="+that.pageSizes[0]);
                    }else{
                        that.$message.error("删除失败!");
                    }
                }).catch(err => {
                    that.$message.error("删除失败!");
                })
            },
            checkChange(val){
                var flag = true;
                for (let i = 0; i < this.delFiles.length; i++) {
                    if(val.id == this.delFiles[i].id){
                        this.delFiles.splice(i,1);
                        flag = false;
                    }
                }
                if(flag){
                    this.delFiles.push({id:val.id,path:val.path})
                }
            }
        }
    }
</script>

<style scoped>
    .box-card {
        width: 350px;
        height:270px;
        text-align: center;
        float:left;margin:15px;
    }
    .block{
        clear:both;
        text-align: center;
    }
</style>