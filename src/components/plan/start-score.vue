<template>
    <div>
        <el-dialog title="任务评分" :visible.sync="show">
            <el-form ref="form" :model="nowUser" label-width="80px" size="mini">
                <el-form-item label="分数">
                    <el-input  v-model.number="nowUser.grade"></el-input>
                </el-form-item>
                <div v-if="scoreType != 'teacher'">
                    <el-form-item label="评分意见">
                        <el-input type="textarea" v-model="nowUser.view"></el-input>
                    </el-form-item>
                </div>
                <el-button type="primary" @click="enterScore">确定</el-button>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "start-score",
        data(){
            return{
                show:false,
                task:{},
                scoreType:"",
                nowUser:{},
                enterScoreList:[]
            }
        },
        methods:{
            init(v,u,type){
                this.show = true;
                this.task = v;
                this.scoreType = type;
                this.nowUser = u
            },
            getGroups(){
                var that = this;
                this.$axios.post("/project/getGroup",{id:this.$route.query.projectId},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    var groupArr = res.data;
                    for (let i = 0; i < groupArr.length; i++) {
                        this.$axios.post("/project/getGroupUser",{id:groupArr[i].id},{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }).then(res => {
                            groupArr[i].members = res.data
                            that.groups = groupArr;
                            that.myGroups = groupArr.concat();
                            that.getMyGroup();
                            this.$forceUpdate();
                        }).catch(err => {

                        })
                    }
                }).catch(err => {
                })
            },
            enterScore(){
                if(this.nowUser.grade > this.task.totalScore){
                    this.$message.error("总分不能大于"+this.task.totalScore);
                    return;
                }
                if(this.scoreType != 'teacher' && (this.nowUser.view == undefined || this.nowUser.view.length < 5)){
                    this.$message.error("评价字数至少5个字以上");
                    return;
                }
                //组装上传参数 任务id
                this.nowUser.taskId = this.task.id;
                //设置小组或个人id
                this.nowUser.rateeId = this.nowUser.groupId;
                this.nowUser.projectId = this.$route.query.projectId
                //添加到确定要上传的list内
                this.enterScoreList.push(this.nowUser);
                var url = "";
                switch (this.scoreType) {
                    case "teacher":
                        url = "/user/teacherAppraisal";
                        break;
                    case "group":
                        url = "/user/groupAppraisal";
                        break;
                    case "user":
                        url = "/user/userAppraisal";
                        break;
                }
                this.$axios.jsonPost(url,{
                    list:this.enterScoreList
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res => {
                    if(res.code === 0){
                        this.$message.success("评价成功！");
                        this.enterScoreList = [];
                        this.show = false;
                        this.$emit("reloadData")
                    }else{
                        this.$message.error("评价失败！")
                    }
                }).catch(err => {
                    this.$message.error("评价失败！")
                })

            }
        }
    }
</script>

<style scoped>
    .studentTitle{
        width:85px;
        float:left;
        margin-left:30px;
        margin-bottom: 15px;
        text-align: center;
        overflow: scroll;
    }
</style>