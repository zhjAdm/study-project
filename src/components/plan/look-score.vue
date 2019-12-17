<template>
    <div>
        <div style="margin-top: 20px;" v-for="(u,index) in nowScoreList" :key="index">
            <el-card >
                <div slot="header" class="clearfix">
                    <span>被评价人:{{u.name}}</span>

                </div>
                <div style="float:left;border-right:1px solid #3a8ee6;margin:10px 10px;width:150px;" v-for="(ap,apin) in u.appraisals" :key="apin">
                    评价人：{{ap.name}}
                    <hr>
                    <div style="font-size: 13px;">
                        评价分数：{{ap.grade}}<br>
                        评价意见：{{ap.view}}
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "look-score",
        props:{
            groups:Array
        },
        data(){
            return{
                show:true,
                task:{},
                singleScoreVir:false,
                nowScoreList:[],
                taskId:"",
                groupId:"",
                projectId:''
            }
        },
        mounted(){
            this.taskId = this.$route.query.taskId;
            this.groupId = this.$route.query.groupId;
            this.projectId = this.$route.query.projectId;
            var s = this.$route.query.type;
            if(s == 'group'){
                this.getGroupScore()
            }else if(s === 'user'){
                this.getUserScore();
            }
        },
        methods:{
            init(v,u,s){
                this.show = true;
                this.task = v;
                if(s == 'group'){
                    this.getGroupScore()
                }else if(s === 'user'){
                    this.getUserScore(u);
                }
            },
            getUserScore(){

                this.singleScoreVir = true;
                this.$axios.post("/user/getUserAppraisal",{
                    groupId:this.groupId,
                    taskId:this.taskId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.nowScoreList = res.data
                })
            },
            getGroupScore(){
                this.singleScoreVir = true;
                this.$axios.post("/user/getGroupAppraisal",{
                    projectId:this.projectId,
                    taskId:this.taskId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.nowScoreList = res.data
                })
            }
        }
    }
</script>

<style scoped>
    .studentTitle{
        width:95px;
        float:left;
        margin-left:30px;
        margin-bottom: 15px;
        text-align: center;
        overflow: scroll;
    }
</style>