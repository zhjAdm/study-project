<template>
    <div v-if="showEcharts==3">
        <el-table
                :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%">
            <el-table-column
                    label="Date"
                    prop="date">
            </el-table-column>
            <el-table-column
                    label="Name"
                    prop="name">
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header" slot-scope="scope">
                    <el-button size="mini" @click="addShowScore">随手记</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="考核评分表" :visible.sync="addShowScoreVir">
            <el-form ref="form" :model="scoreForm" label-width="120px" size="mini">
                <el-form-item label="选择评分表单">
                    <el-select v-model="scoreForm.form" placeholder="请选择">
                        <el-option
                                v-for="item in scoreForms"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加评分点">
                    <el-link type="primary" @click="scoreForm.standards.push({})">添加评分点</el-link>
                </el-form-item>
                <el-form-item label="评分">
                    <div v-for="(stand,index) in scoreForm.standards" :key="index">
                        评分标准:
                        <el-input
                                type="textarea"
                                autosize
                                placeholder="请输入内容"
                                v-model="stand.title">
                        </el-input>
                        评分比重:<br>
                        <el-input-number v-model="stand.scale"></el-input-number>%
                        <br>
                        评价分数:<br>
                        <el-input-number v-model="stand.score"></el-input-number>
                        <br>
                        <el-link type="primary" @click="scoreForm.standards.splice(index,1)">
                            <i class="el-icon-delete"></i>删除此条评分点
                        </el-link>
                        <hr>
                    </div>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="onSubmit">立即添加</el-button>
                    <el-button @click="addShowScoreVir=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "score-list",
        props:['showEcharts'],
        data(){
            return{
                tableData:[],
                search:"",
                addShowScoreVir:false,
                scoreForm:{
                    standards:[]
                },
                scoreForms:[]
            }
        },
        methods:{
            init(){

            },
            handleEdit(){

            },
            handleDelete(){

            },
            addShowScore(){
                this.addShowScoreVir = true;
            },
            onSubmit(){

            }
        }
    }
</script>

<style scoped>

</style>