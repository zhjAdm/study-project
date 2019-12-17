<template>
<!--    最终评分页面    -->
    <div>
        <div style="width:100%;margin-top: 0px;">
            <div style="font-size: 16px;">
                <div style="text-align: center;">{{projectInfo.className}}《{{projectInfo.projectName}}》成绩</div>
                <hr>
                <div style="font-size: 14px;">
                    说明：A:优秀:100-90分;95
                    B良好: 80-89分;  85
                    C中等: 70-79分;  75
                    D及格: 60-69分;   65
                    E不及格: 60分以下;55
                    <br>
                </div>
                <hr>
                班级：{{projectInfo.className}} 人数：{{peopleNum}}
                <span style="float: right;">
                    <el-button size="mini" @click="submitScore">保存评分</el-button>
                    <el-button size="mini" @click="exportExcel">导出评分Excel</el-button>
                </span>
                <hr>
            </div>
            <el-table
                    :data="score.list" size="mini"
                    style="width: 100%;text-align: center;">
                <el-table-column
                        prop="username"
                        label="学号"
                        width="110">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="70">
                </el-table-column>
                <el-table-column :label="'项目过程考核'+(this.score.teacherScale+this.score.projectCourseScale+this.score.groupScale+this.score.userLectureScale)+'%'">
                    <el-table-column width="140">
                        <template slot="header" slot-scope="scope">
                            导师监控
                            <el-input v-model.number="score.teacherScale" size="mini" width="70px">
                                <i slot="suffix">%</i>
                            </el-input>
                        </template>
                        <template slot-scope="scope">
                            <el-input-number size="mini" :min="0" :max="100" v-model="scope.row.teacher"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="140">
                        <template slot="header" slot-scope="scope">
                            <span>
                                项目档案
                                <el-input v-model.number="score.projectCourseScale" size="mini" width="70px">
                                <i slot="suffix">%</i>
                            </el-input>
                            </span>
                        </template>
                        <template slot-scope="scope">
                            <el-input-number size="mini" :min="0" :max="100" v-model="scope.row.projectCourse"></el-input-number>
                        </template>
                    </el-table-column>

                    <el-table-column
                            width="100">
                        <template slot="header" slot-scope="scope">
                            小组互评
                            <el-input v-model.number="score.groupScale" size="mini" width="100%">
                                <i slot="suffix">%</i>
                            </el-input>
                        </template>
                        <template slot-scope="scope">
                            <el-tooltip class="item" content="点击查看评分详情" placement="top-start">
                                <el-button size="mini" @click="getScoreDetail(scope.row)" type="success" style="width: 100%;">{{scope.row.group}}</el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="个人学习报告"
                            width="140">
                        <template slot="header" slot-scope="scope">
                            <span>
                                个人学习报告
                                <el-input v-model.number="score.userLectureScale" size="mini" width="70px">
                                    <i slot="suffix">%</i>
                                </el-input>
                            </span>
                        </template>
                        <template slot-scope="scope">
                            <el-input-number size="mini" :min="0" :max="100" v-model="scope.row.userLecture"></el-input-number>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column :label="'项目结果考核（'+(this.score.projectShowScale+this.score.projectLectureScale)+'%）'">
                    <el-table-column
                            width="100">
                        <template slot="header" slot-scope="scope">
                            <span>
                                项目展示考核
                                <el-input v-model.number="score.projectShowScale" size="mini" width="70px">
                                    <i slot="suffix">%</i>
                                </el-input>
                            </span>
                        </template>
                        <template slot-scope="scope">
<!--                            <el-input-number size="mini" :min="0" :max="100" v-model="scope.row.projectShow"></el-input-number>-->
                            <span style="width: 100%;text-align: center;">{{scope.row.projectShow}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="140">
                        <template slot="header" slot-scope="scope">
                        <span>
                                项目报告
                            <el-input v-model.number="score.projectLectureScale" size="mini" width="100px">
                                <i slot="suffix">%</i>
                            </el-input>
                        </span>
                        </template>
                        <template slot-scope="scope">
                            <el-input-number size="mini" :min="0" :max="100" v-model="scope.row.projectLecture"></el-input-number>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column width="140">
                    <template slot="header" slot-scope="scope">
                        <span>
                            项目课程综合考核
                            <el-input v-model.number="score.projectClassScale" size="mini" width="100px">
                                <i slot="suffix">%</i>
                            </el-input>
                        </span>
                    </template>
                    <template slot-scope="scope">
                        <el-input-number size="mini" :min="0" :max="100" v-model="scope.row.projectClass"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column
                        :formatter="formatNumber"
                        prop="sum"
                        label="等级分"
                        width="80">
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="项目团队成员项目工作互评表" :visible.sync="scoreDetailVir">
            <el-table
                    :data="scoreDetail"
                    style="width:800px"
                    border
                    :header-cell-style="{background:'#f5f7fa;',textAlign:'center'}">

                <el-table-column label="项目团队成员项目工作互评表">
                    <el-table-column
                            prop="name"
                            label="组员姓名"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            label="1、准时到课,准时参加项目团队活动,不迟到、不早退、不无故缺勤（若有，写明次数）"
                            width="140">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard1}}
                            </template>
                        </el-table-column>

                    </el-table-column>
                    <el-table-column
                            prop="standard2"
                            label="2、正确认识和履行在项目团队中的角色任务">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard2}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="standard3"
                            label="3、自觉遵守《开篇报告》、《行动计划书》等项目团队文件的约定，遵守团队纪律。">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard3}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="standard4"
                            label="4、有团队合作意识，积极参与团队项目工作。能经常提出建设性意见和建议，主动承担小组工作任务，努力推进小组工作进程。"
                            width="150">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard4}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="standard5"
                            label="5、尊重其他团队成员。用恰当方式解决团队矛盾或合作问题。">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard5}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="standard6"
                            label="6、能根据团队成员、导师和企业反馈意见改进或推进项目工作。">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard6}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="standard7"
                            label="7、能正确分析、制订个人能力发展目标和计划，个人能力提升比较明显。">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard7}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            prop="standard8"
                            label="8、用正确方式与团队成员、导师以及其他人沟通、交流有效果。">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.standard8}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            label="总评成绩">
                        <el-table-column>
                            <template slot-scope="scope">
                                {{scope.row.grade}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                            label="评价或建议">
                        <template slot-scope="scope">
                            {{scope.row.view}}
                        </template>
                    </el-table-column>
                </el-table-column>

            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "project-final",
        data(){
            return {
                titleData:[],
                peopleNum:0,
                scoreDetail:[],
                scoreDetailVir:false,
                score:{},
                projectInfo:{},
                projectScale:0,
                projectResult:0
            }
        },
        methods:{
            init(){
                this.getProjectInfo();
                this.getProjectUser();
            },
            getProjectUser(){
                this.$axios.post("/gradeResult/getGradeResult",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.score = res.data;
                    this.peopleNum = res.data.list.length
                }).catch(err => {

                })
            },
            formatNumber(row,col,val,index){
                val = parseFloat(val)
                return val.toFixed(2)
            },
            getProjectInfo(){
                this.calcResult()
                this.$axios.post("/project/getProjectModelByProjectId",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.projectInfo = res.data;
                }).catch(err => {

                })
            },
            exportExcel(){
                window.open("/api/file/outputGradeResult?projectId="+this.$route.query.projectId, '_blank');
            },
            calcResult(){
                this.projectResult = this.projectShowScale+this.score.projectLectureScale
                this.projectScale = this.score.teacherScale+this.score.projectCourseScale+this.score.groupScale+this.score.userLectureScale
            },
            submitScore(){
                if(this.score.projectClassScale+this.score.teacherScale+this.score.projectCourseScale+this.score.groupScale+this.score.userLectureScale+this.score.projectShowScale+this.score.projectLectureScale != 100){
                    this.$message.error("比例设置错误!比例相加应为100%")
                    return;
                }

                this.score.projectId = this.$route.query.projectId

                this.$axios.jsonPost("/gradeResult/reviseGradeResult",this.score,{
                    headers:{
                        "content-type":"application/json",
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.score = res.data;
                    this.$message.success("修改成功!")
                })
            },
            getScoreDetail(u){
                this.$axios.post("/gradeResult/projectGroupAppraisalResult",{
                    projectId:this.$route.query.projectId,
                    username:u.username
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.scoreDetailVir = true;
                    this.scoreDetail = res.data;
                })
            }
        }
    }
</script>

<style scoped>

</style>