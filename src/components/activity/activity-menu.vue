<template>
<!--  已经弃用  -->
    <div>
        <el-tabs v-model="editableTabsValue" @tab-click="handleClick">

            <el-tab-pane label="问卷调查" name="question">
                <activity-question ref="question"></activity-question>
            </el-tab-pane>
            <el-tab-pane label="教学包平台" name="pack">
                <activity-pack ref="pack"></activity-pack>
            </el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>
    import Question from '@/components/activity/activity-question'
    import Pdf from '@/components/activity/activity-pdf'
    import Video from '@/components/activity/activity-video'
    import Pack from '@/components/activity/activity-pack'

    export default {
        name: "project-activity",
        data(){
            return{
                editableTabsValue: '1',
                editableTabs:[{
                    title: '问卷调查',
                    name: '1',
                    content: 'activity-question'
                },{
                    title: '云教材管理',
                    name: '2',
                    content: 'activity-pdf'
                },{
                    title: '教学包管理',
                    name: '3',
                    content: 'activity-pack'
                }],
                tabIndex: 1
            }
        },
        methods:{
            handleClick(v){
                this.$refs[v.name].init();
            }
        },
        components:{
            'activity-pdf':Pdf,
            'activity-question':Question,
            'activity-video':Video,
            'activity-pack':Pack

        }
    }
</script>

<style scoped>

</style>