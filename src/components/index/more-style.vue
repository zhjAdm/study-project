<template>
    <div >
        <div v-if="show">
            <el-row>
                <el-col :span="24">
                    <el-link @click="goBack2" type="info" style="color:#000;font-size:16px;float:right;margin-right: 20px;">返回</el-link>
                </el-col>
            </el-row>
            <el-row v-for="(style,index) in projectStyles" :key="index">
                <el-col :span="24">
                    <span style="font-size: 14px;">[{{style.author}}][{{style.time}}]</span>
                    <el-link href="#"><span @click="lookThePassage(style)">{{style.name}}</span></el-link>
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
                <el-card class="box-card" style="margin-top:20px;">
                    <div slot="header" class="clearfix">
                        <span>{{nowStyle.name}}</span>
                        <el-button style="float: right; padding: 3px 0" type="text">{{nowStyle.author}}</el-button>
                        <span style="font-size: 14px;">[{{nowStyle.time}}]</span>
                    </div>
                    <div class="text item">
                        <div v-html="nowStyle.content">
                            {{nowStyle.content}}
                        </div>
                    </div>
                </el-card>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "more-style",
        data(){
            return{
                show:false,
                page:{
                    pageSizes:[20, 50, 100, 200],
                    pageSize:20,
                    pageNum:1,
                    pageTotal:0
                },
                projectStyles:[],
                contentshow:false,
                nowStyle:{}
            }
        },
        methods:{
            init(){
                this.show = true;
                this.page.pageNum = 1;
                this.getStudentStyle();
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
                this.getStudentStyle();
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getStudentStyle();
            },
            lookThePassage(val){
                this.show = false;
                this.contentshow = true;
                this.nowStyle=val;
            },
            getStudentStyle(){
                this.$axios.post("/projectStyle/getProjectStyle",{
                    page:this.page.pageNum,
                    size:this.page.pageSize
                },{headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }}).then(res => {
                    this.projectStyles = res.data.list
                    this.page.pageTotal = res.data.total;
                })
            },
        }
    }
</script>

<style scoped>

</style>