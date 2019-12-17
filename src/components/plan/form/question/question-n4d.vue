<template>
    <div style="min-height: 800px" v-if="shown4d">
        <el-row>
            <el-col :span="24">
                <span style="float:right;cursor: pointer;" @click="goBack">返回</span>
            </el-col>
        </el-row>
        <el-card shadow="never" v-for="(q,dind) in decisionList" :key="q.title" style="margin-bottom: 10px;">
            <div>
                <div style="float:left;width:300px;">{{dind+1}}&nbsp;&nbsp;<el-radio v-model="q.one" :label="0">{{q.oneTitle}}</el-radio></div>
                <div style="float:left;"><el-radio v-model="q.one" :label="1">{{q.twoTitle}}</el-radio></div>
            </div>
            <br>
        </el-card>
        <el-card shadow="never" v-for="(q,sind) in SNList" :key="q.title" style="margin-bottom: 10px;">
            <div>
                <div style="float:left;width:300px;">{{sind+8}}&nbsp;&nbsp;<el-radio v-model="q.one" :label="0">{{q.oneTitle}}</el-radio></div>
                <div style="float:left;"><el-radio v-model="q.one" :label="1">{{q.twoTitle}}</el-radio></div>
            </div>
            <br>
        </el-card>
        <div style="display:block;margin:0 auto;width:220px;" v-if="answered == false">
            <el-button type="primary" plain style="float: left;" @click="submitAnswer()">提交答案</el-button>
            <el-button type="info" plain @click="goBack" style="float:left;margin-left:20px;">取消</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "q4d",
        data(){
            return{
                decisionList:[
                    {title:"第1题",oneTitle:"基本上，和谐很重要",twoTitle:"和谐是达成目的的手段"},
                    {title:"第2题",oneTitle:"凭“感觉好不好”行事",twoTitle:"凭“合不合理”行事"},
                    {title:"第3题",oneTitle:"首先考虑的是人",twoTitle:"首先考虑的是事"},
                    {title:"第4题",oneTitle:"倾向和谐的关系",twoTitle:"倾向做对的事"},
                    {title:"第5题",oneTitle:"通过获得共识来决策",twoTitle:"根据自己的想法来决策"},
                    {title:"第6题",oneTitle:"重要的是，信赖我的情感",twoTitle:"重要的是，依赖我的理智"},
                    {title:"第7题",oneTitle:"不能忍受冲突对立",twoTitle:"可以忍受冲突对立"}
                ],
                SNList:[
                    {title:"第8题",oneTitle:"依赖我的内在觉知",twoTitle:"依赖我的观察"},
                    {title:"第9题",oneTitle:"偏重思考“可能会如何？",twoTitle:"偏重思考“是什么”"},
                    {title:"第10题",oneTitle:"倾向创意",twoTitle:"倾向常识"},
                    {title:"第11题",oneTitle:"行为依据闪现的灵感",twoTitle:"行为依据仔细的分析"},
                    {title:"第12题",oneTitle:"喜欢研究概念",twoTitle:"喜欢研究事实和数据"},
                    {title:"第13题",oneTitle:"注重全局考虑",twoTitle:"注重细节"},
                    {title:"第14题",oneTitle:"喜欢远大构想",twoTitle:"喜欢确立的事实"}
                ],
                shown4d:false,
                answered:false
            }
        },
        methods:{
            init(){
                this.shown4d = true;
            },
            goBack(){
                this.shown4d = false;
                this.$emit("goBack")
            },
            submitAnswer(){
                var flag = true;
                var tempArr = [];
                for (let i = 0; i < this.decisionList.length; i++) {
                    if(this.decisionList[i].one==undefined){
                        flag = false;
                    }
                    tempArr.push(this.decisionList[i].one)
                }
                var snArr = [];
                for (let i = 0; i < this.SNList.length; i++) {
                    if(this.SNList[i].one==undefined){
                        flag = false
                    }
                    snArr.push(this.SNList[i].one);
                }

                if(flag == false){
                    this.$alert('请回答所有题目进行提交', '错误', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                    return;
                }
                this.$axios.post("/project/fourD",{
                    decisionList:tempArr,
                    SNList:snArr,
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.shown4d = false;
                    this.$message.success("提交成功！")
                    this.$emit("goBack")
                })
            }
        }
    }
</script>

<style scoped>

</style>