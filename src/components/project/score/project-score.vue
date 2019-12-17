<template>
    <div>
        <el-tabs tab-position="top" v-model="activeName" @tab-click="handleClick" style="min-height:800px;">
            <el-tab-pane label="总览" name="score" v-if="$cookies.get('user').role<4">
                <project-final ref="score"></project-final>
            </el-tab-pane>
            <el-tab-pane label="组内评分" name="groupscore">
                <group-score ref="groupscore"></group-score>
            </el-tab-pane>
            <el-tab-pane label="课堂评分" v-if="$cookies.get('user').role<4" name="classScore">
                <class-score ref="classScore"></class-score>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ProjectFinal from "../project-final";
    import GroupScore from "../group-score";
    import ClassScore from "./class-score";
    export default {
        name: "project-score",
        components: {ClassScore, GroupScore, ProjectFinal},
        data(){
            return{
                activeName:"score"
            }
        },
        methods:{
            init(){
                this.$refs['score'].init();
            },
            handleClick(tab, event){
                this.$refs[tab.name].init();
            }
        }
    }
</script>

<style scoped>

</style>