<template>
    <div>
        <div v-if="$cookies.get('user').role!=4">

            <div>
                <el-table
                        :data="gradeResult"
                        style="width: 100%"
                        border
                        size="mini"
                        :header-cell-style="{background:'#f5f7fa;',textAlign:'center'}"
                        :row-class-name="tableRowClassName">

                    <el-table-column label="项目团队成员项目工作互评表比例设置">
                        <el-table-column
                                label="1、准时到课,准时参加项目团队活动,不迟到、不早退、不无故缺勤（若有，写明次数）"
                                width="140">
                            <template slot-scope="scope">
                                <el-input v-model.number="gradeResult[0].standard1" size="mini" >
                                    <i slot="suffix">%</i>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="standard2"
                                label="2、正确认识和履行在项目团队中的角色任务">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model.number="gradeResult[0].standard2"><i slot="suffix">%</i></el-input>
                                </template>
                        </el-table-column>
                        <el-table-column
                                prop="standard3"
                                label="3、自觉遵守《开篇报告》、《行动计划书》等项目团队文件的约定，遵守团队纪律。">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model.number="gradeResult[0].standard3"><i slot="suffix">%</i></el-input>
                                </template>
                        </el-table-column>
                        <el-table-column
                                prop="standard4"
                                label="4、有团队合作意识，积极参与团队项目工作。能经常提出建设性意见和建议，主动承担小组工作任务，努力推进小组工作进程。"
                                width="150">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model.number="gradeResult[0].standard4"><i slot="suffix">%</i></el-input>
                                </template>
                        </el-table-column>
                        <el-table-column
                                prop="standard5"
                                label="5、尊重其他团队成员。用恰当方式解决团队矛盾或合作问题。">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model.number="gradeResult[0].standard5"><i slot="suffix">%</i></el-input>
                                </template>
                        </el-table-column>
                        <el-table-column
                                prop="standard6"
                                label="6、能根据团队成员、导师和企业反馈意见改进或推进项目工作。">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model.number="gradeResult[0].standard6"><i slot="suffix">%</i></el-input>
                                </template>
                        </el-table-column>
                        <el-table-column
                                prop="standard7"
                                label="7、能正确分析、制订个人能力发展目标和计划，个人能力提升比较明显。">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model.number="gradeResult[0].standard7"><i slot="suffix">%</i></el-input>
                                </template>
                        </el-table-column>
                        <el-table-column
                                prop="standard8"
                                label="8、用正确方式与团队成员、导师以及其他人沟通、交流有效果。">
                                <template slot-scope="scope">
                                    <el-input size="mini" v-model.number="gradeResult[0].standard8"><i slot="suffix">%</i></el-input>
                                </template>
                        </el-table-column>
                        <el-table-column
                                prop="grade"
                                label="总评成绩">
                                <template slot="header" slot-scope="scope">
                                    <el-button @click="saveGradeResult()" size="mini">保存比例</el-button>
                                </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-if="$cookies.get('user').role==4">
            <div>
                <div style="font-size: 14px;">
                    1、成绩请按此规则登入，优秀=A、良好=B、中=C、及=D、不及=E<br>
                    2、总评成绩根据项目导师所设置比例进行计算
                </div>
                <el-table
                        :data="tableData"
                        style="width: 100%"
                        border
                        size="mini"
                        :header-cell-style="{background:'#f5f7fa;',textAlign:'center'}"
                        :row-class-name="tableRowClassName">
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
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard1}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard1" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>

                        </el-table-column>
                        <el-table-column
                                prop="standard2"
                                label="2、正确认识和履行在项目团队中的角色任务">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard2}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard2" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                prop="standard3"
                                label="3、自觉遵守《开篇报告》、《行动计划书》等项目团队文件的约定，遵守团队纪律。">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard3}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard3" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                prop="standard4"
                                label="4、有团队合作意识，积极参与团队项目工作。能经常提出建设性意见和建议，主动承担小组工作任务，努力推进小组工作进程。"
                                width="150">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard4}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard4" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                prop="standard5"
                                label="5、尊重其他团队成员。用恰当方式解决团队矛盾或合作问题。">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard5}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard5" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                prop="standard6"
                                label="6、能根据团队成员、导师和企业反馈意见改进或推进项目工作。">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard6}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard6" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                prop="standard7"
                                label="7、能正确分析、制订个人能力发展目标和计划，个人能力提升比较明显。">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard7}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard7" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                prop="standard8"
                                label="8、用正确方式与团队成员、导师以及其他人沟通、交流有效果。">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    {{gradeResult[0].standard8}}%
                                </template>
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.standard8" filterable placeholder="请选择">
                                        <el-option
                                                v-for="item in scoreLevelList"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                label="总评成绩">
                            <el-table-column>
                                <template slot="header" slot-scope="scope">
                                    <el-button @click="saveScore()" size="mini">保存得分</el-button>
                                </template>
                                <template slot-scope="scope">
                                    {{scope.row.grade}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column
                                label="评价或建议">
                            <template slot-scope="scope">
                                <el-input size="mini" v-model.number="scope.row.view"></el-input>
                            </template>
                        </el-table-column>
                    </el-table-column>

                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "group-score",
        data(){
            return{
                tableData:[],
                show:false,
                gradeResult:[{}],
                scoreLevelList:['A','B','C','D','E']
            }
        },
        methods:{
            init(){
                this.getGrade();
                this.getGroupScore();
            },
            getGrade(){
                this.$axios.post("/gradeResult/getProjectGroupAppraisalScale",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.gradeResult = [];
                    if(res.data != null){
                        this.gradeResult.push(res.data)
                    }else{
                        this.gradeResult.push({})
                    }
                })
            },
            getGroupScore(){
                this.$axios.post("/gradeResult/getProjectGroupAppraisal",{
                    projectId:this.$route.query.projectId,
                    username:this.$cookies.get('user').username
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    if(res.code != 0){
                        this.show = false;
                    }else{
                        this.show = true;
                        this.tableData = res.data;
                    }
                })
            },
            saveGradeResult(){
                var x = 0
                for (let i = 1; i < 9; i++) {
                    x+=this.gradeResult[0]['standard'+i];
                }
                if(x!=100){
                    this.$message.error("比例设置总和应为100%")
                    return;
                }
                this.gradeResult[0].projectId=this.$route.query.projectId;
                this.$axios.post("/gradeResult/setProjectGroupAppraisalScale",this.gradeResult[0],{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    });
                })
            },
            saveScore(){
                for (let i = 0; i < this.tableData.length; i++) {
                    for (let j = 1; j < 9; j++) {
                        if(this.tableData[i]['standard'+j]<0 || this.tableData[i]['standard'+j]>5){
                            this.$message.error("打分范围为0-5")
                            return;
                        }
                    }
                }
                this.$axios.jsonPost("/gradeResult/reviseProjectGroupAppraisal",{
                    projectId:this.$route.query.projectId,
                    list:this.tableData
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res=>{
                    this.$message.success("保存成功!")
                    this.getGroupScore()
                })
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex % 2 === 0) {
                    return 'warning-row';
                } else if (rowIndex %2 != 0) {
                    return 'success-row';
                }
                return '';
            }
        }
    }
</script>

<style scoped>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>