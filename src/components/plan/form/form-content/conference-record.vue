<template>
    <div>
        <el-dialog title="会议记录表" :visible.sync="show">
            <el-form ref="form" :model="formData" label-width="140px" size="mini">
                <el-form-item label="会议时间">
                    <el-input v-model.number="formData.time"></el-input>
                </el-form-item>
                <el-form-item label="会议次数">
                    <el-input-number v-model.number="formData.number"></el-input-number>次
                </el-form-item>
                <el-form-item label="会议地点">
                    <el-input v-model="formData.place" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item label="参加人员">
                    <el-input type="textarea" v-model="formData.attend"></el-input>
                </el-form-item>
                <el-form-item label="缺席人员及原因">
                    <el-input type="textarea" v-model="formData.absence"></el-input>
                </el-form-item>
                <el-form-item label="会议主题">
                    <el-input type="textarea" v-model="formData.theme"></el-input>
                </el-form-item>
                <el-form-item label="讨论过程及会议主要内容">
                    <el-input type="textarea" v-model="formData.content"></el-input>
                </el-form-item>
                <el-form-item label="会议小结">
                    <el-input type="textarea" v-model="formData.summary"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    {{formData.authorName}}
                </el-form-item>
                <el-form-item size="large" v-if="status!='look' &&$cookies.get('user').role==4">
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "conference-record",
        data(){
            return{
                formData:{time:""},
                show:false,
                myGroup:{},
                stage:{},
                status:"",
                projectInfo:{},
                look:false
            }
        },
        methods:{
            init(stage,data,type){
                this.show = true;
                this.stage = stage;
                this.status = type;
                if(data!=undefined){
                    this.formData = data;
                }else{
                    this.formData={
                        time:""
                    }
                }
                this.getMyGroup();
                this.getProjectLeaderInfo();
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
            getProjectLeaderInfo(){
                var that = this;
                this.$axios.post("/project/getProjectModelByProjectId",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.projectInfo = res.data;
                    if(res.data==null){
                        that.projectInfo = {
                            name:"",
                            number:"",
                            className:"",
                            signIn:0
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            onSubmit(){
                this.formData.projectId = this.myGroup.projectId;
                this.formData.projectStageId = this.stage;
                this.formData.groupId = this.myGroup.id;
                this.formData.projectName = this.projectInfo.name;
                this.formData.className = this.projectInfo.className;

                this.$axios.post("/archives/addMeeting",this.formData,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$message.success("添加成功！")
                    this.show = false;
                    this.$emit('reload')
                })
            }
        }
    }
</script>

<style scoped>

</style>