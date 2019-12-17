<template>
    <div>
        <el-card>
            <el-tabs tab-position="left" v-model="nowActiveName" @tab-click="tabChange" style="min-height:800px;">
                <el-tab-pane label="我的评审任务" name="all">
                    <scoring-task ref="all"></scoring-task>
                </el-tab-pane>
                <el-tab-pane v-if="$cookies.get('user').role<3" label="本学期考核" name="now">
                    <release-manager ref="now"></release-manager>
                </el-tab-pane>
                <el-tab-pane v-if="$cookies.get('user').role<3" label="历史考核汇总" name="history">
                    <scoring-history ref="history"></scoring-history>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import ReleaseManager from "./release-manager";
    import ScoringTask from "./scoring-task";
    import ScoringHistory from "./scoring-history";
    import ScoringResult from "./scoring-result";
    export default {
        name: "index",
        components: {ScoringResult, ScoringHistory, ScoringTask, ReleaseManager},
        data(){
            return{
                nowActiveName:"all"
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.$refs['all'].init();
            },
            tabChange(tab){
                this.$refs[tab.name].init();
            }
        }
    }
</script>

<style scoped>

</style>