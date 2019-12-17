<template>
    <div v-if="selectedMenu=='score'">
        <div style="float: left;margin-left: 20px;width:70%;" >
            <div style="font-size:18px;">
                项目成绩
                <el-divider></el-divider>
            </div>
            <div>
                <el-table
                        :data="scores"
                        style="width: 100%"
                        :default-sort = "{prop: 'date', order: 'descending'}"
                >
                    <el-table-column
                            prop="semester"
                            label="学期"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="课程名称"
                            sortable
                            width="280">
                    </el-table-column>
                    <el-table-column
                            prop="grade"
                            label="当前成绩">
                    </el-table-column>
                </el-table>
            </div>
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
</template>

<script>
    export default {
        name: "my-score",
        props:['selectedMenu'],
        data(){
            return{
                page:{
                    pageSizes:[8, 50, 100, 200],
                    pageSize:8,
                    pageNum:1,
                    pageTotal:0
                },
                scores:[]

            }
        },
        methods:{
            init(){
                this.getScores();
            },
            getScores(){
                this.$axios.post("/project/getProjectGrade",{
                    page:this.page.pageNum,
                    size:this.page.pageSize
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.scores = res.data.list;
                    this.page.pageTotal = res.data.total;
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getScores()
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getScores()
            }
        }
    }
</script>

<style scoped>

</style>