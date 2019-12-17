<template>
    <div>
        <el-tabs type="border-card" v-model="nowTab" @tab-click="tabClick">
            <el-tab-pane label="总览" name="number">
                <report-number ref="number"></report-number>
            </el-tab-pane>
            <el-tab-pane label="进度" name="profess">
                <report-profess ref="profess"></report-profess>
            </el-tab-pane>
            <el-tab-pane label="个人排名" name="single">
                <report-single ref="single"></report-single>
            </el-tab-pane>
            <el-tab-pane label="时间" name="time">
                <report-time ref="time"></report-time>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ReportNumber from "./report-number";
    import ReportProfess from "./report-profess";
    import ReportTime from "./report-time";
    import ReportSingle from "./report-single";
    export default {
        name: "report-index",
        components: {ReportSingle, ReportTime, ReportProfess, ReportNumber},
        data(){
            return{
                nowTab:"number",
                bgStyle:{
                    backgroundImage:'url('+require("../../assets/images/bg/bg-page.png")+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"cover",
                    minHeight:"800px"
                }
            }
        },
        mounted(){
            this.$refs['number'].init();
        },
        methods:{
            init(){
                //this.$refs['number'].init();
            },
            tabClick(tab){
                this.$refs[tab.name].init();
            }
        }
    }
</script>

<style scoped>
body{

}
</style>