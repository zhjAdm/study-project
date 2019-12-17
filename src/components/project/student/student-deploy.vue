<template>
    <div>
        <el-card class="box-card" shadow="never" v-if="showStudentListPanel">
            <div slot="header" class="clearfix">
                <span style="color:#8492a6;font-size:14px;width: 60%;">
                    <el-breadcrumb separator=">">
                      <el-breadcrumb-item ><span style="cursor: pointer;" @click="goBackToStudentList">当前位置: 成员</span></el-breadcrumb-item>
                      <el-breadcrumb-item><span style="font-weight:bold;">小组分组详情</span></el-breadcrumb-item>
                    </el-breadcrumb>
                </span>
            </div>
            <div>
                分组方式：<br>
                <el-select @change="getStudentGroup" size="mini" v-model="userType.value">
                    <el-option v-for="(t,i) in userType.option" :label="t.label" :value="t.value"></el-option>
                </el-select>
            </div>
            <br>
            <div v-if="userType.value==1" style="border:1px solid blue;">
                <span v-for="(stp,stpi) in lazyStudent" :key="stp.mbitId">
                    <br>
                    <el-image v-if="stp.mbitImg!=null" style="width: 30px;" :src="stp.mbitImg"></el-image>
                    {{stp.mbitName}}:<br>
                    <span style="margin-left: 20px;" v-for="(stu,index) in stp.groupUsers" :key="stu.username">
                        <el-button size="mini" type="primary" plain>
                            <div style="width: 130px">
                                {{stu.name}}:{{stu.username}}
                            </div>
                        </el-button>
                    </span>
                </span>
            </div>
            <div v-if="userType.value==0" style="border:1px solid blue;">
                <!--        配置未选择成员 -->
                当前未分组成员:<br>
                <span style="margin-left: 20px;" v-for="(stu) in lazyStudent.list" :key="stu.username">
                    <el-link  style="width: 160px ">{{stu.name}}:{{stu.username}}</el-link>
                </span>
                <br>蓝色成员:<br>
                <span style="margin-left: 20px;border:1px solid blue;" v-for="(stu) in lazyStudent.blueList" :key="stu.username">
                    <el-link type="primary" style="width: 160px ">{{stu.name}}:{{stu.username}}</el-link>
                </span>
                <br>绿色成员:<br>
                <span style="margin-left: 20px;border:1px solid green;" v-for="(stu) in lazyStudent.greenList" :key="stu.username">
                    <el-link type="success" style="width: 160px ">{{stu.name}}:{{stu.username}}</el-link>
                </span>
                <br>橙色成员:<br>
                <span style="margin-left: 20px;border:1px solid orange;" v-for="(stu) in lazyStudent.orangeList" :key="stu.username">
                    <el-link type="warning" style="width: 160px ">{{stu.name}}:{{stu.username}}</el-link>
                </span>
                <br>黄色成员:<br>
                <span style="margin-left: 20px;border:1px solid yellow;" v-for="(stu) in lazyStudent.yellowList" :key="stu.username">
                    <el-link style="width: 160px ">{{stu.name}}:{{stu.username}}</el-link>
                </span>
            </div>
            <el-divider></el-divider>
            <div>
                当前项目班级:{{projectInfo.className}}
            </div>
            <div style="float: left;">
                <br>

                小组数量：<el-input-number size="mini" v-model="groupNumber"></el-input-number>
                <br>
                <el-link type="primary" @click="submit4dGroup">自动分组</el-link>
            </div>
            <div style="float: left;margin-left: 100px;">
                手动添加分组及成员：<br>
                <el-link v-if="$cookies.get('user').role < 4" style="padding: 3px 0" @click="addGroup" :underline="false" type="primary">添加小组</el-link>
                <br>
                <el-select v-if="userType.value==1" v-model="tempStudent" multiple placeholder="请选择">
                    <el-option-group v-for="(stp) in lazyStudent" :key="stp.mbitId" :label="stp.mbitName">
                        <el-option
                                v-for="(stu) in stp.userNameVos"
                                :key="stu.username"
                                :label="stu.name+':'+stu.username"
                                :value="stu.username">
                            {{stu.name}}:{{stu.username}}
                        </el-option>
                    </el-option-group>
                </el-select>

                <el-select v-if="userType.value==0" v-model="tempStudent" multiple placeholder="请选择">
                    <el-option-group label="未4d识别">
                        <el-option
                                v-for="item in lazyStudent.list"
                                :key="item.username"
                                :label="item.name+':'+item.username"
                                :value="item.username">
                            {{item.name}}:{{item.username}}
                        </el-option>
                    </el-option-group>
                    <el-option-group label="蓝色">
                        <el-option
                                v-for="item in lazyStudent.blueList"
                                :key="item.username"
                                :label="item.name+':'+item.username"
                                :value="item.username">
                            <span style="border:1px solid blue;">{{item.name}}:{{item.username}}</span>
                        </el-option>
                    </el-option-group>
                    <el-option-group label="绿色">
                        <el-option
                                v-for="item in lazyStudent.greenList"
                                :key="item.username"
                                :label="item.name+':'+item.username"
                                :value="item.username">
                            <span style="border:1px solid green;">{{item.name}}:{{item.username}}</span>
                        </el-option>
                    </el-option-group>
                    <el-option-group label="橙色">
                        <el-option
                                v-for="item in lazyStudent.orangeList"
                                :key="item.username"
                                :label="item.name+':'+item.username"
                                :value="item.username">
                            <span style="border:1px solid orange;">{{item.name}}:{{item.username}}</span>
                        </el-option>
                    </el-option-group>
                    <el-option-group label="黄色">
                        <el-option
                                v-for="item in lazyStudent.yellowList"
                                :key="item.username"
                                :label="item.name+':'+item.username"
                                :value="item.username">
                            <span style="border:1px solid yellow;">{{item.name}}:{{item.username}}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
                <br>
                <br>
                <el-button v-if="addStudentPre==true" @click="addStudentOper" size="mini">确定添加</el-button>
                <span v-if="addStudentPre==true">当前选择小组：{{nowGroup.name}}</span>
            </div>
            <div style="float:left;margin-top:20px;width: 100%;" class="text1 item">
                <div v-for="(group,gIndex) in groups" :key="gIndex">
                    <div style="background-color: #99a9bf;color: #fff;height:35px;line-height: 35px;">
                        <span style="margin-left: 20px;">{{group.name}}</span>
                        <span style="margin-right: 50px;float: right;font-size: 20px;color:#D3DCE6;">
                            <i class="el-icon-edit" @click="editGroupName(group)" style="margin-right: 30px;"/>
                            <i class="el-icon-close" @click="removeGroup(gIndex,group)"/>
                        </span>
                    </div>
                    <div style="margin-top:10px;">
                        <div class="studentTitle" v-for="(member,mIndex) in group.groupUsers" :key="mIndex">
                            <div style="">
                                <el-avatar style="float:left;margin-left: 15px;" :src="member.img"></el-avatar>
                                <br clear="all">
                                <span v-if="member.fourD==-1">{{member.name}}</span>
                                <span v-if="member.fourD==0" style="border:1px solid green;">{{member.name}}</span>
                                <span v-if="member.fourD==10" style="border:1px solid blue;">{{member.name}}</span>
                                <span v-if="member.fourD==1" style="border:1px solid yellow;">{{member.name}}</span>
                                <span v-if="member.fourD==11" style="border:1px solid orange;">{{member.name}}</span>
                                <el-button size="mini" @click="removeStudentFromGroup(group,group.groupUsers,member,mIndex)">删除成员</el-button>
                            </div>
                        </div>
                        <div class="studentTitle">
                            <div>
                                <el-button type="primary" icon="el-icon-plus" @click="addStudentBtn(group)" circle></el-button>
                                <div style="" >
                                    添加成员
                                </div>
                            </div>
                        </div>
                    </div>
                    <br clear="all">
                </div>
            </div>

        </el-card>

    </div>
</template>

<script>
    export default {
        name: "student-deploy",
        data(){
            return{
                userType:{
                    option:[{label:"4D识人",value:"0"},{label:"MBTI",value:"1"}],
                    value:"0"
                },
                tempStudent:[],
                groups:[],
                showStudentListPanel:false,
                nowClass:{name:"无"},
                nowGroup:{},
                searchClass:"",//搜索班级的值
                searchClassArr:[],//搜索班级后结果数据
                addStudentPre:false,//点击添加成员
                showSetPane:false,
                panelStep:0,
                lazyStudent:{},
                allClass:[],
                projectInfo:{},
                groupNumber:0
            }
        },
        methods:{
            init(){
                this.showStudentListPanel = true;
                this.getGroupAndUser();
                this.getProjectInfo();
            },
            getProjectInfo(){
                this.$axios.post("/project/getProjectModelByProjectId",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.projectInfo = res.data;
                    this.loadStudent();
                })
            },
            getGroupAndUser(){
                var that = this;
                this.$axios.post("/project/getGroup",{id:this.$route.query.projectId},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    var groupArr = res.data;
                    this.groups = groupArr;
                }).catch(err => {
                })
            },
            goBackToStudentList(){
                this.showStudentListPanel = false;
                this.$emit("showStudentList")
            },
            removeGroup(index,group){
                var that = this;
                this.$alert('确定要移除此小组吗？', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        that.$axios.post("/project/deleteGroup",{id:group.id},{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }).then(res => {
                            if(res.data.code === 0){
                            }
                            that.groups.splice(index,1);
                            this.init();
                        }).catch(err => {

                        })

                    }
                });
            },
            editGroupName(group){
                var that = this;
                this.$prompt('修改小组名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    that.$axios.post("/project/reviseGroupName",{id:group.id,name:value},{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        if(res.code === 0){
                            group.name = value;
                        }else{
                            this.$message.error("修改失败!")
                        }
                        this.init();
                    }).catch(err => {
                        this.$message.error("修改失败!")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            loadStudent(){
                let that = this;
                window.console.log("分类测试"+this.userType.value);
                if(this.userType.value==1){
                    window.console.log("mbti分支");
                    this.$axios.post("/project/getUserBymbti",{
                        projectId:this.$route.query.projectId,
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        that.lazyStudent = res.data
                    }).catch(err => {
                        //console.log(err)
                        this.$message.error("获取小组学生失败!")
                    })
                }else{
                    window.console.log("FourD分支");
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
                        this.$message.error("获取小组学生失败!")
                    })
                }


            },
            addGroup(){
                this.$axios.post("/project/addGroup",{id:this.$route.query.projectId},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.groups.push(
                        {name:"默认",list:[],id:res.data.id}
                    );
                }).catch(err => {
                    this.$message.error("添加失败!")
                })
            },
            addStudentBtn(g){
                this.addStudentPre=true;
                this.nowGroup = g;
            },
            addStudentOper(){
                for (let i = 0; i < this.lazyStudent.length; i++) {
                    for (let j = 0; j < this.tempStudent.length; j++) {
                        if(this.lazyStudent[i].username == this.tempStudent[j]){
                            this.nowGroup.list.push(this.lazyStudent[i])
                            this.lazyStudent.splice(i,1)
                        }
                    }
                }
                var that = this;
                this.$axios.post("/project/addGroupUser",{
                    id:that.nowGroup.id,
                    projectId:that.$route.query.projectId,
                    list:this.tempStudent.toString()
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    //this.init();
                    this.getGroupAndUser();
                    this.getStudentGroup(this.userType.value);
                    this.tempStudent = [];
                }).catch(err => {

                })
            },
            removeStudentFromGroup(group,members,member,index){
                var that = this;
                this.$alert('确定要移除他吗？', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        that.$axios.post("/project/deleteGroupUser",{
                            id:member.username,
                            projectId:this.$route.query.projectId
                        },{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }).then(res => {
                            if(res.data.code === 0){
                                group.list = members;
                                this.$message.success("删除成功!")
                            }
                            members.splice(index,1);
                            this.getStudentGroup(this.userType.value);
                            //this.getProjectInfo();
                        }).catch(err => {
                            window.console.log("失败"+err);
                            this.$message.error("删除失败!")
                        })

                    }
                });
            },
            submit4dGroup(){
                this.$axios.post("/project/groupByFourD",{
                    projectId:this.$route.query.projectId,
                    size:this.groupNumber,
                    type:this.userType.value
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$message.success("提交成功!");
                    this.init();
                    this.getStudentGroup(this.userType.value)
                })
            },
            getStudentGroup(val){
                if(val==1){
                    this.$axios.post("/project/getUserBymbti",{
                        projectId:this.$route.query.projectId
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.lazyStudent = res.data;
                    })
                }else if(val==0){
                    this.getProjectInfo();
                }
            }
        }
    }
</script>

<style scoped>
.studentTitle{
    width:70px;
    text-align: center;
    float:left;
    margin-left:30px;
    margin-bottom: 15px;
}
</style>