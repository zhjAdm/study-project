<template>
    <div >
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" v-loading="loading" element-loading-text="拼命加载中">
            <el-tab-pane label="添加项目" name="name" :lazy="true" v-if="$cookies.get('user').role < 2">
                <project-name></project-name>
            </el-tab-pane>
            <el-tab-pane label="发布项目" name="release" :lazy="true" v-if="$cookies.get('user').role < 3">
                <project-release></project-release>
            </el-tab-pane>
            <el-tab-pane label="发布项目管理" name="manager" v-if="$cookies.get('user').role < 3">
                <release-project ref="manager"></release-project>
            </el-tab-pane>
            <el-tab-pane label="创建项目" name="create" :lazy="true" v-if="$cookies.get('user').role<4">
                <project-create></project-create>
            </el-tab-pane>
            <el-tab-pane label="进行中项目" name="start" v-if="$cookies.get('user').role!=5">
                <project-list ref="start" ></project-list>
            </el-tab-pane>
            <el-tab-pane label="已完成项目" name="end" v-if="$cookies.get('user').role!=5">
                <project-list ref="end" ></project-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Create from '@/components/project/project-create'
    import List from '@/components/project/project-list'
    import ProjectRelease from "./project-release";
    import ProjectName from "./project-name";
    import ReleaseProject from "@/components/project/release/release-project";

    export default {
        name: "list",

        data() {
            return {
                loading:false,
                activeName: 'start',
                currentDate: new Date(),
                tabPage:{
                    name:'start'
                },
                bgStyle:{
                    backgroundImage:'url('+require("../../assets/images/bg/bg-page.png")+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100%",
                    minHeight:"800px"
                }
            };
        },
        mounted(){

        },
        methods: {
            handleClick(tab) {
                if(tab.name == 'create' || tab.name == 'release'){
                    return;
                }
                this.$refs[tab.name].init(tab.name);
            },
            reload () {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true))
            }
        },
        components:{
            ReleaseProject,
            ProjectRelease,
            ProjectName,
            'project-create':Create,
            'project-list':List
        }
    }
</script>
<style>
</style>