<template>
    <div style="font-size: 12px;">
<!--        <el-collapse v-model="activeName" accordion>-->
<!--            <el-collapse-item title="成员配置" name="1">-->
        <el-card style="background-color: rgba(99%,99%,99%,0.9);" shadow="never" v-if="showStudentListPanel">
            <div slot="header" class="clearfix">
                <span style="color:#8492a6;font-size:14px;">当前分组方案</span>

                    <el-link style="float: right; padding: 3px 0" v-if="$cookies.get('user').role<4" :underline="false" @click="toStudentSet" type="primary">小组分组方案</el-link>
<!--                    <el-link  style="margin-right:15px;float: right; padding: 3px 0" :underline="false" type="warning">导出成员信息</el-link>-->
            </div>
            <el-select @change="orderbyFunction" v-model="orderbyresult" placeholder="排序" size="mini">
                <el-option
                        v-for="item in orderbyOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <hr>
            <div style="float:left;width:260px;">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item v-for="(stage,index) in projectGroup" :key="index" :title="stage.name" :name="stage.id"  >
                        <template slot="title">
                            <el-avatar style="float:left;margin-top:10px;margin-left:10px;" :size="34" :src="stage.groupImg"/>
                            <div style="width:170px;float:left;margin-left:20px;margin-top: 5px;">
                                <div style="float:left;;font-size: 14px;">
                                    <div>
                                        {{stage.name}}({{stage.groupUsers.length}}人)
                                        <i class="el-icon-edit" @click="editGroupName(group)" style="margin-left: 20px;"/>
                                    </div>

                                </div>
                            </div>
                        </template>
                        <div v-for="(user,index) in stage.groupUsers" :key="index" style="width:230px;margin-right:1px;"  @click="clickStudentTitlePanel($event,user)">
                            <div style="width:250px;border:1px solid #E1E1E1;height:95px;" class="studentTitlePanel" >
                                <el-avatar style="float:left;margin-top:10px;margin-left:10px;" :size="60" :src="user.img"/>

                                <div v-if="user.fourD==-1" style="float:right;width:10px;height:100%;"></div>
                                <div v-if="user.fourD==10" style="float:right;width:10px;background-color: #409EFF;height:100%;"></div>
                                <div v-if="user.fourD==11" style="float:right;width:10px;background-color: orange;height:100%;"></div>
                                <div v-if="user.fourD==1" style="float:right;width:10px;background-color: yellow;height:100%;"></div>
                                <div v-if="user.fourD==0" style="float:right;width:10px;background-color: green;height:100%;"></div>

                                <div style="float:right;margin-top:15px;">
                                    <el-image style="width:40px;" v-if="user.mbtiImg!=null" :src="user.mbtiImg"/>
                                </div>

                                <div style="width:100px;float:left;margin-left:20px;margin-top: 5px;">
                                    <div style="float:left;;font-size: 18px;">
                                        <div>
                                            {{user.name}}
                                            <span  v-if="user.assistant==1"><i style="font-size: 14px;" class="el-icon-star-on"/></span>
                                        </div>
                                        <div style="font-size: 14px">
                                            得分:{{user.sum}}
                                            <br>
                                            {{user.username}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                    <!--<div v-for="(user,index) in projectUsers" :key="index" style="width:250px;margin-right:1px;"  @click="clickStudentTitlePanel($event,user)">
                    <div style="width:250px;border:1px solid #E1E1E1;height:80px;" class="studentTitlePanel" >
                        <el-avatar style="float:left;margin-top:10px;margin-left:10px;" :size="60" :src="user.img"></el-avatar>

                        <div v-if="user.fourD==-1" style="float:right;width:10px;height:100%;"></div>
                        <div v-if="user.fourD==10" style="float:right;width:10px;background-color: #409EFF;height:100%;"></div>
                        <div v-if="user.fourD==11" style="float:right;width:10px;background-color: orange;height:100%;"></div>
                        <div v-if="user.fourD==1" style="float:right;width:10px;background-color: yellow;height:100%;"></div>
                        <div v-if="user.fourD==0" style="float:right;width:10px;background-color: green;height:100%;"></div>

                        <div style="float:right;margin-top:15px;">
                            <el-image style="width:40px;" v-if="user.mbitImg!=null" :src="user.mbitImg"></el-image>
                        </div>

                        <div style="width:100px;float:left;margin-left:20px;margin-top: 5px;">
                            <div style="float:left;;font-size: 18px;">
                                <div>
                                    {{user.name}}
                                    <span  v-if="user.assistant==1"><i style="font-size: 14px;" class="el-icon-star-on"></i></span>
                                </div>
                                <div style="font-size: 14px">
                                    得分:{{user.sum}}
                                    <br>
                                    {{user.username}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>-->
            </div>
            <div v-if="showStuInfoPanel" style="float:left;border: 1px solid #E1E1E1;width: 860px;height:800px;">
                <el-avatar style="margin-top:30px;margin-left:40px;" :size="60" :src="nowUser.img"></el-avatar>
                <div style="float:right;width:60%;height:120px;margin-right: 225px;margin-top: 20px;font-size:14px;">
                        <span style="">
                            <el-breadcrumb separator="/">
                              <el-breadcrumb-item >姓名：{{nowUser.name}}</el-breadcrumb-item>
                              <el-breadcrumb-item>性别：{{nowUser.sex}}</el-breadcrumb-item>
                              <el-breadcrumb-item>班级：{{nowUser.className}}</el-breadcrumb-item>
                            </el-breadcrumb>
                            <br>
                            <el-breadcrumb separator="/">
                              <el-breadcrumb-item >学号：{{nowUser.username}}</el-breadcrumb-item>
                              <el-breadcrumb-item>手机：{{nowUser.telephone}}</el-breadcrumb-item>
                            </el-breadcrumb><br>
                            角色：<span v-if="setRoleVir==false">{{nowUser.role}}</span>
                            &nbsp;&nbsp;
                            <el-input v-if="setRoleVir==true" size="mini" style="width: 120px;" v-model="nowUser.role"></el-input>
                            &nbsp;&nbsp;&nbsp;
                                <el-checkbox v-if="setRoleVir==true && $cookies.get('user').role<4" v-model="nowUser.teaCheck">设为助教</el-checkbox>
                              <el-link v-if="setRoleVir==false" @click="setRoleVir=true" type="primary" style="color:#3a8ee6;cursor: pointer;">设置角色</el-link>
                            &nbsp;&nbsp;
                              <el-link v-if="setRoleVir==true" @click="setTempTeacher" type="primary" style="color:#3a8ee6;cursor: pointer;">确定</el-link>

                        </span>
                </div>
                <el-divider></el-divider>
                <el-link @click="showEcharts=3,$refs.scoreList.init()" style="margin-right:15px;float: right; padding: 3px 0" :underline="false" type="primary">成绩得分明细</el-link>
                <el-link @click="studentStageScore" style="margin-right:15px;float: right; padding: 3px 0" :underline="false" type="primary">图形化数据展示</el-link>
                <el-link @click="showEcharts=2" style="margin-right:15px;float: right; padding: 3px 0" :underline="false" type="primary">数据表格展示</el-link>
                <div ref="main" v-show="showEcharts==1" style="margin-top:40px;width:950px;height:400px;"></div>
                <score-list ref="scoreList" v-bind:showEcharts="showEcharts"></score-list>
                <div v-show="showEcharts==2">
                    <el-table
                            :data="nowUser.projectStages"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="阶段名称">
                        </el-table-column>
                        <el-table-column
                                prop="number"
                                label="阶段得分">
                        </el-table-column>
                        <el-table-column
                                prop="grade"
                                label="表现得分">
                            <template slot-scope="scope">
                                <span v-if="edit==false">{{scope.row.grade}}</span>
                                <span v-if="edit==true">
                                    <el-input v-model="scope.row.grade"></el-input>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="view"
                                label="评分意见">
                            <template slot-scope="scope">
                                <span v-if="edit==false">{{scope.row.view}}</span>
                                <span v-if="edit==true">
                                    <el-input v-model="scope.row.view"></el-input>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-if="$cookies.get('user').role < 4"
                                fixed="right"
                                label="操作"
                                width="100">
                            <template slot-scope="scope">
                                <el-button v-if="edit==false" type="text" size="small" @click="edit=true">编辑</el-button>
                                <el-button v-if="edit==true" type="text" size="small" @click="enterEdit(scope.row)">确定修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>

        <student-deploy ref="studentSet" v-on:showStudentList="showStudentList"></student-deploy>

    </div>
</template>

<script>
    import StudentDeploy from "./student/student-deploy";
    import ScoreList from "./student/score-list";
    export default {
        name: "project-student",
        components: {ScoreList, StudentDeploy},
        data() {
            return {
                orderbyOption:[
                    {name:"分数从高到低",id:2},
                    {name:"学号从低到高",id:1}
                ],
                orderbyresult:"",
                edit:false,
                setRoleVir:false,
                showEcharts:1,//是否展示数据图形化
                addStudentGroupNum:0,
                addStudentDialog: false,
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                selectStudent:[],
                selectGroup: '',
                activeName: '1',
                lazyStudent:[],
                allClass:[],
                projectUsers:[],
                nowUser:{},
                showStudentListPanel:true,
                showStuInfoPanel:false,
                projectGroup:[],
            };
        },
        methods:{
            init(){
                this.getProjectUser();
            },
            toStudentSet(){
                this.showStudentListPanel = false;
                this.$refs.studentSet.init()
            },
            getProjectUser(){
                this.$axios.post("/project/getGroup",{
                    id:this.$route.query.projectId,
                    //action:num
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    window.console.log(res);
                    window.console.log(res.data);
                    this.projectGroup=res.data;
                    /*window.console.log(this.projectGroup)*/
                }).catch(err => {
                    window.console.log(err)
                })
            },
            addStudentBtn(group,gIndex){
                this.selectGroup = group.id;
                this.addStudentDialog = true;
                this.addStudentGroupNum = gIndex;
                let that = this;
                //获取班级
                this.$axios.post("/user/getProfessionalClass","",{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.allClass = res.data;

                }).catch(err => {
                    window.console.log(err);
                    that.$message.error("获取班级信息失败!")
                })

            },
            enterEdit(row){
                this.$axios.post("/user/teacherStageAppraisal",{
                    id:row.id,
                    view:row.view,
                    grade:row.grade,
                    rateeId:this.nowUser.username
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    window.console.log(err);
                    this.edit=false
                })
            },
            showStudentList(){
                this.showStudentListPanel = true;
                this.getProjectUser();
            },
            loadStudent(){
                //获取学生
                window.console.log(this.Global.baseToken);
                var that = this;
                this.$axios.post("/user/getUserByFourD",{
                    projectId:that.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.lazyStudent = res.data
                }).catch(err => {
                    //console.log(err)
                    window.console.log(err);
                    this.$message.error("获取小组学生失败!")
                })
            },
            setTempTeacher(){
                var num = 0;
                if(this.nowUser.teaCheck==true)num=1;else num=0;
                if(this.$cookies.get('user').role==4)num=undefined;
                this.$axios.post("/user/setAssistant",{
                    projectId:this.$route.query.projectId,
                    username:this.nowUser.username,
                    action:num,
                    role:this.nowUser.role
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if(res.code === 0){
                        this.$message.success("设置成功!")
                        this.setRoleVir = false;
                        this.init();
                    }else{
                        this.$message.error("设置失败!")
                    }
                })
            },
            clickStudentTitlePanel(e,u){
                this.$axios.post("/project/gerUserAppraisal",{
                    projectId:this.$route.query.projectId,
                    username:u.username
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    u.projectStages = res.data.projectStages
                })
                this.showStuInfoPanel = true;
                this.nowUser = u;
                e.target.style.backgroundColor = "#fff";
                var arr = document.getElementsByClassName("studentTitlePanel")
                for (let i = 0; i < arr.length; i++) {
                    arr[i].style.backgroundColor = "#fff";
                    e.target.style.backgroundColor = "#fff";
                }
                e.target.style.backgroundColor = "#E1E1E1";
                if(u.fourD == 0){
                    e.target.style.backgroundColor = "green";
                }else if(u.fourD == 1){
                    e.target.style.backgroundColor = "yellow";
                }else if(u.fourD==10){
                    e.target.style.backgroundColor = "blue";
                }else if(u.fourD==11){
                    e.target.style.backgroundColor = "orange";
                }
                this.showEcharts = 2;
                //this.activeName = u
            },
            studentStageScore(){
                this.showEcharts = 1;
                let myChart = this.$echarts.init(this.$refs.main)
                var stageArr = [];
                var stagetScoreArr = [];
                var showScore = [];
                for (let i = 0; i < this.nowUser.projectStages.length; i++) {
                    stageArr.push(this.nowUser.projectStages[i].name)
                    stagetScoreArr.push(this.nowUser.projectStages[i].number)
                    showScore.push(this.nowUser.projectStages[i].grade)
                }
                let option = {
                    title: { text: '阶段得分情况',subtext: this.nowUser.name },
                    tooltip: {},

                    xAxis: {
                        data: stageArr
                    },
                    yAxis: {},
                    series: [{
                        name: '分数',
                        type: 'line',
                        data: stagetScoreArr
                    },{
                        name: '表现得分',
                        type: 'line',
                        data: showScore
                    }]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
            orderbyFunction(val){
                this.getProjectUser(val)
            }
        }
    }
</script>

<style scoped>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    .studentTitlePanel:hover{
        background-color: #F0F0F0;
        cursor: pointer;
    }

</style>