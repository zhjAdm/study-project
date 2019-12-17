<template>
    <div id="container">
        <div style="font-size:28px;height:30px;line-height: 30px;">
            <span style="float:left;font-size: 24px;">
                <img src="../../assets/images/header/school.png" style="width:150px;">
                <img src="../../assets/images/header/logo.png" style="margin-left:30px;width:100px;">
                <img src="../../assets/images/header/name.png" style="margin-left:600px;width:626px;height:59px;">
            </span>
        </div>

        <div :style="bgStyle">
            <el-card style="margin-top:0px;" class="box-card">
                <div style="margin:0 auto;">用户登录</div>
                <el-form style="margin-top:40px;" :inline="true" label-position="left" :model="form" class="demo-form-inline" v-loading="loading">
                    <el-form-item label="">
                        <el-input style="width:300px;border-radius:19px;" v-model="form.username" placeholder="请输入学号/工号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="" >
                        <el-input style="width:300px;border-radius:19px;" type="password" placeholder="请输入密码" v-model="form.password" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width:300px;border-radius:19px;" type="primary" plain @click="onSubmit" class="submit">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>

        </div>

    </div>
</template>

<script>
    export default {
        name: "index-login",
        data(){
            return{
                form:{
                    username:"",
                    password:""
                },
                bgStyle:{
                    backgroundImage:'url('+require("../../assets/images/bg/bg-login.png")+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100% 100%",
                    marginTop:"30px",
                    height:"800px",
                    width:"100%",
                    paddingTop:"120px"
                },
                loading:false
            }
        },
        mounted(){
            this.keyupSubmit()
        },
        methods:{
            keyupSubmit(){
                document.onkeydown=e=>{
                    let _key=window.event.keyCode;
                    if(_key===13){
                        this.onSubmit()
                    }
                }
            },
            onSubmit(){
                this.loading = true;
                var that = this;
                this.$axios.post("/login/do_login",{
                    username:that.form.username,
                    password:that.form.password
                },{})
                  .then(function (res) {
                      var data = res.data;
                      console.log(data)
                      if(res.code === 0){
                          that.$cookies.set("user",data)
                          that.$cookies.set("userimg",data.img)
                          that.$router.push('/1')
                      }else{
                          that.loading = false;
                          that.$message({
                              showClose: true,
                              message: res.message,
                              type: 'warning'
                          });
                      }
                }).catch(function (error) {
                    console.log(error)
                    that.loading = false;
                    that.$message({
                        showClose: true,
                        message: "系统异常",
                        type: 'warning'
                    });
                });
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

    @media screen and (min-width: 1201px) {
        .box-card {
            background-color: rgba(99%,99%,99%,0.3);
            width: 420px;
            height: 350px;
            margin-left:70%;
            text-align: center;
            padding-top: 40px;
        }
    }
    @media screen and (max-width: 1200px) {
        .box-card {
            background-color: rgba(99%,99%,99%,0.3);
            width: 400px;
            height: 350px;
            margin-left: 30px;
            text-align: center;
            padding-top: 40px;
        }
    }
    .submit{
        width:210px;
        margin-top:30px;
    }
</style>