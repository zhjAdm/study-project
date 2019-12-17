<template>
    <div v-if="show=='setProfessional'">
        <div>
            <el-button size="mini" @click="addProfessVir=true">添加专业</el-button>
        </div>
        <br>
        <div style="float:left;width:400px;height:600px;overflow: scroll;">
            <el-table
                    :data="professionalData"
                    border
                    style="text-align: center;">
                <el-table-column
                        prop="professionalName"
                        label="专业名称"
                        width="300">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button style="color: #000;" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button style="color: #000;" @click="deletePro(scope.$index, professionalData,scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div v-if="addProfessVir==true" style="float: right;margin-right: 150px;">
            <el-input size="mini" placeholder="请输入专业名称" v-model="pro.proname">
                <template slot="prepend">专业名称</template>
            </el-input>
            <el-input type="hidden" v-model="pro.proid"></el-input>
            <el-button size="mini" @click="enterAdd">确定</el-button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "set-professional",
        props:['show'],
        data(){
            return{
                addProfessVir:false,
                pro:{
                    proname:"",
                    proid:"",
                },
                professionalData:[]
            }
        },
        methods:{
            init(){
                this.getProfessional();
            },
            handleEdit(row){
                this.addProfessVir = true;
                this.pro.proname = row.professionalName;
                this.pro.proid=row.professionalId;
            },
            deletePro(index,datas,row){
                this.$confirm('此操作将永久删除该专业, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/professionalClass/deleteProfessional",{
                        professionalId:row.professionalId
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
                var url = "/professionalClass/addProfessional";
                if(this.pro.proid != ''){
                    url = "/professionalClass/reviseProfessional";
                }
                this.$axios.post(url,{
                    professionalName:this.pro.proname,
                    professionalId:this.pro.proid
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.init();
                    this.addProfessVir = false;
                    this.pro = {}
                })
            },
            getProfessional(){
                this.$axios.post("/user/getProfessional",{},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.professionalData = res.data;
                })
            }
        }
    }
</script>

<style scoped>

</style>