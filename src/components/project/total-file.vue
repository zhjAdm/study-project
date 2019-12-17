<template>
    <div>
        <el-tabs tab-position="top"  style="min-height: 800px;" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="阶段资源" name="stageFile">
                <project-file ref="stageFile"></project-file>
            </el-tab-pane>
            <el-tab-pane label="小组资源" name="groupfile">
                <group-file ref="groupfile"></group-file>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ProjectFile from "./project-file";
    import GroupFile from "./group-file";
    export default {
        name: "total-file",
        components: {GroupFile, ProjectFile},
        data(){
            return{
                activeName:"stageFile"
            }
        },
        methods:{
            init(){
                this.$refs['stageFile'].init();
            },
            handleClick(tab, event){
                this.$refs[tab.name].init();
            }
        }
    }
</script>

<style scoped>

</style>