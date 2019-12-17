<template>
    <el-dialog :visible.sync="show">
        <h2>开篇报告</h2>
        <el-form ref="form" :model="formData" label-width="100px" size="mini">
            <el-form-item label="文件题目">
                <el-input v-model="formData.title" placeholder="XXX项目开篇报告"></el-input>
            </el-form-item>
            <el-form-item label="项目任务">
                <el-input type="textarea" v-model="formData.projectTask" placeholder="项目团队使用自己的语言简要描述项目任务，即项目任务是什么，项目任务给出的背景"></el-input>
            </el-form-item>
            <el-form-item label="项目组织">
                <el-input type="textarea" v-model="formData.projectOrganization" autosize placeholder="项目团队需在文件中说明以下内容:
(1)专业、班级、项目团队编号。
(2)项目团队所有成员姓名、电话号码、电子邮件地址。
(3)成员角色分工及理由。
(4)项目导师、专业导师姓名及联系方式。"></el-input>
            </el-form-item>
            <el-form-item label="团队公约">
                <el-input type="textarea" v-model="formData.teamConvention" autosize placeholder="项目团队制订各自的团队公共合约，以规范团队合作，保证小组以有效合作的方式完成项目任务。团队合约需包含以下内容:
(1)建立合理的沟通及反馈制度，确保项目团队与企业、导师，以及小组成员间信息交流通
(2)如何使项目团队工作尽可能讲究效率
(3)如何促使每位小组成员尽可能贡献相等;
(4)项目团队成员对其他成员特殊情况下的考勤情况是否接受(如缺勤、迟到等);
(5)项目团队如何处理不同意见;
(6)奖惩措施
(7)其他。"></el-input>
            </el-form-item>
            <el-form-item label="小组会议">
                <el-input type="textarea" v-model="formData.groupMeeting" autosize placeholder="(1)以时间表的方式注明项目团队每周会议的开始时间、结東时间、会议地点等
(2)说明项目团队会议组织的以下内容:日程准备的时间和方式，日程表怎样发到项目组所有成员手中，会议记录应该涵盖哪些要点，会议之后会议记录完成的时间，会议记录如何传送到项目成员手中，会议记录中不准确的地方如何更正，如何保证会议的有效性等。"></el-input>
            </el-form-item>
            <el-form-item label="项目档案">
                <el-input type="textarea" v-model="formData.projectArchives" autosize placeholder="(1)区分项目文件类别(过程性与成果);
(2)不同的项目文件如何归档、如何管理:(比如，如何利用公共郎箱或书面文件夹进行的档案管理。)"></el-input>
            </el-form-item>
            <el-form-item label="个人学习目标">
                <el-input type="textarea" v-model="formData.personalGoals" autosize placeholder="在开篇报告中详细分析说明项目团队每位成员本项目周期的个人学习目标(专业能力、社会能力)
(例如 SMART分析)"></el-input>
            </el-form-item>
            <el-form-item label="作者" >
                {{formData.authorName}}
            </el-form-item>
            <el-form-item size="large" v-if="status!='look' &&$cookies.get('user').role==4">
                <el-button type="primary" @click="submitReport">提交</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "first-report",
        data(){
            return{
                show:false,
                myGroup:{},
                stage:{},
                status:"new",
                formData:{}
            }
        },
        methods:{
            init(stage,data,type){
                this.show = true;
                this.getMyGroup();
                this.stage= stage;
                this.status = type;
                if(data!=undefined){
                    this.formData = data;
                }
            },
            getMyGroup(){
                this.$axios.post('/project/getGroupByUsername',{
                    projectId :this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.myGroup = res.data;
                })
            },
            submitReport(){
                this.formData.projectId = this.$route.query.projectId;
                this.formData.groupId = this.myGroup.id
                this.formData.projectStageId = this.stage
                this.$delete(this.formData,'time')
                this.$axios.post("/archives/addFirstReport",this.formData,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.show = false;
                    this.$message.success("添加成功!")
                })
            }
        }
    }
</script>

<style scoped>

</style>