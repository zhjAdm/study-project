<template>
    <div>
        <el-row>
            <el-col :span="24">
                <span style="float: right;">
                <el-button type="text" @click="lookScoreResult">评分明细设置</el-button>
            </span>
            </el-col>
        </el-row>
        <el-card v-for="(group,index) in groups" :key="index" style="margin-bottom: 20px;" shadow="never">
            <div >
                <div style="float:left;width: 300px;">
                    {{group.name}}
                    <div>
                        <el-button type="text" style="font-size: 18px;" @click="getTheGroupTotalScore(group)">总分数：{{group.classroomSum}}</el-button>
                    </div>
                </div>
                <div style="float: left;margin-bottom: 15px;">
                    <el-button type="primary" plain

                               v-for="tag in scoreTags"
                               :key="tag.classroomCauseId"
                               @click="scoreOper(group,tag)">{{tag.cause}}</el-button>
                </div>
                <div style="height:20px;">
                </div>
            </div>

        </el-card>

        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="评价记录" name="1">
                <el-table
                        :data="classSummDatas"
                        style="width: 100%">
                    <el-table-column
                            prop="content"
                            label="内容">
                    </el-table-column>
                    <el-table-column
                            prop="time"
                            label="提交时间">
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>

        <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="textarea">
        </el-input>
        <br>
        <span style="float:right;">
            <el-button size="mini" @click="addClassSumm">提交</el-button>
        </span>

        <el-dialog :visible.sync="totalScoreVir">
            <el-table
                    :data="totalScoreData"
                    style="width: 100%">
                <el-table-column
                        prop="cause"
                        label="原因">
                </el-table-column>
                <el-table-column
                        prop="time"
                        label="时间">
                </el-table-column>
                <el-table-column
                        prop="grade"
                        label="分值"
                width="60">
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog :visible.sync="scoreResultVir">
            <el-table
                    :data="scoreTags"
                    style="width: 100%">
                <el-table-column
                        prop="cause"
                        label="名称">
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit==false">{{scope.row.cause}}</span>
                        <span v-if="scope.row.edit==true">
                            <el-input size="mini" v-model="scope.row.cause"></el-input>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="grade"
                        label="分值">
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit==false">{{scope.row.grade}}</span>
                        <span v-if="scope.row.edit==true">
                            <el-input size="mini" v-model="scope.row.grade"></el-input>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="结果">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.edit==true" size="mini" v-model="scope.row.type" placeholder="请选择">
                            <el-option
                                    v-for="item in scoringType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="scope.row.edit==false">
                            <span v-if="scope.row.type==1">正激励</span>
                            <span v-if="scope.row.type==0">负激励</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="right">
                    <template slot="header" slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleAdd(scope.$index, scope.row)">新建</el-button>
                    </template>
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                v-if="scope.row.edit==false"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                v-if="scope.row.edit==true"
                                @click="submitEdit(scope.$index, scope.row)">确定</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "class-score",
        data(){
            return{
                groups:[],
                addFlag:0,
                totalScoreData:[],
                scoreTags: [],
                inputVisible: false,
                inputValue: '',
                totalScoreVir:false,
                activeNames: [],
                scoreResultVir:false,
                scoreResult:[{
                    edit:false,
                    name:"迟到",
                    score:10
                }],
                scoringType:[{label:'正激励',value:1},{label:'负激励',value:0}],
                textarea:"",
                classSummDatas:[]
            }
        },
        methods:{
            init(){
                this.getGroups();
                this.getTags();
            },
            getGroups(){
                this.$axios.post("/project/getGroupByProjectId",{
                    id:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.groups = res.data
                })
            },
            //获取 迟到、缺勤等标签
            getTags(){
                this.$axios.post("/classroom/getClassroomCause",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].edit = false;
                    }
                    this.scoreTags = res.data;
                })
            },
            scoreOper(g,t){
                this.$confirm('确定要执行此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/classroom/addClassroomRecord",{
                        projectId:this.$route.query.projectId,
                        groupId:g.id,
                        causeId:t.classroomCauseId
                    }).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getGroups();
                    })
                }).catch(() => {
                });
            },
            lookScoreResult(){
                this.scoreResultVir = true;
            },
            //获取课堂总结
            handleChange() {
                if(this.activeNames.length != 0){
                    this.$axios.post("/classroom/getClassroomSummaryList",{
                        projectId:this.$route.query.projectId
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.classSummDatas = res.data;
                    })
                }
            },
            handleAdd(){
                this.addFlag = 0;
                this.scoreTags.push({
                    edit:true
                })
            },
            handleEdit(index,row){
                this.addFlag = 1;
                row.edit = true;
            },
            handleDelete(index){
                this.scoreResult.splice(index,1)
            },
            submitEdit(index,row){
                row.edit = false;
                if(this.addFlag == 0){
                    this.$axios.post("/classroom/addClassroomCause",row,{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.$message.success("添加成功!")
                    })
                }else{
                    this.$axios.post("/classroom/reviseClassroomCause",row,{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.$message.success("修改成功!")
                    })
                }
                this.getGroups();
            },
            getTheGroupTotalScore(g){
                this.totalScoreVir = true;
                this.$axios.post("/classroom/getClassroomRecord",{
                    groupId:g.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.totalScoreData = res.data;
                })
            },
            addClassSumm(){
                this.$axios.post("/classroom/addClassroomSummary",{
                    projectId:this.$route.query.projectId,
                    content:this.textarea
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$message.success("添加成功!")
                })
            }
        }
    }
</script>

<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>