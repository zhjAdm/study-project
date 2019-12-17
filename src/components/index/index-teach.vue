<template>
    <div >
        <more-style ref="moreStyle" v-on:goBack="goBack"></more-style>
        <index-notice ref="moreNotice" v-on:goBack="goBack"></index-notice>
        <div v-if="show" >
            <el-row>
                <el-col :span="24">

                </el-col>
            </el-row>
            <el-row>
                <el-col :span="14">
                    <div style="height:400px;">
                        <div style="width: 80%;margin: 0px auto;">
                            <br>
                            <span>学生风采</span>
                            <span style="float: right;cursor: pointer;" @click="getAllStyle">More>></span>
                            <hr>
                        </div>
                        <div>
                            <div @click="lookThePassage(style)" v-for="(style,index) in projectStyles" :key="index" style="float:left;cursor:pointer;margin-left:15px;width: 90%;">
                                <el-card  class="box-card" style="">
                                    <div slot="header" class="clearfix">
                                        <span>{{style.name}}</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">{{style.author}}</el-button>
                                    </div>
                                    <div class="text item" style="font-size: 14px;">
                                        <el-image style="width:100px; height:100px" :src="style.img"></el-image>
                                        &nbsp;&nbsp;[{{style.time}}]&nbsp;&nbsp;阅览数:{{style.number}}
                                    </div>
                                </el-card>

                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div >
                        <div style="width: 80%;margin: 0px auto;">
                            <br>
                            <span>通知公告</span>
                            <span style="float: right;cursor: pointer;" @click="moreNotice">More>></span>
                        </div>
                    </div>
                    <hr>
                    <el-card class="box-card">
                        <div v-for="(o,index) in notices" :key="index" class="text item">
                            <span style="font-size: 14px;">[{{o.objectName}}公告][{{o.time}}]</span>
                            <el-link href="#"><span @click="lookContent(o)">{{o.name}}</span></el-link>
                            <hr>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

        </div>

        <teach-content ref="teachContent" v-on:goBack="goBack"></teach-content>
        <notice-content ref="noticeContent" v-on:goBack="goBack"></notice-content>

        <el-dialog :title="nowNotice.name"
                :visible.sync="noticeContentVir"
                width="40%"
                center>

            <div v-html="nowNotice.content">
                <div  style="width:100%;">
                    {{nowNotice.content}}
                </div>
            </div>

        </el-dialog>

    </div>
</template>

<script>

    import TeachContent from './teach/teach-content'
    import NoticeContent from "./notice/notice-content";
    import MoreStyle from "./more-style";
    import IndexNotice from "./notice/index-notice";

    export default {
        name: "index-teach",
        data(){
          return{
              noticeContentVir:false,
              nowNotice:{},
              activeIndex2: '1',
              show:true,
              projectStyles:[],
              notices:[],
              bgStyle:{
                  backgroundImage:'url('+require("../../assets/images/bg/bg-page.png")+')',
                  backgroundRepeat:'no-repeat',
                  backgroundSize:"100%",
                  height:"1000px"
              }
          }
        },
        components:{
            IndexNotice,
            MoreStyle,
            NoticeContent,
            TeachContent
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.getStudentStyle();
                this.getIndexNotice();
            },
            moreNotice(){
                this.$refs.moreNotice.init();
                this.show = false;
            },
            getAllStyle(){
                this.$refs.moreStyle.init();
                this.show = false;
            },
            goBack(){
                this.show = true;
            },
            getStudentStyle(){
                this.$axios.post("/projectStyle/getProjectStyle",{
                    page:1,
                    size:10
                },{headers:{
                    "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                }}).then(res => {
                    this.projectStyles = res.data.list
                })
            },
            lookThePassage(val){
                this.show = false;
                this.$refs.teachContent.init(val);
            },
            getIndexNotice(){
                this.$axios.post("/bulletin/getBulletinList",{
                    page:1,
                    size:15
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.notices = res.data.list
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
                    this.$refs.noticeContent.init(res.data);
                    //this.nowNotice.content = res.data.content;
                })
            }
        }
    }
</script>

<style scoped>
    .header{
        margin:0 auto;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
    }
    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>