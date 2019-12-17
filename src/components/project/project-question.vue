<template>
    <div >
        <question-q4d ref="q4d" v-on:goBack="goBack"></question-q4d>
        <question-mbti ref="mbti" v-on:goBack="goBack"></question-mbti>
        <div v-if="show">
            <div style="width:100%;height:100%;margin-bottom: 15px;padding-left: 16px;" v-if="$route.query.end==0 &&$cookies.get('user').role!=4 && $route.query.isLook == undefined">
                <el-button slot="trigger" plain type="primary" @click="teacherShare()">导入问卷</el-button>
                <el-button type="success" plain @click="editFun($event)">编辑模式</el-button>
            </div>
            <div>
                <el-card style="margin:10px;width:45%;float:left;">
                    <div style="float:left;">
                        <i class="el-icon-s-data" style="font-size:32px;"></i>
                        <span >
                            <el-button type="text" style="font-size: 18px;" @click="show=false,$refs['q4d'].init()">4D问卷</el-button>
                        </span>
                        <div style="font-size: 14px;">
                            创建人：导师
                            <br>
                            <br>
                        </div>
                    </div>
                    <div style="float:right;">
                        <div class="funBtn" v-if="$route.query.isLook == undefined">
                            <el-link type="warning" @click="show=false,$refs['q4d'].init()">填写问卷</el-link>
                        </div>
                    </div>
                </el-card>
                <el-card style="margin:10px;width:45%;float:left;">
                    <div style="float:left;">
                        <i class="el-icon-s-data" style="font-size:32px;"></i>
                        <span >
                            <el-button type="text" style="font-size: 18px;" @click="show=false,$refs['mbti'].init()">MBTI问卷</el-button>
                        </span>
                        <div style="font-size: 14px;">
                            创建人：导师
                            <br>
                            <br>
                        </div>
                    </div>
                    <div style="float:right;">
                        <div class="funBtn" v-if="$route.query.isLook == undefined">
                            <el-link type="warning" @click="show=false,$refs['mbti'].init()">填写问卷</el-link>
                        </div>
                    </div>
                </el-card>
            </div>
            <div v-for="(ques,index) in quesList" :key="index" style="margin:10px;width:45%;float: left;">
                <el-card class="box-card">
                    <div style="float:left;">
                        <i class="el-icon-s-data" style="font-size:32px;"></i>
                        <span style="font-size: 18px;">
                            <el-button type="text" style="font-size: 18px;">{{ques.name}}</el-button>
                        </span>
                        <div style="font-size: 14px;">
                            创建时间:{{ques.time}} | 创建人:{{ques.teacher}}
                        </div>
                    </div>
                    <div style="float:right;">
                        <span style="float: right;margin-top:-10px;" v-if="editModel">
                                <i class="el-icon-error" style="float:left;cursor:pointer;" @click="removeQuestion(quesList,ques,index)"></i>
                            </span>
                        <div class="funBtn" v-if="$route.query.isLook == undefined">
<!--                            <el-link type="success" @click="quesDetail(ques)" v-if="$cookies.get('user').role!=4">投票详情</el-link>-->
                            <el-link type="success" @click="exportResult(ques.queId)" v-if="$cookies.get('user').role!=4">统计结果</el-link>
                        </div>
                        <div class="funBtn" v-if="$route.query.isLook == undefined">
                            <el-link type="warning" @click="answer(ques.queId,ques.name)">填写问卷</el-link>
                        </div>
                    </div>
                    <br clear="all">
                </el-card>
            </div>

            <div class="block" style="margin-top:20px;margin-left: 230px;display: none;">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                </el-pagination>
            </div>

            <el-dialog title="文件分享"
                    :visible.sync="shareMyFile"
                    width="680px"
                    center>

                <div style="text-align: center">
                    <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="teaUp.shareFile"
                            filterable
                            :titles="['我的问卷', '已选择']"
                            :button-texts="['删除已选择', '选择问卷']"
                            :props="teaUp.props"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                              }"
                            :data="teaUp.data">
                    </el-transfer>
                    <el-button type="primary" @click="shareFileFun">确定分享</el-button>
                </div>

            </el-dialog>

            <el-dialog title="投票详情"
                    :visible.sync="quesDetailVar"
                    width="30%">

                <el-button size="mini" v-if="$cookies.get('user').role < 4" @click="exportResult">导出问卷结果</el-button>

                <div v-if="JSON.stringify(quesDetailData) == '{}'">
                    当前问卷没有投票信息
                </div>

                <div v-for="(v,index) in quesDetailData.list" :key="index">
                    <h3>第{{index+1}}题:{{v.topic}}</h3>
                    <div v-if="v.answerList==undefined">
                        <div v-for="(op,oin) in v.option" :key="oin">
                            选项:{{op.optionContent}} ---- 次数：{{op.number}}
                            <div>
                                选择此选项用户:
                                <div style="" v-for="(u,ui) in op.users" :key="ui">
                                    {{u.username}}:{{u.name}}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div v-else>
                        <div v-for="(ans,ind) in v.answerList" :key="ind">
                            回答{{ind+1}}：{{ans}}
                            <br>
                        </div>
                    </div>

                    <br>
                </div>


            </el-dialog>
            <br clear="all">
        </div>
        <div >
            <activity-answer ref="answer" v-on:goBack="goBack"></activity-answer>
        </div>


    </div>
</template>

<script>
    import QuestionQ4d from '@/components/plan/form/question/question-n4d'
    import ActivityAnswer from "../activity/activity-answer";
    import QuestionMbti from "../plan/form/question/question-mbti";
    export default {
        name: "project-question",
        components: {QuestionMbti, ActivityAnswer,'question-q4d':QuestionQ4d},
        data() {
            return {
                show:true,
                quesDetailVar:false,
                editModel:false,
                quesList:[],
                shareMyFile: false,
                page:{
                    pageSizes:[8, 50, 100, 200],
                    pageSize:8,
                    pageNum:1,
                    data:{},
                    total:0
                },
                nowQues:{},
                teaUp:{
                    data:[],
                    shareFile:[],
                    props:{
                        key:"queId",
                        label:"name"
                    }
                },
                quesDetailData:{}
            };
        },
        methods:{
            init(){
                this.getQues();
            },
            cl(v){
                console.log(v)
            },
            teacherShare(){
                this.shareMyFile=true;
                var that = this;
                this.$axios.post("/questionnaire/getQuestionnaireList",{page:1, size:10000},{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.teaUp.data = res.data.list;
                })
            },
            editFun(event){
                if(this.editModel == false) {
                    this.editModel = true;
                    event.srcElement.innerText = "取消编辑";
                }
                else {
                    this.editModel = false;
                    event.srcElement.innerText = "管理问卷";
                }
            },

            getQues(){
                var that = this;
                this.$axios.post("/project/getProjectQuestionnaire",{
                    page:that.page.pageNum,
                    size:that.page.pageSize,
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.quesList = res.data;
                    that.page.total = res.data.total;
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getQues();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getQues();
            },
            exportResult(queId){
                window.open("/api/file/QuestionnaireResult?projectId="+this.$route.query.projectId+"&queId="+queId, '_blank');
            },
            shareFileFun(){
                //分享文件
                var that = this;
                this.$axios.post("/project/inputQuestionnaire",{
                    questionnaireIds:that.teaUp.shareFile.toString(),
                    projectId:that.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.shareMyFile = false;
                    that.teaUp.shareFile = [];
                    if(res.code != 0){
                        this.$message.error("分享失败!"+res.message)
                        return;
                    }
                    this.$message.success("分享成功");
                    that.getQues();
                }).catch(err => {
                    this.$message.error("分享失败!")
                })
            },
            removeQuestion(quesList,ques,index){
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$axios.post("/project/deleteProjectQuestionnaire",{
                        queId:ques.queId,
                        projectId:this.$route.query.projectId
                    },{
                        headers:{
                            "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        quesList.splice(index,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(err => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            answer(queId,name){
                this.show = false;
                this.$refs.answer.init(queId,name,this.$route.query.projectId);
            },
            goBack(){
                this.show = true;
            },
            quesDetail(ques){
                var that = this;
                this.nowQues = ques;
                this.$axios.post("/user/getQuestionnaireResult",{
                    projectId:this.$route.query.projectId,
                    queId:ques.queId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.quesDetailData = res.data;
                    that.quesDetailVar = true;
                }).catch(err => {

                })
            }
        }
    }
</script>

<style scoped>

</style>