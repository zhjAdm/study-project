<template>
<!--  系统管理----班级管理  -->
    <div v-if="show=='setClass'" style="">
        <div>
            <el-button size="mini" @click="addProfessVir=true">添加班级</el-button>
        </div>
        <br>
        <el-table
                :data="classData"
                border
                style="float:left;width:400px;text-align: center;height:600px;overflow: scroll;">
            <el-table-column
                    prop="className"
                    label="班级名称"
                    width="300">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button style="color: #000;" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button style="color: #000;" @click="deletePro(scope.$index, classData,scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-if="addProfessVir==true" style="float: right;width:400px;margin-right: 100px;">
            <el-input size="mini" placeholder="请输入班级名称" v-model="clas.className">
                <template slot="prepend">班级名称</template>
            </el-input>
            <br>
            <br>
            <el-select v-model="clas.professionalId" size="mini" placeholder="请选择专业">
                <el-option
                        v-for="item in profs"
                        :key="item.professionalId"
                        :label="item.professionalName"
                        :value="item.professionalId">
                </el-option>
            </el-select>
            <br>
            <br>


            <el-input size="mini" placeholder="请输入年级" v-model="clas.grade">
                <template slot="prepend">年级</template>
            </el-input>
            <el-input type="hidden" v-model="clas.classId"></el-input>
            <el-button size="mini" @click="enterAdd">确定</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "set-class",
        props:['show'],
        data(){
            return{
                addProfessVir:false,
                profs:[],
                clas:{
                    professionalId:"",
                    className:"",
                    grade:"",
                    classId:"",
                },
                classData:[]
            }
        },
        methods:{
            init(){
                this.getClassData()
                this.getProfessional();
            },
            handleEdit(row){
                this.addProfessVir = true;
                this.clas = row
            },
            deletePro(index,datas,row){
                this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/professionalClass/deleteClass",{
                        classId:row.classId
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        datas.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            enterAdd(){
                var url = "/professionalClass/reviseClass";
                if(this.clas.classId == ''){
                    url = "/professionalClass/addClass";
                }
                this.$axios.post(url,this.clas,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.init();
                    this.addProfessVir = false;
                    this.clas = {}
                })
            },
            getProfessional(){
                this.$axios.post("/user/getProfessional",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.profs = res.data;
                })
            },
            getClassData(){
                this.$axios.post("/user/getProfessionalClass","",{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.classData = res.data;
                }).catch(err => {
                })
            }
        }
    }
</script>

<style scoped>

</style>