<template>
<!--  pdf展示页面 弃用   -->
    <div>
        <div>
            <div style="margin-top: 15px;width:700px;margin:40px auto;">
                <div style="float:left;">
                    <el-button type="primary" plain @click="editVir=true" v-if="editVir==false">编辑模式</el-button>
                        <el-button type="primary" plain @click="editVir=false" v-else-if="editVir==true">取消编辑</el-button>
                        <el-button type="danger" plain @click="deletePdf" v-if="editVir==true">删除</el-button>
                    <el-button type="primary" plain @click="uploadLocalFile=true"  >上传教材</el-button>
                </div>
                <div style="float:left;margin-left: 50px;">
                    <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchPdf"></el-button>
                    </el-input>
                </div>
                <br clear="all">
            </div>
            <div style="width:100%">
                <div v-for="(pdf,index) in data" :key="index">
                    <div style="float:left;">
                        <el-checkbox v-if="editVir" @change="checkChange(pdf)"></el-checkbox>
                    </div>
                    <a :href="pdf.url"  target="_blank">
                        <el-card class="box-card">
                            <img :src="Global.baseURL" width="100%">
                            <div>{{pdf.title}}</div>
                            <div>{{pdf.author}}</div>
                        </el-card>
                    </a>
                </div>
            </div>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="PDF上传"
                :visible.sync="uploadLocalFile"
                width="410px"
                center>

            <el-input v-model="up.data.title" placeholder="请输入PDF名称"></el-input>
            <br>
            <br>
            <el-input v-model="up.data.introduction" placeholder="请输入PDF简介"></el-input>
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
        name: "activity-pdf",
        data(){
            return{
                delFiles:[],
                uploadLocalFile:false,
                editVir:false,
                search:"",
                up:{
                    url:"/api/book/inputBook",
                    data:{},
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    },
                    fileList:[]
                },
                page:{
                    pageSizes:[9, 50, 100, 200],
                    pageSize:9,
                    pageNum:1,
                    total:0
                },
                data:[]
            }
        },
        mounted(){
            this.getPdf("page=1&size="+this.page.pageSize);
        },
        methods:{
            init(){
                this.getPdf("page=1&size="+this.page.pageSize);
            },
            getPdf(url){
                var that = this;
                if(this.search != ''){
                    url = "/book/getBookByTitle?"+"title="+this.search+"&"+url
                }else{
                    url = "/book/getBook?"+url
                }
                this.$axios.post(url,'',{
                }).then(function (res) {
                    that.page.total = res.data.total;
                    that.data = res.data.list
                }).catch(function (error) {
                    that.$message({
                        showClose: true,
                        message: '获取Pdf信息异常',
                        type: 'warning'
                    });
                });
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getPdf("page="+this.page.pageNum+"&size="+this.page.pageSize);
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getPdf("page="+val+"&size="+this.page.pageSize);
            },
            searchPdf(){
                this.getPdf("page=1&size="+this.page.pageSize);
            },
            upUploadSuccess(response, file, fileList){
                if(response.code != 0){
                    this.$message.error("上传失败!错误原因："+response.message);
                }else{
                    this.$message.success("上传成功！")
                    this.getPdf("page=1&size="+this.page.pageSizes[0]);
                }
            },
            uploadLocal(){
                this.$refs.studentUpload.submit();
            },
            deletePdf(){
                var that = this;
                this.$axios.jsonPost("/book/deleteBook",{
                    list:that.delFiles
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res => {
                    if(res.code === 0){
                        that.$message.success("删除成功!")
                        that.getPdf("page="+that.page.pageNum+"&size="+that.page.pageSizes[0]);
                        that.delFiles =[];
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
        height:260px;
        text-align: center;
        float:left;margin:15px;
    }
    .block{
        clear:both;
        text-align: center;
    }
</style>