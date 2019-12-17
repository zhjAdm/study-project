<template>
<!--  系统公告 更多 页面  -->
    <div >
        <div v-if="show">
            <el-row>
                <el-col :span="24">
                    <el-link @click="goBack2" type="info" style="color:#000;font-size:16px;float:right;margin-right: 20px;">返回</el-link>
                </el-col>
            </el-row>
            <el-row v-for="(o,index) in notices" :key="index">
                <el-col :span="24">
                    <span style="font-size: 14px;">[{{o.objectName}}公告][{{o.time}}]</span>
                    <el-link href="#"><span @click="lookContent(o)">{{o.name}}</span></el-link>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
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
                </el-col>
            </el-row>

        </div>
        <div v-if="contentshow">
            <el-card style="backgroundColor:rgba(99%,99%,99%,0.6)">
                <el-row>
                    <el-col :span="24">
                        <el-link @click="goBack" type="info" style="font-size:16px;float:right;margin-right: 20px;">返回</el-link>
                    </el-col>
                </el-row>
                <el-card>
                    <div slot="header">
                        {{nowNotice.name}}
                    </div>
                    正文：
                    <div v-html="nowNotice.content">
                        <div  style="width:100%;">
                            {{nowNotice.content}}
                        </div>
                    </div>
                </el-card>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index-notice",
        data(){
            return{
                show:false,
                notices:[],
                page:{
                    pageSizes:[20, 50, 100, 200],
                    pageSize:20,
                    pageNum:1,
                    pageTotal:0
                },
                nowNotice:{},
                contentshow:false
            }
        },
        methods:{
            init(){
                this.show = true;
                this.getIndexNotice();
                this.page.pageNum = 1;
            },
            goBack(){
                this.contentshow = false;
                this.show = true;
            },
            goBack2(){
                this.show = false;
                this.$emit("goBack")
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getIndexNotice();
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getIndexNotice();
            },
            getIndexNotice(){
                this.$axios.post("/bulletin/getBulletinList",{
                    page:this.page.pageNum,
                    size:this.page.pageSize
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.notices = res.data.list;
                    this.page.pageTotal = res.data.total;
                })
            },
            lookContent(val){
                //this.noticeContentVir = true;
                this.show = false;
                this.nowNotice = val;
                this.$axios.post("/bulletin/getBulletinContent",{
                    id:val.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    //this.$refs.noticesContent.init(res.data);
                    this.contentshow = true;
                    this.nowNotice = res.data
                    //this.nowNotice.content = res.data.content;
                })
            }
        }
    }
</script>

<style scoped>

</style>