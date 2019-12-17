<template>
    <div>
        <el-table
                @expand-change="rowClick"
                :data="tableData"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table
                            :data="props.row.content"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="小组名称">
                        </el-table-column>
                        <el-table-column
                                prop="className"
                                label="班级名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="testPlanEdit(scope.$index, scope.row)">评价</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
                    label="考核名称"
                    prop="name">
            </el-table-column>
            <el-table-column
                    label="考核时间"
                    prop="name">
            </el-table-column>
            <el-table-column
                    label="考核地点"
                    prop="room">
            </el-table-column>
        </el-table>
        <el-dialog title="考核小组评分" :visible.sync="editTestPlanVir">
            <el-table
                    :data="scoringData"
                    style="width: 100%">
                <el-table-column
                        prop="content"
                        label="评分点">
                </el-table-column>
                <el-table-column
                        prop="scale"
                        label="评分比例">
                    <template slot-scope="scope">
                        {{scope.row.scale}}%
                    </template>
                </el-table-column>
                <el-table-column
                        prop="grade"
                        label="打分">
                    <template slot-scope="scope">
                        <el-input-number size="mini" v-model="scope.row.grade"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column
                        align="right">
                    <template slot="header">
                        <el-button size="mini" @click="submitScore">提交评分</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "scoring-task",
        data(){
            return {
                tableData: [],
                scoringData:[],
                editTestPlanVir:false
            }
        },
        methods:{
            init(){
                this.getReplyTask();
            },
            getReplyTask(){
                this.$axios.post("/gradeResult/getReplyTask",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.tableData = res.data;
                })
            },
            rowClick(row){
                this.$axios.post("/gradeResult/getReplyProjectGroup",{
                    replyGroupId:row.replyGroupId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    row.content = res.data
                })
            },
            testPlanEdit(index,row){
                this.editTestPlanVir = true;
                this.$axios.post("/gradeResult/getReplyResult",{
                    groupId:row.id,
                    standardId:row.standardId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    for (let i = 0; i < res.data.standardContents.length; i++) {
                        res.data.standardContents[i].groupId = row.id;
                    }
                    this.scoringData = res.data.standardContents;
                })
            },
            submitScore(){

                this.$axios.jsonPost("/gradeResult/reviseReplyResult",{"standardContents":this.scoringData},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res=>{
                    this.$message.success("提交成功!")
                    this.editTestPlanVir = false;
                })
            }
        }
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>