<template>
    <div style="margin-left: 0px;">
        <el-card style="background-color: rgba(99%,99%,99%,0.5);">
            <div style="">
                <el-select size="mini" @change="professChange" v-model="nowProfess" filterable placeholder="选择专业">
                    <el-option
                            v-for="item in allProfess"
                            :key="item.professionalId"
                            :label="item.professionalName"
                            :value="item.professionalName">
                    </el-option>
                </el-select>
            </div>
            <br clear="all">
            <div style="float:left;width:230px;height:600px;border:1px solid #b3e19d;">
                <div v-for="(user,index) in nowStudents" :key="index" @click="clickUser(user)" style="width:230px;height:60px;border:1px solid #3a8ee6;cursor: pointer;">
                    <div style="float:left;">
                        <el-avatar style="margin-top:5px;margin-left:10px;" :size="50" :src="user.img"></el-avatar>
                    </div>
                    <div style="float:left;margin-top:10px;margin-left:10px;">
                        {{user.name}}<br>
                        {{user.username}}
                    </div>
                </div>
                <div style="position: absolute;bottom: 20px;">
                    <div class="block">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :size="page.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="page.pageTotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div style="float:left;width:800px;background-color: rgba(99%,99%,99%,0.5);height: 600px;">
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="className"
                            label="班级"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="sumRanking"
                            label="专业排名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="sum"
                            label="专业成绩">
                    </el-table-column>
                </el-table>
                <el-button size="mini" style="margin-top:20px;" @click="changeImage">切换展示</el-button>

                <div v-show="imageType" ref="radar" style="margin-top:40px;width:950px;height:400px;"></div>
                <div v-show="!imageType" ref="line" style="margin-top:40px;width:950px;height:400px;"></div>

            </div>
        </el-card>

    </div>
</template>

<script>
    export default {
        name: "report-single",
        data(){
            return{
                page: {
                    pageNum: 1,
                    pageSize:9,
                    pageTotal: 0,
                },
                nowUser:{},
                tableData:[],
                allProfess:[],
                nowProfess:"",
                allStudent:[],
                nowStudents:[],
                imageType:true
            }
        },
        methods:{
            init(){
                this.getProfessional();
            },
            getProfessionalRanking(){
                this.$axios.post("/project/professionalRanking",{
                    professional:this.nowProfess,
                    page:this.page.pageNum,
                    size:this.page.pageSize
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.nowStudents = res.data.list;
                    this.page.pageTotal = res.data.total;
                })
            },
            changeImage(){
                this.imageType = !this.imageType;
            },
            professChange(){
                this.getProfessionalRanking();
            },
            getProfessional(){
                this.$axios.post("/user/getProfessionalGrade",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].professionalName = res.data[i].grade+res.data[i].professionalName;
                    }
                    this.allProfess = res.data;
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getProfessionalRanking();
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getProfessionalRanking();
            },
            clickUser(u){
                this.tableData = [];
                for (var key in u){
                    if(u[key]=='NaN'){
                        u[key] = 0
                    }
                }
                this.nowUser = u;
                this.tableData.push(u)
                this.initRadar();
                this.initLine()
            },
            initLine(){
                let myChart = this.$echarts.init(this.$refs.line)
                let option = {
                    xAxis: {
                        type: 'category',
                        data: ['导师监控', '项目档案', '小组互评', '个人学习报告', '项目展示考核', '项目报告', '项目课程综合考核']
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name:"分项成绩",
                        data: [this.nowUser.teacher, this.nowUser.projectCourse, this.nowUser.group, this.nowUser.userLecture, this.nowUser.projectShow, this.nowUser.projectLecture,this.nowUser.projectClass],
                        type: 'line'
                    },{
                        name:"分项排名",
                        data:[this.nowUser.teacherRanking, this.nowUser.projectCourseRanking, this.nowUser.groupRanking, this.nowUser.userLectureRanking, this.nowUser.projectShowRanking, this.nowUser.projectLectureRanking,this.nowUser.projectClassRanking],
                        type:"line"
                    }]
                };
                myChart.setOption(option)
            },
            initRadar(){
                let myChart = this.$echarts.init(this.$refs.radar)
                var max = 100;
                let option = {
                    title: {
                        text: '分项排名'
                    },
                    tooltip: {},
                    legend: {
                        data: ['分项排名（Allocated Budget）']
                    },
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: [
                            { name: '导师监控'},
                            { name: '项目档案'},
                            { name: '小组互评'},
                            { name: '个人学习报告'},
                            { name: '项目展示考核'},
                            { name: '项目报告'},
                            { name: '项目课程综合考核'}
                        ]
                    },
                    series: [{
                        name: '分项排名 VS 分项成绩',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data : [
                            {
                                value : [this.nowUser.teacher, this.nowUser.projectCourse, this.nowUser.group, this.nowUser.userLecture, this.nowUser.projectShow, this.nowUser.projectLecture,this.nowUser.projectClass],
                                name : '分项成绩'
                            },
                            {
                                value : [this.nowUser.teacherRanking, this.nowUser.projectCourseRanking, this.nowUser.groupRanking, this.nowUser.userLectureRanking, this.nowUser.projectShowRanking, this.nowUser.projectLectureRanking,this.nowUser.projectClassRanking],
                                name : '分项排名'
                            }
                        ]
                    }]
                };
                myChart.setOption(option);
            }
        }
    }
</script>

<style scoped>

</style>