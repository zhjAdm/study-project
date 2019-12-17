<!--开篇报告评价表-->
<template>
    <div>
        <el-dialog :visible.sync="show">
            <h2>开篇报告撰写要求</h2>
            <el-form ref="form" :model="formData" inline label-width="120px" size="mini">
                <el-form-item label="团队">
                    <el-input v-model="formData.groupName" disabled></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker
                            v-model="formData.time"
                            type="datetime"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="项目导师">
                    <el-input v-model="formData.teacherName" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-input v-model="formData.projectName" disabled></el-input>
                </el-form-item>
                <el-form-item label="开篇报告题目">
                    <el-input v-model="formData.title" disabled></el-input>
                </el-form-item>
                <br>
                <el-form-item label="评价等级">
                    <el-select v-model="formData.grade" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="评价意见">
                    <el-input type="textarea" style="width: 100%;" v-model="formData.view"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="操作">
                    <el-button type="primary" size="mini" @click="submitReport">提交</el-button>
                    <el-button @click="show=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "first-report-evaluate",
        data(){
            return{
                formData:{},
                show:false,
                group:{},
                options:['A','B','C','D','E'],
                projectInfo:{}
            }
        },
        methods:{
            init(group,tab){
                this.show = true;
                this.group = group;
                this.formData.groupName = group.groupName;
                this.formData.title = tab.name;
                this.formData.firstReportId = tab.tableId;
                this.getProjectLeaderInfo();
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
                    this.formData.projectName = res.data.name
                    this.$forceUpdate();
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
            submitReport(){
                this.$axios.post("/archives/firstReportAppraise",this.formData,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.show = false;
                    this.formData = {};
                    this.$message.success("提交成功!")
                })
            }
        }
    }
</script>

<style scoped>

</style>