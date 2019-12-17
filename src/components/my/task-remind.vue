<template>
    <div v-if="selectedMenu=='remind' && $cookies.get('user').role!=4">
        <div style="float: left;margin-left: 40px;width:70%;">
            <div style="font-size:16px;">
                <el-card class="box-card" style="height:40px;line-height: 0px;">
                    任务提醒
                </el-card>
                <el-divider></el-divider>
            </div>
            <div>
                <el-card v-for="(task,index) in tasks" :key="index" style="margin-top:10px;">
                    {{task.name}}
                    <div style="color: #909399;font-size: 14px;">
                        您在<a :href="'/toProjectInfo?projectId='+task.projectId">{{task.projectName}}</a>课程中有新的任务信息,请查收!<br>
                        任务到期时间:{{task.time}}
                    </div>
                </el-card>

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
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "task-remind",
        props:['selectedMenu'],
        data(){
            return{
                page:{
                    pageSizes:[8, 50, 100, 200],
                    pageSize:8,
                    pageNum:1,
                    pageTotal:0
                },
                tasks:[]
            }
        },
        methods:{
            init(){
                this.getTaskRemindInfo();
            },
            getTaskRemindInfo(){
                this.$axios.post("/project/startTask",{
                    page:this.page.pageNum,
                    size:this.page.pageSize
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.tasks = res.data.list
                    this.page.pageTotal = res.data.total
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getTaskRemindInfo()
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getTaskRemindInfo()
            }
        }
    }
</script>

<style scoped>

</style>