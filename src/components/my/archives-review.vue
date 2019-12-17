<template>
    <div v-if="selectedMenu=='archives'">
        <div style="float: left;margin-left: 20px;width:70%;" >
            <div style="font-size:18px;">
                档案评论
                <el-divider></el-divider>
            </div>
            <div v-if="reviews.length==0">
                当前暂无评论
            </div>
            <div v-if="reviews.length!=0">
                <el-card v-for="(task,index) in reviews" :key="index">
                    {{task.name}}
                    <div style="color: #909399;font-size: 14px;">
                        您在<a :href="'/toProjectInfo?projectId='+task.projectId">{{task.projectName}}</a>课程中有新的导师评论,请查收!<br>
                        阶段：{{task.projectStageName}}--任务名称：{{task.taskName}}

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
        name: "archives-review",
        props:['selectedMenu'],
        data(){
            return{
                reviews:[],
                page:{
                    pageSizes:[8, 50, 100, 200],
                    pageSize:8,
                    pageNum:1,
                    pageTotal:0
                }
            }
        },
        methods:{
            init(){
                this.getReviews()
            },
            getReviews(){
                this.$axios.post("/project/getOldAssess",{
                    page:this.page.pageNum,
                    size:this.page.pageSize
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{

                    this.reviews = res.data.list
                    this.page.pageTotal = res.data.total
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getReviews()
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getReviews()
            }
        }
    }
</script>

<style scoped>

</style>