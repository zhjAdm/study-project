<template>
    <div >
            <div style="float:left;margin-left: 40px;">
                <div style="font-size:20px;width:130px;height:50px;line-height:50px;background: #3a8ee6;color:#f0f0f0;text-align: center;">
                    基本资料
                </div>
                <div style="margin:30px 00px;font-size: 14px">
                    <div>名称：{{projectInfo.name}}</div>
                    <div>要求：{{projectInfo.number}}</div>
                    <div>班级：{{projectInfo.className}}</div>
                </div>

            </div>
            <div style="float:left;margin-left: 150px;">
                <div style="font-size:20px;width:130px;height:50px;line-height:50px;background: #3a8ee6;color:#f0f0f0;text-align: center;">
                    当前进度
                </div>
                <el-steps style="margin-top:20px;" direction="vertical" :active="startStage.length-1" finish-status="success">
                    <el-step v-for="(stage,index) in startStage" :key="index" :title="stage.name"></el-step>
                </el-steps>
            </div>
            <el-button style="float:left;margin-left: 130px;" type="danger" v-if="this.$route.query.end==0 && this.$cookies.get('user').role < 4" @click="endProject" plain>结束项目</el-button>
            <br clear="all">
            <div style="">
                <div style="margin-top: 10px;" v-if="this.$cookies.get('user').role < 4">
                    <div style="margin:0 auto;font-size:40px;line-height:50px;color:#3a8ee6;text-align: center;">
                        操作记录
                    </div>
                    <el-table
                            :data="opers"
                            style="width: 100%;">
                        <el-table-column
                                prop="username"
                                label="学/工号">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="姓名">
                        </el-table-column>
                        <el-table-column
                                prop="operation"
                                label="操作内容">
                        </el-table-column>
                        <el-table-column
                                prop="ip"
                                label="ip">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="操作时间">
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="operPage.pageSizes"
                                :page-size="operPage.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="operPage.pageTotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        name: "project-center",
        data(){
            return{
                projectInfo:{},
                startStage:[],
                operPage:{
                    pageSizes:[10, 50, 100, 200],
                    pageSize:10,
                    pageNum:1,
                    pageTotal:0
                },
                opers:[],
                signImg:""
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                this.getProjectLeaderInfo();
                this.getStartStage();
                this.getOperReview();
            },
            //获取操作记录
            getOperReview(){
                this.$axios.post("/project/getProjectLog",{
                    page:this.operPage.pageNum,
                    size:this.operPage.pageSize,
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.operPage.pageTotal = res.data.total;
                    this.opers = res.data.list;
                }).catch(err=>{
                    console.log(err)
                })
            },
            handleSizeChange(val) {
                this.operPage.pageSize = val;
                this.getOperReview();
            },
            handleCurrentChange(val) {
                this.operPage.pageNum = val;
                this.getOperReview();
            },
            endProject(){
                this.$confirm('此操作将结束该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/endProject",{
                        projectId:this.$route.query.projectId
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.$router.push({
                            name:"ProjectMenu"
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            //项目详情信息
            getProjectLeaderInfo(){
                var that = this;
                this.$axios.post("/project/getProjectModelByProjectId",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.projectInfo = res.data;
                    if(res.data==null){
                        that.projectInfo = {
                            name:"",
                            number:"",
                            className:"",
                            signIn:0
                        }
                    }
                }).catch(err => {
                    console.log(err)

                })
            },
            getStartStage(){
                this.$axios.post("/project/getProjectStage",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.startStage = res.data
                }).catch(err=>{
                    console.log(err)
                })
            },
            startSignin(num){
                this.$axios.post("/signIn/setSignIn",{
                    projectId:this.$route.query.projectId,
                    signIn:num
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$alert('发起成功，请在签到信息中进行查看此次签到!', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                    this.getProjectLeaderInfo();
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
.box-card{
    width: 96%;
    height: 100%;
    margin: 0 auto;
    background-color: rgba(99%,99%,99%,0.7);
}
</style>