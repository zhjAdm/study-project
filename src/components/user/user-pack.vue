<template>
    <div v-if="selectedMenu == 'pack' && $cookies.get('user').role!=4">
        <div style="float: left;margin-left: 20px;width:70%;" >
            <el-card style="font-size:18px;">
                <div slot="header">
                    教学包列表
                </div>
                <div>
                    <div v-if="page.pageTotal == 0">
                        当前没有文件
                    </div>
                    <div v-if="page.pageTotal != 0">
                        <el-card v-for="(file,index) in files" shadow="hover" :key="index" style="float:left;width:650px;margin-left:20px;margin-top: 10px;" class="box-card">
                            <a href="#">
                                {{file.name}}
                            </a>
                            <!--                    <span style="float: right;margin-top:-10px;" v-if="editModel">-->
                            <!--                        <i class="el-icon-error" style="float:left;cursor:pointer;" @click="removeFileOper(files,file,index)"></i>-->
                            <!--                    </span>-->
                            <br>
                            <span style="font-size: 12px;">上传者:{{file.teachername}}</span><br>
                            <span style="font-size: 12px;">创建时间:{{file.semester}}</span>
                            <el-button style="float: right;margin-left: 5px;" @click="getPackContent(file.projectId)" size="mini">预览当前教学包</el-button>

                            <el-button type="danger" style="float: right;margin-left: 5px;" @click="deleteProjectInfo(file.id)" size="mini">删除</el-button>
                            <span style="float: right;" v-if="file.status == 0">
                                <el-link type="success" @click="shareFilePre(1,file)">分享 </el-link>
                            </span>
                            <span style="float: right;" v-if="file.status == 1">
                                <el-link type="success" @click="shareFilePre(0,file)">取消分享 </el-link>
                            </span>
                        </el-card>
                        <br clear="all">
                        <div class="block">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-sizes="page.pageSizes"
                                    :page-size="page.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="page.pageTotal">
                            </el-pagination>
                        </div>

                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "user-pack",
        props:['selectedMenu'],
        data(){
            return{
                page: {
                    pageSizes: [10, 50, 100, 200],
                    pageSize: 10,
                    pageNum: 1,
                    pageTotal: 0,
                },
                files:[]
            }
        },
        methods:{
            init(){
                this.getOper({
                    page: this.page.pageNum,
                    size: this.page.pageSize
                });
            },
            getOper(param){
                var that = this;
                this.$axios.post("/project/getProjectInfoByUsername",param,{
                    headers: {
                        "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.files = res.data.list;
                    that.page.pageTotal = res.data.total
                }).catch(err => {

                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getOper({
                    page: this.page.pageNum,
                    size: this.page.pageSize
                });
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getOper({
                    page: this.page.pageNum,
                    size: this.page.pageSize
                });
            },
            shareFilePre(num,file){
                this.$confirm('确定此操作吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/shareProjectInfo",{
                        status:num,
                        projectInfoId:file.id
                    },{
                        headers: {
                            "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        this.$message.success("分享成功!");
                        this.init();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消分享'
                    });
                });
            },
            //预览教学包
            getPackContent(projectId){
                let routeData = this.$router.resolve({
                    name: `ProjectInfo`,
                    query: {
                        projectId:projectId,
                        isLook:1
                    }
                });
                window.open(routeData.href, '_blank');
            },
            //删除
            deleteProjectInfo(id){
                this.$confirm('确定此操作吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/deleteProjectInfo",{
                        projectInfoId:id
                    },{
                        headers: {
                            "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        this.$message.success("删除成功!");
                        this.init();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .block{
        text-align: center;
        margin-top: 20px;
    }
</style>