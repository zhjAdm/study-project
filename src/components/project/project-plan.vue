<template>
    <div style="">

        <div>
            <div style="">
                <div style="margin-left:10px;" v-if="($route.query.end==0 && ( $route.query.ht==1 || $cookies.get('user').role!=4) ) && $route.query.isLook == undefined">
<!--                    <el-button @click="newPlanVisible = true" type="primary" style="" plain>+ New 阶段</el-button>-->
<!--                    <el-button @click="deleteNowPlan" style="" type="warning" plain>删除当前阶段</el-button>-->
                    <el-button type="success" plain  style="" @click="editNowPlan">编辑当前阶段</el-button>
                    <el-button type="warning" plain  style="" @click="addTaskPre">添加任务</el-button>
                </div>
                <br>
                <el-tabs v-model="nowPlanId" @tab-click="planChange" >
                    <el-tab-pane v-for="(value,index) in plans" :key="index" :name="value.id" >
                        <span slot="label">
                            {{value.name}}
                            <i class="el-icon-success" style="color: #13ce66;font-size: 20px;" v-if="value.state==1"></i>
                            <i class="el-icon-caret-right" style="color: #b3e19d;font-size: 20px;" v-else></i>
                        </span>
                        <div style="width:120px;font-size: 16px;color: #3a8ee6;">阶段起止时间</div>
                        <span style="font-size: 14px;">{{value.startTime}}至{{value.endTime}}</span>
                        <br>
                        <br>
                        <div>
                            <div style="width:120px;font-size: 16px;color: #3a8ee6;">阶段说明</div>
                            <span style="font-size: 14px;">{{value.criterion}}</span>
                        </div>
                        <br>
                        <div>
                            <div style="width:120px;font-size: 16px;color: #3a8ee6;">学习要求</div>
                            <span style="font-size: 14px;">{{value.explanation}}</span>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div style="margin-top:10px;">
                 
                            <task-list v-on:editTask="editTask" v-bind:stage="nowPlan" v-on:delTask="delTask" ref="taskList" v-bind:taskList="taskList"></task-list>
                       
                </div>
            </div>
        </div>

        <add-task ref="addTaskCom" v-on:addTask="addTask" v-bind:plans="plans"></add-task>

        <el-dialog title="添加阶段" :visible.sync="newPlanVisible">
            <div v-for="(temPlan,index) in tempPlans" :key="index">
                <el-input style="margin-top: 10px;"
                        placeholder="请输入阶段名" v-model="temPlan.name" clearable></el-input>
                <el-input style="margin-top: 10px;"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入学习要求"
                        v-model="temPlan.explanation">
                </el-input>
                <el-input
                        style="margin-top: 10px;"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入阶段说明"
                        v-model="temPlan.criterion">
                </el-input><br><br>
                <el-date-picker
                        v-model="temPlan.startTime"
                        align="right"
                        type="date"
                        placeholder="选择开始日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
                </el-date-picker><br>
                <el-date-picker
                        v-model="temPlan.endTime"
                        align="right"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <el-divider></el-divider>
            </div>
            <div class="NewOption" @click="addPlan()">
                +添加阶段
            </div>
            <el-button @click="addPlanSubmit" type="primary" plain>确认添加</el-button>
        </el-dialog>

        <el-dialog title="编辑当前阶段"
                :visible.sync="editPlanVisible"
                width="30%">

            <el-input style="margin-top: 10px;"
                      placeholder="阶段名"
                      :disabled="true"
                      v-model="nowPlan.name">
            </el-input>
            <el-input style="margin-top: 10px;"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入学习要求"
                      v-model="nowPlan.explanation">
            </el-input>
            <el-input
                    style="margin-top: 10px;"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入阶段说明"
                    v-model="nowPlan.criterion">
            </el-input><br><br>
            <el-date-picker
                    v-model="nowPlan.startTime"
                    align="right"
                    type="date"
                    placeholder="选择开始日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
            </el-date-picker><br>
            <el-date-picker
                    v-model="nowPlan.endTime"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择结束日期"
                    :picker-options="pickerOptions">
            </el-date-picker>
            <el-divider></el-divider>

            <div style="margin-top: 40px;">
                <el-button @click="submitEditPlan()">确定修改</el-button>
            </div>

        </el-dialog>


    </div>
</template>

<script>
    import TaskList from "../plan/task-list";
    import AddTask from "../plan/add-task";
    import FormList from "../plan/form-list";
    export default {
        name: "project-plan",
        components: {FormList, AddTask, TaskList},
        data(){
            return{
                editModel:false,
                activeName:"task",
                setScoreVisible:false,
                nowGroupUser:[],
                nowScoreGroup:{},
                taskList:[],
                tempPlans:[],//新建的阶段
                nowPlan:{},
                nowPlanId:"",
                newPlanVisible:false,
                editPlanVisible:false,
                plans:[],
                nowUser:{},
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '明天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周后',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }

            }
        },
        mounted(){
            this.init();
            //document.querySelector('body').setAttribute('style', 'background-color:#F4F4F4')
        },
        methods:{
            init(){
                this.nowUser = this.$cookies.get("user");
                var that = this;
                this.$axios.post("/project/getProjectStageById",{id:this.$route.query.projectId},{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    if(res.code === 0){
                        that.plans = res.data;
                        that.nowPlan = res.data[0];
                        that.nowPlanId = res.data[0].id;
                        this.$refs.taskList.init(res.data[0].id);
                    }
                }).catch(err => {
                    this.$message.error("获取阶段信息失败！")
                })
            },
            addPlan(){
                this.tempPlans.push({
                    name:"",
                    explanation:"",
                    criterion:"",
                    endTime:"",
                    startTime:"",
                    projectName:this.$route.query.projectId
                })
            },
            addPlanSubmit(){
                //新建阶段
                var that = this ;
                //需要id
                if(this.plans.length == 0){
                    this.plans = [];
                }
                for (let i = 0; i < this.tempPlans.length; i++) {
                    this.plans.push(this.tempPlans[i])
                }

                this.$axios.jsonPost("/project/addProjectStage",{
                    list:this.tempPlans
                    }
                ,{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(data => {
                    that.init();
                })
                    that.clickPlan(that.plans[0])
                this.tempPlans = [];

                this.newPlanVisible = false;
            },
            editNowPlan(){
                this.editPlanVisible = true;
            },
            deleteNowPlan(){
                var that = this;
                this.$confirm('此操作将永久删除该阶段, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/project/deleteProjectStage",{
                        id:that.nowPlan.id,
                        projectId:this.$route.query.projectId
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        for (let i = 0; i < that.plans.length; i++) {
                            if(that.plans[i].id == that.nowPlan.id){
                                that.plans.splice(i,1)
                            }
                        }
                        this.$refs.taskList.init(this.nowPlanId);
                        this.$message.success("删除成功!")
                        that.initPlan();
                    }).catch(err => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            submitEditPlan(){
                var that = this;
                that.nowPlan.projectId=this.$route.query.projectId;

                this.$axios.jsonPost("/project/reviseProjectStage",that.nowPlan,{
                    headers:{
                        "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res => {
                    this.$message.success("修改成功!");
                    that.editPlanVisible = false;
                }).catch(err => {
                    this.$message.error("修改失败!")
                })
            },
            addTask(data){
                this.taskList.push(data)
                this.$refs.addTaskCom.init(false);
                this.$refs.taskList.init(this.nowPlanId);//刷新任务列表
            },
            //编辑任务信息
            editTask(data){
                var taskList = this.taskList.length;
                for (let i = 0; i < taskList.length; i++) {
                    if(data.id === taskList[i].id){
                        taskList[i] = data;
                    }
                }
                this.$refs.taskList.init();//刷新任务列表
            },
            removeFileFormStage(fileList,file,index){
                var that = this;
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$axios.post("/user/deleteStageFile",{
                        id:file.id,
                        path:file.path,
                        projectId:this.$route.query.projectId
                    },{
                        headers:{
                            "X-Auth-Token":that.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res => {
                        fileList.splice(index,1);
                        this.$forceUpdate();
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
            addTaskPre(){
                this.$refs.addTaskCom.init(true);
            },
            //删除任务
            delTask(data){
                this.taskList.splice(data,1);
                this.$refs.taskList.init();//刷新任务列表
            },
            handleClick(tab){
                if(tab.name == 'formList'){
                    this.$refs['formList'].init();
                }
            },
            planChange(tab){
                window.console.log(this.nowPlan);
                this.nowPlanId = tab.name;
                this.$refs.taskList.init(tab.name);
            }
        }
    }
</script>

<style scoped>
.planContent{
    margin-top:50px;
    clear: both;
    margin-bottom: 200px;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.NewOption{
    color: #409EFF;
    font-size: 14px;
    margin: 10px;
    cursor: pointer;
}
</style>