<template>
<!--  问卷调查 回答及答案页面  -->
    <div v-if="show">
        <el-row>
            <el-col :span="24">
                <span style="float:right;cursor: pointer;" @click="goBack">返回</span>
            </el-col>
        </el-row>
        <div style="font-size:20px;text-align: center;margin-top: 20px;">
            {{queName}}
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-divider></el-divider>
            <el-form-item v-for="(item,sIn) in form.subject" :label="'第'+(sIn+1)+'题'" :key="item.index">

                <el-card class="box-card">
                    {{item.topic}}
                    <hr>

                    <div v-if="item.type < 3">
                        <el-radio-group v-model="item.answer">
                            <div v-for="(option,oIn) in item.option" :key="oIn" >
                                    <el-radio :label="option.optionId" >{{option.optionContent}}</el-radio>
                                <div style="clear:both;"></div>
                            </div>
                        </el-radio-group>
                    </div>
                    <div v-if="item.type == 3">
                        <el-checkbox v-model="option.check" v-for="(option,oIn) in item.option" :key="option.id" :label="option.optionId">{{option.optionContent}}</el-checkbox>
                        <div style="clear:both;"></div>
                    </div>
                    <div v-if="item.type == 4">
                        <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="item.answers">
                        </el-input>
                    </div>

                </el-card>

            </el-form-item>
            <div style="display:block;margin:0 auto;width:220px;" v-if="answered == false">
                <el-button type="primary" plain style="float: left;" @click="submitAnswer()">提交答案</el-button>

                <el-button type="info" plain @click="goBack" style="float:left;margin-left:20px;">取消</el-button>
            </div>

        </el-form>
    </div>
</template>

<script>
    export default {
        name: "activity-answer",
        data(){
            return{
                x:[],
                show:false,
                queName:"",
                subForm:{
                    questionnaire:'',
                    projectId:'',
                    list:[

                    ]
                },
                answered:false,
                form: {
                    option: '',
                    subject:[
                        {
                            index:1,
                            topic:'',
                            queId:"",
                            type:1,
                            option:[{
                                index:1,
                                optionContent:'',
                                correct:1
                            },{
                                index:2,
                                optionContent:'',
                                correct:1
                            }]
                        }
                    ]
                }
            }
        },
        mounted() {

        },
        methods:{
            init(queId,queName,projectId){
                var that = this;
                this.show = true;
                this.queName = queName;
                this.subForm.questionnaire = queId;
                this.subForm.projectId = projectId;
                this.$axios.post("/questionnaire/getQuestionnaire",{
                    queId:queId,
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.form.subject = res.data.list;

                    for (let i = 0; i < res.data.list.length; i++) {
                        var sub = res.data.list[i];
                        for (let j = 0; j < sub.option.length; j++) {
                            var op = sub.option[j]
                            if(op!=undefined && op.number != undefined && op.number != null && op.number!=0){
                                sub.answer = op.optionId;
                                this.answered = true;
                            }
                            if(op.number != undefined && op.number != null && sub.type == 3){
                                if(op.number != 0){
                                    op.check = true
                                }
                            }
                        }
                        if(sub.answerList!= undefined && sub.answerList.length!=0){
                            sub.answers = sub.answerList[0];
                            this.answered = true;
                        }
                        that.subForm.list[i] = {}
                        that.subForm.list[i].topicId = res.data.list[i].id
                        that.subForm.list[i].optionId = ""
                    }
                    that.form.subject = res.data.list;
                }).catch(err => {
                    console.log(err)
                })
            },
            handleCheckedCitiesChange(value) {
                console.log(value)
            },
            submitAnswer(){
                this.subForm.list = this.form.subject;
                console.log(this.subForm.list);
                var tempArr = [];

                for (let i = 0; i < this.subForm.list.length; i++) {
                    var sub = this.subForm.list[i];
                    sub.topicId = sub.id;
                    if(sub.type == 4){
                        sub.optionId = sub.answer;
                    }else if(sub.type != 4){

                        for (let j = 0; j < sub.option.length; j++) {
                            if(sub.option[j].check != undefined && sub.option[j].check == true){
                                tempArr.push({
                                    topicId:sub.topicId,
                                    optionId:sub.option[j].optionId
                                })
                            }
                        }
                        this.subForm.list.splice(i,1)
                    }
                }
                this.subForm.list = this.subForm.list.concat(tempArr);
                var that = this;
                console.log(this.subForm);
                this.$axios.jsonPost("/user/answer",this.subForm,{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res => {
                    if(res.code === 0){
                        this.$message.success("提交成功!");
                        this.answered = true;
                        this.$router.go(-1);
                    }else{
                        this.$message.error(res.message);
                        this.$router.go(-1);
                    }
                }).catch(err => {

                })

            },
            goBack(){
                this.show = false;
                this.$emit("goBack")
            }
        }
    }
</script>

<style scoped>

</style>