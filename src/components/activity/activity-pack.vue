<template>
<!--  教学包分享页面弃用  -->
    <div>
        <div style="width:100%">
            <el-card v-for="(file,index) in files" shadow="hover" :key="index" style="float:left;width:400px;margin-left:20px;margin-top: 10px;" class="box-card">
                <a href="#">
                    {{file.name}}
                </a>
                <br>
                <span style="font-size: 12px;">上传者:{{file.teachername}}</span><br>
                <span style="font-size: 12px;">创建时间:{{file.semester}}</span>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <el-button size="mini" @click="getPackContent(file.projectId)">预览教学包</el-button>
                &nbsp;
            </el-card>
        </div>
        <br clear="all">
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="page.pageSizes"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "activity-pack",
        data(){
            return{
                page:{
                    pageSizes:[9, 50, 100, 200],
                    pageSize:9,
                    pageNum:1,
                    totalPage:0
                },
                files:[]
            }
        },
        methods:{
            init(){
                this.getOper({
                    page:this.page.pageNum,
                    size:this.page.pageSize
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getOper({
                    page:this.page.pageNum,
                    size:this.page.pageSize
                });
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getOper({
                    page:this.page.pageNum,
                    size:this.page.pageSize
                });
            },
            getOper(param){
                var that =this;
                this.$axios.post("/project/getProjectInfoShare",param,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.page.totalPage = res.data.total
                    that.files = res.data.list;
                })
            },
            getPackContent(projectId){
                let routeData = this.$router.resolve({
                    name: `ProjectInfo`,
                    query: {
                        projectId:projectId,
                        isLook:1
                    }
                });
                window.open(routeData.href, '_blank');
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