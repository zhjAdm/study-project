<template>
    <div v-if="selectedMenu == 'info'">
        <el-card style="float: left;margin-left: 20px;width:70%;">
            <div slot="header" style="font-size:18px;">
                个人资料
            </div>
            <div style="margin-left: 10px;font-size: 14px;">
                <el-card shadow="never">
                    <div style="font-size: 18px">
                        |基本资料
                    </div>
                    <div style="margin-top:20px;">
                        <!-- 头像 -->
                        <div style="float:left;margin-left: 0px;" @click="setUserAvatarPre">
                            <el-avatar shape="circle" :size="80" :src="$cookies.get('user').img"></el-avatar>
                        </div>
                        <div style="float:left;margin-top: 10px;font-size: 18px;">
                            <span style="margin-left: 20px;">
                                {{$cookies.get('user').name}}
                                <br>
                            </span>
                            <span style="margin-left:30px;font-size:14px;">{{$cookies.get('user').username}}</span>
                        </div>
                        <br clear="all">
                        <span style="color:#d3d4d6">-------------------------------------------------------</span>
                        <div>
                            <el-button type="primary" @click="changePwdPre" size="small" plain>修改密码</el-button>
                            <el-button type="primary" v-if="edit==false" @click="changeInfoPre" size="small" plain>修改资料</el-button>
                            <el-button type="primary" v-if="edit" @click="changeInfo" size="small" plain>确定</el-button>
                        </div>
                    </div>

                </el-card>

                <el-card shadow="never" style="margin-top: 20px;">
                    <div style="font-size: 18px">
                        |其它资料
                    </div>
                    <div style="margin-top:0px;">

                        <br clear="all">
                        <div style="margin-top: 10px;">
                            <span style="">
                                姓名
                            </span>
                            <span style="margin-left: 20px;">
                                {{user.name}}
                            </span>
                        </div>
                        <div style="margin-top: 20px;">
                            <span style="">
                                性别
                            </span>
                                <span style="margin-left: 20px;">
                                {{user.sex}}
                            </span>
                        </div>
                        <div style="margin-top: 10px;" v-if="this.$cookies.get('user').role==4">
                            <span style="">
                                班级
                            </span>
                            <span style="margin-left: 20px;">
                                {{user.className}}
                            </span>
                        </div>
                        <div style="margin-top: 20px;">
                            <span style="">
                                &nbsp;QQ
                            </span>
                            <span style="margin-left: 20px;">
                                <el-input size="mini" style="width: 200px;"  v-if="edit" v-model="user.qq"></el-input>
                                <span v-else>{{user.qq}}</span>
                            </span>
                        </div>
                        <div style="margin-top: 20px;">
                            <span style="">
                                电话
                            </span>
                            <span style="margin-left: 20px;">
                                <el-input size="mini" style="width: 200px;"  v-if="edit" v-model="user.telephone"></el-input>
                                <span v-else>{{user.telephone}}</span>
                            </span>
                        </div>
                        <div style="margin-top: 20px;">
                            <span style="">
                                微信
                            </span>
                            <span style="margin-left: 20px;">
                                <el-input size="mini" style="width: 200px;"  v-if="edit" v-model="user.wx"></el-input>
                                <span v-else>{{user.wx}}</span>
                            </span>
                        </div>
                        <div style="margin-top: 20px;">
                            <span style="">
                                邮箱
                            </span>
                            <span style="margin-left: 20px;">
                                <el-input size="mini" style="width: 200px;"  v-if="edit" v-model="user.email"></el-input>
                                <span v-else>{{user.email}}</span>
                            </span>
                        </div>
                    </div>

                </el-card>
            </div>
        </el-card>

        <el-dialog title="修改密码"
                :visible.sync="changePwdVir"
                width="410px"
                center>
            <br>

            <el-input type="password" v-model="newPwd.oldPwd" placeholder="请输入旧密码">
                <template slot="prepend">旧密码</template>
            </el-input>
            <br><br>
            <el-input type="password" v-model="newPwd.newPwd" placeholder="请输入新密码">
                <template slot="prepend">新密码</template>
            </el-input>
            <br><br>
            <el-input type="password" v-model="newPwd.enterPwd" placeholder="请确认新密码">
                <template slot="prepend">确认</template>
            </el-input><br><br><el-button @click="modifyPwd">修改</el-button>

        </el-dialog>

        <el-dialog title="修改头像"
                :visible.sync="changeAvatarVir"
                width="310px"
                center>
            <br>

            <el-upload
                    action="/api/user/reviseUserImg"
                    list-type="picture-card"
                    :limit="1"
                    name="file"
                    :headers="header"
                    :on-preview="handlePictureCardPreview"
                    :on-success="upAvatarSuccess"
                    :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "my-info",
        props:['selectedMenu'],
        data(){
            return{
                edit:false,
                dialogImageUrl: '',
                dialogVisible: false,
                changeAvatarVir:false,
                changePwdVir:false,
                header:{
                    "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                },
                user:{},
                newPwd:{}
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                this.$axios.post("/user/select",{
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(data => {
                    this.user = data.data
                }).catch(err => {

                })
            },
            changePwdPre(){
                this.changePwdVir = true;
            },
            modifyPwd(){
                if(this.newPwd.enterPwd != this.newPwd.newPwd){
                    this.$message.error("两次新密码不一致!")
                    return;
                }
                this.$axios.post("/user/PwdChange",this.newPwd,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if(res.code != 0){
                        this.$message.error("修改失败!"+res.message)
                    }else{
                        this.restLogin(this.newPwd.enterPwd);
                    }
                }).catch(err => {
                    this.$message.error("修改失败!")
                })
            },
            changeInfoPre(){
                this.edit = true;
            },
            changeInfo(){
                this.edit =false;
                this.$axios.jsonPost("/user/reviseUser",this.user,{
                    headers:{
                        "content-type":"application/json",
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.$message.success("修改成功!")
                })
            },
            restLogin(pwd){
                var that = this;
                this.$axios.post("/login/do_login",{
                    username:that.$cookies.get("user").username,
                    password:pwd
                },{}).then(function (res) {
                    var data = res.data;
                    that.$cookies.set("user",data)
                    that.$message.success("修改成功!")
                    that.changePwdVir = false;
                }).catch(function (error) {
                    console.log(error)
                    that.$message({
                        showClose: true,
                        message: "系统异常",
                        type: 'warning'
                    });
                });
            },
            setUserAvatarPre(){
                this.changeAvatarVir = true;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            upAvatarSuccess(response, file, fileList){
                this.$message.success("修改成功！");
                this.dialogVisible = false;
                this.changeAvatarVir = false;
                this.$cookies.set('userimg',response.data)

                this.init();
            }
        }
    }
</script>

<style scoped>

</style>