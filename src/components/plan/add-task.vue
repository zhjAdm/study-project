<template>
    <div>
        <el-dialog title="添加任务" :visible.sync="show">
            <el-form ref="form" :rules="rules" :model="task" label-width="120px" size="mini">
                <el-form-item label="发布阶段" prop="projectStageId">
                    <el-select v-model="task.projectStageId" placeholder="请选择任务阶段">
                        <el-option
                                v-for="item in plans"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布目标" prop="groupType">
                    <el-radio-group v-model="task.groupType">
                        <el-radio label="0">个人</el-radio>
                        <el-radio label="1">小组</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="task.name" placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item label="任务说明">
                    <el-input
                            type="textarea"
                            placeholder="请输入任务说明"
                            :rows="4"
                            v-model="task.details">
                    </el-input>
                </el-form-item>
                <el-form-item label="任务时间" prop="time">
                    <el-date-picker
                            v-model="task.time"
                            align="right"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm"

                            placeholder="选择结束日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="超时设定" prop="timeOut">
                    <el-radio-group v-model="task.timeOut">
                        <el-radio :label="0">允许超时</el-radio>
                        <el-radio :label="1">不允许超时</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="总分设定" class="scaleStyle" prop="totalScore">
                    <el-input placeholder="请输入总分" type="number" v-model.number="task.totalScore">
                    </el-input>
                </el-form-item>
                <el-form-item label="评分类型" prop="appraiseType">
                    <el-radio-group v-model="task.appraiseType" @change="appraChange">
                        <el-radio :label="1">老师评分</el-radio>
                        <el-radio :label="2">小组评分</el-radio>
                        <el-radio :label="3">组内评分</el-radio>
                        <el-radio :label="0">老师评分+小组评分+组内评分</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="scaleVir">
                    <el-form-item label="老师评分权重" class="scaleStyle" prop="teacherScale">
                        <el-input placeholder="请输入权重" v-model="task.teacherScale">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="小组评分权重" class="scaleStyle">
                        <el-input placeholder="请输入权重" v-model="task.groupScale">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="组内评分权重" class="scaleStyle">
                        <el-input placeholder="请输入权重" v-model="task.userScale">
                        </el-input>
                    </el-form-item>
                </div>


            <el-divider></el-divider>
            <el-button @click="addTask" type="primary" plain>确认添加</el-button>

            </el-form>
        </el-dialog>

    </div>

</template>

<script>
    export default {
        name: "add-task",
        props:['plans'],
        data(){
            return{
                show:false,
                task:{
                    appraiseType:1,
                    projectStageId:"",
                    totalScore:0,
                    projectId:this.$route.query.projectId
                },//添加任务的临时对象
                rules:{
                    projectStageId:[
                        {required:true,message: '请选择任务阶段', trigger: 'change'}
                    ],
                    groupType:[
                        { required: true, message: '请选择发布目标', trigger: 'change' }
                    ],
                    name:[
                        { required: true, message: '请输入任务名称', trigger: 'blur' },
                        { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
                    ],
                    time:[
                        { required: true, message: '请选择结束时间', trigger: 'change' }
                    ],
                    timeOut:[
                        { required: true, message: '请选择超时设定', trigger: 'change' }
                    ],
                    totalScore:[
                        { required: true, message: '总分不能为空'},
                        { type: 'number', message: '总分必须为数字值'}
                    ],
                    appraiseType:[
                        { required: true, message: '请选择评分类型', trigger: 'change' }
                    ],
                    teacherScale:[
                        { required: true, message: '请填写老师评分权重', trigger: 'blur' }
                    ]
                },
                scaleVir:false,
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
        methods:{
            init(vir){
                this.show = vir;
            },
            addTask(){
                var that = this;
                this.$refs['form'].validate((valid) => {
                    if (valid) {

                        //let form = this.$refs['form'].$el
                        let formData = new FormData();

                        var taskObj = this.task;
                        taskObj.projectId  = that.$route.query.projectId;

                        if(taskObj.totalScore > 100 || taskObj.totalScore < 0){
                            this.$message.error("总分应该在0-100之间");
                            return ;
                        }

                        for(let key  in taskObj){
                            formData.append(key,taskObj[key])
                        }

                        this.$axios.post("/project/addTask",this.task,{
                            headers:{
                                "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                            }
                        }).then(res => {
                            if(res.code === 0){
                                this.$message.success("添加成功!");
                                this.show = false;
                                this.$emit("addTask",res.data)
                            }
                        }).catch(err => {
                            this.$message.error("添加失败!");
                        });

                        this.task = {};
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            appraChange(val){
                if(val == 0){
                    this.scaleVir = true;
                }else{
                    this.scaleVir = false;
                }
            },
            editTask(editObj){
                this.task = editObj;
            }
        }
    }
</script>

<style scoped>
.scaleStyle{
    width:230px;
}
</style>