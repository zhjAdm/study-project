<template>
    <div>
        <el-card v-for="(group,gin) in weeks" :key="gin" style="margin-bottom: 10px;" shadow="never">
            <div slot="header">
                {{gin}}
                <div v-if="$cookies.get('user').role==4">
                    <el-button size="mini" @click="NewReport(0)">新建开篇报告</el-button>
                    <el-button size="mini" @click="NewReport(1)">新建会议记录</el-button>
                </div>
            </div>
            <div>
                <el-card v-for="(tab,name) in group" :key="name" shadow="hover" style="marin-bottom:20px;">
                    {{name}}
                    <el-card v-for="(tab,tabin) in tab" :key="tabin" shadow="hover" style="marin-bottom:20px;">

                        <el-link type="primary" @click="getContent(tab,'look')">{{tab.title}}</el-link>
                        <br>
                        <span style="font-size: 14px;">{{tab.time}}</span>
                        <span style="font-size: 14px;margin-left: 10px" v-if="$cookies.get('user').role<4 && tab.type==0">
                        <el-button size="mini" @click="$refs['firstReportEvaluate'].init(group,tab)">开篇报告评价</el-button>
                    </span>
                        <span style="font-size: 14px;margin-left: 10px" v-if="$cookies.get('user').role==4">
                        <el-button size="mini" @click="getContent(tab,'edit')">编辑修改</el-button>
                    </span>
                    </el-card>
                </el-card>
            </div>
        </el-card>
        <conference-record ref="1" v-on:reload="reload"/>
        <first-report ref="0" v-on:reload="reload"/>
        <first-report-evaluate ref="firstReportEvaluate"/>
    </div>
</template>

<script>
    import ConferenceRecord from "./form/form-content/conference-record";
    import FirstReport from "./form/form-content/first-report";
    import FirstReportEvaluate from "./form/form-content/first-report-evaluate";
    export default {
        name: "form-list",
        components: {FirstReportEvaluate, FirstReport, ConferenceRecord},
        props:['stageId'],
        data(){
            return{
                weeks:[]
            }
        },
        methods:{
            init(){
                this.getArchivesList();
            },
            getArchivesList(){
                this.$axios.post("/archives/getArchivesList",{
                    projectId:this.$route.query.projectId,
                    //projectStageId:this.stageId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    window.console.log(res.data);
                    this.weeks = res.data;
                })
            },
            NewReport(name){
                this.$refs[name].init(this.stageId,undefined,'new');
            },
            reload(){
                this.getArchivesList();
            },
            getContent(tab,type){
                this.$axios.post("/archives/getArchivesContent",{
                    tableId:tab.tableId,
                    type:tab.type
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$refs[tab.type].init(this.stage,res.data,type)
                })
            }
        }
    }
</script>

<style scoped>

</style>