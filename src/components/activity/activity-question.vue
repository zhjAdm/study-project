<template>
<!--  个人中心----调查问卷页面  -->
    <div v-if="selectedMenu=='question'" style="float: left;margin-left: 20px;width:70%;" >
        <div class="container" v-if="!showQuestion">
            <el-card>
                <div slot="header">
                    <el-button type="primary" icon="el-icon-plus" size="small" @click="AddQuestion()">新建问卷</el-button>
                    <el-button type="success" @click="editFun($event)" plain>编辑模式</el-button>
                    <!--            <el-input placeholder="按标题搜索" class="input-with-select">-->
                    <!--                <el-button slot="append" icon="el-icon-search"></el-button>-->
                    <!--            </el-input>-->
                </div>
                <div>

                    <div v-for="(ques,index) in quesList" :key="index" style="margin-top: 10px;">
                        <el-card class="box-card" shadow="hover">
                            <div style="float:left;">
                                <i class="el-icon-s-data" style="font-size:32px;"></i>
                                <span style="font-size: 18px;">{{ques.name}}</span>
                                <div style="font-size: 14px;">
                                    发布于 {{ques.time}} | 创建人:{{ques.teacher}}
                                </div>
                            </div>
                            <div style="float:right;">
                            <span style="float: right;margin-top:-10px;" v-if="editModel">
                                <i class="el-icon-error" style="float:left;cursor:pointer;" @click="removeQuestion(quesList,ques,index)"></i>
                            </span>
                                <div class="funBtn">
                                    <el-link @click="editQues(ques)" type="primary">编辑信息</el-link>
                                </div>
                            </div>
                            <br clear="all">
                        </el-card>

                    </div>
                    <div class="block" style="margin-top:20px;margin-left: 230px;">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="page.pageSizes"
                                :page-size="page.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="page.total">
                        </el-pagination>
                    </div>
                </div>
            </el-card>



        </div>
        <div class="NewQuestion" v-if="showQuestion">
            <el-form ref="form" :model="form" label-width="80px">
                <el-page-header @back="goBack" content="详情页面">
                </el-page-header>
                <el-input placeholder="请输入问卷名称" v-model="form.option" v-if="editQuesVar" style="margin-top: 15px;">
                </el-input>
                <el-divider></el-divider>
                <el-form-item v-for="(item,sIn) in form.subject" :label="'第'+(sIn+1)+'题'" :key="item.index">

                    <el-input type="textarea" v-model="item.topic"></el-input>
                    <i class="el-icon-delete" style="margin-right: 20px;" @click="deleteTopic(form.subject,sIn)"></i>
                    <el-radio-group v-model="item.type">
                        <el-radio :label="1">判断</el-radio>
                        <el-radio :label="2">单选</el-radio>
                        <el-radio :label="3">多选</el-radio>
                        <el-radio :label="4">问答</el-radio>
                    </el-radio-group>
                    <div v-for="(option,oIn) in item.option" :key="option.index" >
                        <div style="clear:both;">

                        </div>
                        <div v-if="item.type != 4">
                            <div style="width: 70%;float:left;" >
                                <el-input placeholder="请输入选项" v-model="option.optionContent" style="width: 100%;margin-top: 15px;">
                                    <template slot="prepend">{{oIn+1}}</template>
                                </el-input>
                            </div>
                            <div style="float:left;margin-top: 15px;margin-left: 20px;">
                                <i class="el-icon-delete" style="margin-right: 20px;" @click="deleteOption(item.option,oIn)"></i>
                                <el-radio-group v-model="option.correct">
                                    <el-radio label="1">正确</el-radio>
                                    <el-radio label="2">错误</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div style="clear:both;"></div>

                    </div>
                <div class="NewOption" @click="AddOption(item)">
                    +添加选项
                </div>
                <el-divider></el-divider>
                </el-form-item>
                <div class="NewOption" @click="NewQuestion()">
                    +添加题目
                </div>
                <div style="display:block;margin:0 auto;width:220px;">
                    <el-button type="primary" plain style="float: left;" @click="submitQues()" v-if="!editQuesVar">确定</el-button>
                    <el-button type="primary" plain style="float: left;" @click="submitEdit()" v-if="editQuesVar">确定修改</el-button>

                    <el-button type="info" plain @click="goBack" style="float:left;margin-left:20px;">取消</el-button>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: "activity-question",
        props:['selectedMenu'],
        data(){
          return{
              editQuesVar:false,
              editModel:false,
              showQuestion:false,
              textarea:'',
              quesList:[],
              page:{
                  pageSizes:[8, 50, 100, 200],
                  pageSize:8,
                  pageNum:1,
                  data:{},
                  total:0
              },
              nowEditQue:{},
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
                              correct:'1'
                          },{
                              index:2,
                              optionContent:'',
                              correct:'1'
                          }]
                      }
                  ]
              }
          }
        },
        mounted(){
            //this.getOper();
        },
        methods:{
            init(){
                this.getOper();
            },
            goBack() {
                this.showQuestion = !this.showQuestion;
                this.getOper();
            },
            getOper(){
                var that = this;
                this.$axios.post("/questionnaire/getQuestionnaireList",{
                    page:that.page.pageNum,
                    size:that.page.pageSize
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.quesList = res.data.list;
                    that.page.total = res.data.total;
                })
            },
            editFun(event){
                if(this.editModel == false) {
                    this.editModel = true;
                    event.srcElement.innerText = "取消编辑";
                }
                else {
                    this.editModel = false;
                    event.srcElement.innerText = "编辑";
                }
            },
            AddQuestion(){
                var that = this;

                this.$prompt('请输入问卷名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {

                    this.$axios.post("/questionnaire/addQuestionnaire",{
                        name:value
                    },{
                        headers:{
                            "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        if(res.code === 0){
                            this.$message({
                                type: 'success',
                                message: '创建成功!'
                            });
                            this.showQuestion = !this.showQuestion;
                            this.nowEditQue.queId = res.data;
                        }else{
                            this.$message.error("创建失败!")
                        }

                    }).catch(err => {
                        this.$message.error("创建失败:"+err.message);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });

            },
            AddOption(item){
                var subjectArr = this.form.subject;
                for (let i = 0; i < subjectArr.length; i++) {
                    var subject = subjectArr[i];
                    console.log(subject)
                    var optionArr = subject.option;
                    if(subject.id === item.id){
                        optionArr.push({index:optionArr.length+1,desc:''});
                    }
                }
            },
            NewQuestion(){
                var subjectArr = this.form.subject;
                subjectArr.push(
                    {
                        index:subjectArr.length+1,
                        topic:'',
                        type:1,
                        option:[{index:1,desc:'',correct:'1'},{index:2,desc:'',correct:'1'}]
                    }
                )
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getOper();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getOper();
            },
            editQues(ques){
                var that = this;
                this.showQuestion = !this.showQuestion;
                this.nowEditQue = ques
                this.$axios.post("/questionnaire/getQuestionnaire",{
                    queId:ques.queId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    that.form.subject = res.data.list
                    that.form.option = ques.name
                    that.editQuesVar = true;
                }).catch(err => {

                })

            },
            removeQuestion(quesList,ques,index){
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$axios.post("/questionnaire/deleteQuestionnaire",{
                        queId:ques.queId
                    },{
                        headers:{
                            "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        quesList.splice(index,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(err => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            submitQues(){
                var that = this;
                var sub = this.form.subject
                sub.forEach( (s) => {
                    s.queId = this.nowEditQue.queId
                })
                this.$axios.jsonPost("/questionnaire/addTopic",{
                    list:that.form.subject
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res => {
                    if(res.code === 0){
                        this.$message.success("添加成功!")
                        that.showQuestion = !that.showQuestion;
                        that.form.subject=[];
                        that.form.option="";
                    }else{
                        this.$message.error("添加失败!错误信息:"+res.message)
                    }

                }).catch(err => {
                    this.$message.error("添加失败!")
                })
            },
            submitEdit(){
                var that = this;
                var sub = this.form.subject
                sub.forEach( (s) => {
                    s.queId = this.nowEditQue.queId
                })
                this.$axios.jsonPost("/questionnaire/reviseQuestionnaire",{
                    list:that.form.subject,
                    name:that.form.option,
                    queId:that.nowEditQue.queId
                },{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res => {
                    this.$message.success("修改成功!")
                })
            },
            deleteOption(options,oIn){
                this.$confirm('删除该选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    options.splice(oIn,1)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteTopic(topics,tIn){
                this.$confirm('删除该题目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    topics.splice(tIn,1)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .funBtn{
        color: #409EFF;
        font-size: 14px;
    }
    .NewOption{
        color: #409EFF;
        font-size: 14px;
        margin: 10px;
        cursor: pointer;
    }
    .box-card {
        height: 90px;
    }
    .container,.NewQuestion{
        width:880px;
        margin:0 auto;
    }
    .input-with-select {
        width:680px;
        background-color: #fff;
        margin-left:50px;
    }
</style>