<template>
    <div >
        <el-card shadow="never">
            <div slot="header">
                <h2>评分结果</h2>
            </div>
            <div>
                <el-table
                        @expand-change="getResultContent"
                        :data="results"
                        style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form v-for="(pu,puin) in props.row.list" :key="pu.username" label-position="left" class="demo-table-expand">
                                <el-form-item label="评审人">
                                    {{pu.name}}
                                </el-form-item>
                                <el-table
                                        :data="pu.standardContents"
                                        border
                                        style="width: 80%;margin: 0 auto;">
                                    <el-table-column
                                            prop="content"
                                            label="评分点">
                                    </el-table-column>
                                    <el-table-column
                                            prop="grade"
                                            label="分数"
                                            width="160">
                                        <template slot-scope="scope">
                                            <el-input-number size="mini" v-model="scope.row.grade"></el-input-number>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="name"
                            label="小组名">
                    </el-table-column>
                    <el-table-column
                            prop="className"
                            label="班级名称">
                    </el-table-column>
                    <el-table-column
                            prop="replyResult"
                            label="总分">
                    </el-table-column>
                    <el-table-column
                            align="right"
                    width="140">
                        <template slot="header" slot-scope="scope">
                            <el-button size="mini" @click="submitScore">提交并保存评分</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "scoring-result",
        data(){
            return{
                replyId:0,
                results:[]
            }
        },
        mounted(){
            this.replyId = this.$route.query.replyId;
            this.init();
        },
        methods:{
            init(){
                this.$axios.post("/gradeResult/getAllReplyResult",{
                    replyId:this.replyId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.results = res.data;
                })
            },
            getResultContent(row, column, event){
                this.$axios.post("/gradeResult/getReplyResultByGroup",{
                    replyId:this.replyId,
                    groupId:row.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    //this.$set(row,'content','')
                    row.list = res.data;
                })
            },
            submitScore(){
                var tempArr = []
                for (let i = 0; i < this.results.length; i++) {
                    if(this.results[i].list != null){
                        for (let j = 0; j < this.results[i].list.length; j++) {
                            tempArr.push(this.results[i].list[j])
                        }
                    }
                }
                this.$axios.jsonPost("/gradeResult/saveReplyResult",{
                    replyId:this.replyId,
                    list:tempArr
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res=>{
                    this.$message.success("提交成功!")
                })
            }
        }
    }
</script>

<style scoped>

</style>