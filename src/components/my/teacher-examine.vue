<template>
    <div v-if="selectedMenu == 'worksExamine' && $cookies.get('user').role!=4 ">
        <div style="float: left;margin-left: 20px;width:70%;" v-if="show" >
            <div style="font-size:18px;">
                学生作品审核
                <el-divider></el-divider>
            </div>
            <div >
                <el-tabs type="border-card" v-model="nowWorkTab" @tab-click="getStudentWorks">
                    <el-tab-pane label="等待审核" name="0">
                        <el-card v-for="(work,index) in works" :key="index" shadow="hover" style="float:left;width:96%;margin-left:20px;margin-top: 10px;" class="box-card">
                            <div style="float: left;">
                                <el-image
                                        style="width: 60px; height: 60px"
                                        :src="work.img"
                                        fit="contain"></el-image>
                            </div>
                            <div style="float: left;">
                                <span >{{work.name}}</span>
                                <el-breadcrumb style="margin-top:10px;" separator="/">
                                    <el-breadcrumb-item>{{work.author}}</el-breadcrumb-item>
                                    <el-breadcrumb-item>发布于{{work.time}}</el-breadcrumb-item>
                                    <el-breadcrumb-item>{{work.projectName}}</el-breadcrumb-item>
                                </el-breadcrumb>
                            </div>
                            <div style="float:left;margin-top:25px;margin-left:160px;">
                                <el-button size="mini" @click="agreePassage(work.id,0)" >通过</el-button>
                                <el-button size="mini" @click="agreePassage(work.id,1)" type="danger">拒绝</el-button>
                            </div>
                        </el-card>

                    </el-tab-pane>
                    <el-tab-pane label="历史审核" name="1">
                        <el-card v-for="(work,index) in works" :key="index" shadow="hover" style="float:left;width:96%;margin-left:20px;margin-top: 10px;" class="box-card">
                            <div style="float: left;">
                                <el-image
                                        style="width: 60px; height: 60px"
                                        :src="work.img"
                                        fit="contain"></el-image>
                            </div>
                            <div style="float: left;">
                                <span @click="lookThePassage(work)">{{work.name}}</span>
                                <el-breadcrumb style="margin-top:10px;" separator="/">
                                    <el-breadcrumb-item>{{work.author}}</el-breadcrumb-item>
                                    <el-breadcrumb-item>发布于{{work.time}}</el-breadcrumb-item>
                                    <el-breadcrumb-item>{{work.projectName}}</el-breadcrumb-item>
                                </el-breadcrumb>
                            </div>
                            <div style="float:left;margin-top:25px;margin-left:160px;">
                                <el-button v-if="work.agree==0" size="mini" disabled>通过</el-button>
                                <el-button v-if="work.agree==1" size="mini" type="danger" disabled>拒绝</el-button>
                            </div>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>


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

        <teach-content ref="teachContent" v-on:goBack="goBack"></teach-content>
    </div>
</template>

<script>
    import TeachContent from "../index/teach/teach-content";
    export default {
        name: "teacher-examine",
        props:['selectedMenu'],
        components:{
            TeachContent
        },
        data(){
            return{
                works:[],
                show:true,
                nowWorkTab:"0",
                page: {
                    pageSizes: [10, 50, 100, 200],
                    pageSize: 10,
                    pageNum: 1,
                    pageTotal: 0,
                }
            }
        },
        methods:{
            init(){
                this.getStudentWorks();
            },
            getStudentWorks(){
                this.$axios.post("/projectStyle/projectStyleConfirm",{
                    status:this.nowWorkTab,
                    page:this.page.pageNum,
                    size:this.page.pageSize
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.works = res.data.list;
                    this.page.pageTotal = res.data.total
                })
            },
            agreePassage(id,agree){
                this.$axios.post("/projectStyle/projectStyleOk",{
                    id:id,
                    agree:agree
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.getStudentWorks()
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getStudentWorks()
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getStudentWorks()
            },
            lookThePassage(val){
                this.show = false;
                this.$refs.teachContent.init(val);
            },
            goBack(){
                this.show = true;
            }
        }
    }
</script>

<style scoped>

</style>