<template>
    <div v-if="selectedMenu == 'scoreForm' && $cookies.get('user').role<4">
        <el-card style="float: left;margin-left: 20px;width: 70%;min-height: 800px;">
            <div slot="header">
                表现得分评价表管理
                <span style="float:right;cursor: pointer;" @click="addVir=true">
                    <i style="font-size: 18px;" class="el-icon-circle-plus-outline"></i>
                </span>
            </div>
            <div>
                <el-table
                        :data="forms"
                        @expand-change="rowClick"
                        style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="表单名称">
                                    <span>{{ props.row.title }}</span>
                                </el-form-item>
                                <el-form-item label="创建时间">
                                    <span>{{ props.row.time }}</span>
                                </el-form-item>
                                <el-form-item label="评分点">
                                    <div v-for="(point,index) in props.row.standardContents" :key="index">
                                        评分内容：{{point.content}}
                                        评分比例：{{point.scale}}%
                                    </div>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="表单名称"
                            prop="title">
                    </el-table-column>
                    <el-table-column
                            label="创建时间"
                            prop="time">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-dialog title="考核评分表" :visible.sync="addVir">
            <el-form ref="form" :model="formContent" label-width="120px" size="mini">
                <el-form-item label="名称">
                    <el-input v-model="formContent.title"></el-input>
                </el-form-item>
                <el-form-item label="评分点">
                    <div>
                        <el-link type="primary" @click="formContent.standardContents.push({})">+添加评分点</el-link>
                    </div>
                    <div v-for="(point,index) in formContent.standardContents" :key="index">
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入评分标准或评分要求"
                                v-model="point.content">
                        </el-input>
                        评分比例:<el-input-number :min="0" :max="100" v-model="point.scale"></el-input-number>
                        &nbsp;&nbsp;
                        <i style="font-size: 16px;" @click="delCreatePoint(formContent.standardContents,index)" class="el-icon-delete"></i>
                        <br>
                    </div>

                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="setStandard">立即创建</el-button>
                    <el-button @click="addVir = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="考核评分表" :visible.sync="editVir">
            <el-form ref="form" :model="editFormContent" label-width="120px" size="mini">
                <el-form-item label="名称">
                    <el-input v-model="editFormContent.title"></el-input>
                </el-form-item>
                <el-form-item label="评分点">
                    <div>
                        <el-link type="primary" @click="editFormContent.standardContents.push({})">+添加评分点</el-link>
                    </div>
                    <div v-for="(point,index) in editFormContent.standardContents" :key="index">
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入评分标准或评分要求"
                                v-model="point.content">
                        </el-input>
                        评分比例:<el-input-number :min="0" :max="100" v-model="point.scale"></el-input-number>
                        &nbsp;&nbsp;
                        <i style="font-size: 16px;" @click="delEditPoint(editFormContent.standardContents,index)" class="el-icon-delete"></i>
                        <br>
                    </div>

                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="setEdit">立即创建</el-button>
                    <el-button @click="editVir=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "score-form",
        props:['selectedMenu'],
        data(){
            return{
                forms:[],
                addVir:false,
                editVir:false,
                formContent:{
                    standardContents:[]
                },
                editFormContent:{
                    standardContents:[]
                }
            }
        },
        methods:{
            init(){
                this.getFormList();
            },
            handleEdit(index, row) {
                this.editVir = true;
                this.editFormContent.title = row.title
                this.editFormContent.id = row.id
                this.$axios.post("/gradeResult/getStandardContent",{
                    standardsId:row.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.editFormContent.standardContents = res.data
                })
            },
            setEdit(){
                this.$axios.jsonPost("/gradeResult/reviseStandard",this.editFormContent,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res=>{
                    this.editVir=false;
                    this.editFormContent={standardContents:[]};
                    this.$message.success("修改成功!")
                })
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该表单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.forms.splice(index,1)
                    this.$axios.post("/gradeResult/deleteStandard",{
                        id:row.id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.$message.success("删除成功!")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            getFormList(){
                this.$axios.post("/gradeResult/getStandardList",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.forms = res.data
                })
            },
            setStandard(){
                this.$axios.jsonPost("/gradeResult/setStandard",this.formContent,{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "content-type":"application/json"
                    }
                }).then(res=>{
                    this.addVir=false;
                    this.formContent={standardContents:[]};
                    this.$message.success("添加成功!")
                })
            },
            rowClick(row, column, event){
                this.$axios.post("/gradeResult/getStandardContent",{
                    standardsId:row.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    for (let i = 0; i < this.forms.length; i++) {
                        if(this.forms[i].id == row.id){
                            this.forms[i].standardContents = res.data;
                        }
                    }
                })
            },
            delCreatePoint(files,index){
                files.splice(index,1)
            },
            delEditPoint(files,index){
                files.splice(index,1)
            }
        }
    }
</script>

<style scoped>

</style>