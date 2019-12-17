<template>
    <div v-if="show">
        <el-row>
            <el-col :span="24">
                <span style="float:right;cursor: pointer;" @click="goBack">返回</span>
            </el-col>
        </el-row>
        <el-card style="margin-bottom: 20px;" v-for="(qu,index) in queslist" :key="index" shadow="never">
            <div slot="header">
                {{qu.title}}
            </div>
            <div>
                <div style="float:left;width:300px;"><el-radio v-model="qu.one" :label="qu.onea">{{qu.oneTitle}}</el-radio></div>
                <div style="float:left;"><el-radio v-model="qu.one" :label="qu.twoa">{{qu.twoTitle}}</el-radio></div>
                <br>
            </div>
        </el-card>
        <div style="display:block;margin:0 auto;width:220px;" v-if="answered == false">
            <el-button type="primary" plain style="float: left;" @click="submitAnswer()">提交答案</el-button>
            <el-button type="info" plain @click="goBack" style="float:left;margin-left:20px;">取消</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "question-mbti",
        data(){
            return{
                queslist:[
                    {title:"假期时，你愿意：",onea:"E",twoa:"I",oneTitle:"出去找乐子",twoTitle:"还是宁愿待在家里读一本好书或看电视？"},
                    {title:"当你学习新东西时：",onea:"S",twoa:"N",oneTitle:"你是所见即所学？",twoTitle:"还是根据自己的直觉添加/删除你学到的知识？"},
                    {title:"当你对某件事作出决定时：",onea:"T",twoa:"F",oneTitle:"你是依靠逻辑推理？",twoTitle:"还是倾向于情感？"},
                    {title:"你愿意自己生活各个方面：",onea:"J",twoa:"P",oneTitle:"都井井有条，预先安排？",twoTitle:"还是突如其来，令人惊喜？"},
                ],
                show:false,
                answered:false
            }
        },
        methods:{
            init(){
                this.show=true;
            },
            goBack(){
                this.show = false;
                this.$emit("goBack")
            },
            submitAnswer(){
                console.log()
                var tempmbti = "";
                var flag = true;
                for (let i = 0; i < this.queslist.length; i++) {
                    if(this.queslist[i]==undefined){
                        flag = false;
                    }
                    tempmbti+=this.queslist[i].one;
                }
                if(flag==false){
                    this.$message.error("请回答所有问题!")
                }
                this.$axios.post("/project/MBTI",{
                    projectId:this.$route.query.projectId,
                    mbti:tempmbti
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.show = false;
                    this.$message.success("提交成功！")
                    this.$emit("goBack")
                })
            }
        }
    }
</script>

<style scoped>

</style>