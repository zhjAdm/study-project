<template>
    <div v-if="selectedMenu=='record'">
        <el-card style="margin-left: 20px;float:left;width: 70%;">
            <div slot="header">
                <div style="font-size:18px;">
                    操作记录
                </div>
            </div>
            <div>
                <div>
                    <el-table
                            :data="tableData"
                            style="width: 100%;text-align: center;">
                        <el-table-column
                                prop="operation"
                                label="操作"
                                width="300">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="日期"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="username"
                                label="账号"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="姓名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="ip"
                                label="ip">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="pageSizes"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="data.total">
                    </el-pagination>
                </div>
            </div>
        </el-card>
        <div style="float: left;margin-left: 20px;width:70%;" >



        </div>
    </div>
</template>

<script>
    export default {
        name: "oper-review",
        props:['selectedMenu'],
        data(){
            return{
                tableData: [],
                pageSizes:[9, 50, 100, 200],
                pageSize:9,
                pageNum:1,
                data:{}
            }
        },
        methods:{
            init(){
                this.getDataForAxios("page="+this.pageNum+"&size="+this.pageSize);
            },
            getDataForAxios(url){
                var that = this;
                url = "/user/getLog?"+url;
                this.$axios.post(url,{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(function (res) {
                    that.tableData = res.data.list;
                    that.data.total = res.data.total;
                }).catch(function (error) {
                    console.log(error);
                    that.$message({
                        showClose: true,
                        message: '获取信息异常',
                        type: 'warning'
                    });
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getDataForAxios("page="+this.pageNum+"&size="+this.pageSize);
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getDataForAxios("page="+val+"&size="+this.pageSize);
            }
        }
    }
</script>

<style scoped>

</style>