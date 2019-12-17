<template>
    <div class="navi-header">
        <div style="margin-left:200px;font-size: 24px;">
            <img src="../assets/images/header/school.png" style="width:150px;">
            <img src="../assets/images/header/logo.png" style="margin-left:30px;width:100px;">
            <div style="float: right;margin-right:400px;">
                <div style="margin-top:10px;float:right;color: #3a8ee6;cursor:pointer;" @click="taskRemind('remind')">
                    <el-badge class="mark" :value="remindNumber" >提醒</el-badge>
                </div>
                <div style="margin-top:10px;float:right;color: #8492a6;cursor: pointer;" @click="taskRemind('record')">动态/</div>
                <el-dropdown @command="myCommand" :hide-on-click="false" style="float:right;margin-right: 5px;">
                    <span class="el-dropdown-link navi-title" >
                      <el-avatar shape="square" :size="50" style="margin-top:5px;" :src="$cookies.get('userimg')"></el-avatar>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userInfo">{{$cookies.get('user').name}}</el-dropdown-item>
                        <el-dropdown-item divided command="/">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div style="background-color:#3a8ee6;margin-top:10px;height:50px;font-size:16px;line-height:50px;width:100%;margin-bottom: 10px;">
            <div class="navi-title" style="margin-left: 320px;" @click="toPage(5)">首页</div>
            <div class="navi-title" v-if="$cookies.get('user').role<4" @click="toPage(1)">项目课程</div>
            <div class="navi-title" v-if="$cookies.get('user').role==4" @click="toPage(1)">项目课程</div>
            <div class="navi-title" v-if="$cookies.get('user').role<4" @click="toPage(4)">数据报告</div>
            <div class="navi-title" v-if="$cookies.get('user').role<3" @click="toPage(2)">系统管理</div>
            <div class="navi-title" @click="toPage('scoring')">项目考核</div>
            <div class="navi-title" @click="myCommand('userInfo')">个人中心</div>
        </div>
        <div :style="bgStyle">
            <router-view></router-view>
        </div>
    </div>

</template>
<script>
    export default {
        name: "header-menu",
        data(){
            return{
                activeIndex:'/5',
                username:"",
                semester:"",
                remindNumber:0,
                bgStyle:{
                    width: "1200px",
                    margin:"0 auto"
                }
            }
        },
        mounted(){
            this.username = this.$cookies.get("user").name
            //console.log(this.$cookies.get("user"))
            this.getSemeTime(this.$cookies.get("user")['X-Auth-Token']);
            this.getTaskRemind();
            this.getNotice();
        },
        methods:{
            getTaskRemind(){
                this.$axios.post("/project/startTask",{
                    page:0,
                    size:1
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if(res.data!=null){
                        this.remindNumber = res.data.total
                    }
                })
            },
            selectHandler(key){
                this.activeIndex = key;
            },
            myCommand(com){
                this.$router.push({
                    path:com
                })
            },
            toPage(index){
                this.$router.push({
                    path:"/"+index
                })
            },
            getSemeTime(token){
                var that = this;
                this.$axios.post("/user/selectSemester",{},{
                    headers:{
                        "X-Auth-Token":token
                    }
                }).then(res => {
                    that.$cookies.set("time",res.data);
                    that.semester = this.$cookies.get("time").semester
                })
            },
            taskRemind(type){
                this.$router.push({
                    name:"UserInfo",
                    query:{
                        id:type
                    }
                })
            },
            getNotice(){
                this.$axios.post("/bulletin/getBulletin",{},{
                    headers: {
                        "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{

                })
            }
        }
    }
</script>

<style scoped>
    .navi-header{
        margin-bottom: 30px;
        height: 40px;
    }
    .avatar{
        float:right;
    }
    .navi-title{
        margin-left: 30px;
        float: left;
        width:100px;
        text-align: center;
        color: #f0f0f0;
        cursor: pointer;
    }
    .navi-title:hover{
        background-color: rgba(99%,99%,99%,0.3);
        color: #3a8ee6;
    }
    .el-dropdown-link {
        cursor: pointer;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>