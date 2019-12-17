<template>
<!--  系统管理选项卡  -->
    <div style="margin-top:20px;">
        <el-tabs v-model="show" type="border-card" @tab-click="checkTab">

            <el-tab-pane label="用户管理" name="setUser" >
                <set-user ref="setUser" v-bind:show="show"></set-user>
            </el-tab-pane>
            <el-tab-pane label="班级管理" name="setClass">
                <set-class ref="setClass" v-bind:show="show"></set-class>
            </el-tab-pane>
            <el-tab-pane label="专业管理" name="setProfessional">
                <set-professional ref="setProfessional" v-bind:show="show"></set-professional>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import SetClass from "../sys/set-class";
    import SetUser from "../sys/set-user";
    import SetProfessional from "../sys/set-professional";
    export default {
        name: "user-menu",
        data(){
          return{
              show:'setUser',
              bgStyle:{
                  backgroundImage:'url('+require("../../assets/images/bg/bg-page.png")+')',
                  backgroundRepeat:'no-repeat',
                  backgroundSize:"cover"
              }
          }
        },
        components:{
            SetProfessional,
            SetUser,
            SetClass
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
            },
            checkTab(tab){
                this.$refs[tab.name].init();
            }
        }
    }
</script>

<style scoped>

    .block{
        clear:both;
        text-align: center;
    }
</style>