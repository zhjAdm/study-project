<template>

    <div>

        <el-button style="float:left;margin-left: 20px;" type="primary" @click="startSignin(1)" v-if="this.signinstatus.status==0&& this.signinstatus.projectStatus==0 && this.$cookies.get('user').role < 4" plain>发起签到</el-button>
        <el-button style="float:left;margin-left: 20px;" type="primary" @click="startSignin(0)" v-if="this.signinstatus.status==1&&this.signinstatus.projectStatus==0 && this.$cookies.get('user').role < 4" plain>结束签到</el-button>
        <div v-if="$cookies.get('user').role<4 && editVar==true">
            <el-row>
                <el-col :span="24">
                    <el-link type="info" style="font-size:16px;float:right;margin-right: 20px;" @click="editVar = false,getSignins">返回</el-link>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">

                </el-col>
                <el-col :span="2" v-for="(op,index) in signOpers" :key="index">
                    <el-link @click="editSignStatus(op.id)" style="font-size:16px;float:right;margin-right: 20px;">
                        {{op.name}}
                    </el-link>
                </el-col>
            </el-row>
            <el-table
                    :data="signinfos"
                    style="width: 100%;">
                <el-table-column
                        prop="name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="学号">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">
                            缺勤
                        </span>
                        <span v-if="scope.row.status == 1">
                            签到
                        </span>
                        <span v-if="scope.row.status == 2">
                            早退
                        </span>
                        <span v-if="scope.row.status == 3">
                            迟到
                        </span>
                        <span v-if="scope.row.status == 4">
                            病假
                        </span>
                        <span v-if="scope.row.status == 5">
                            事假
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="time"
                        label="时间">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="270">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.check"></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-table
                v-if="editVar==false"
                :data="opers"
                style="width: 100%;">
            <el-table-column
                    prop="time"
                    label="时间">
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">
                        正在进行
                    </span>
                    <span v-if="scope.row.status == 1">
                        结束
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="signInNumber"
                    label="已签到人数">
            </el-table-column>
            <el-table-column
                    prop="sum"
                    label="总人数">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="370">
                <template slot-scope="scope">
                    <el-button @click="editInfo(scope.row.id)" type="text" size="small">编辑</el-button>
                    <el-button @click="getImg" type="text" size="small" v-if="scope.row.status == 0">获取签到二维码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog width="300px" :visible.sync="imgVir">
            <img :src="imgUrl">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "signin",
        data(){
            return{
                signOpers:[
                    {name:"设为签到",id:1},
                    {name: "设为早退",id:2},
                    {name:"设为迟到",id:3},
                    {name: "设为病假",id:4},
                    {name:"设为事假",id:5},
                    {name:"设为缺勤",id:0}
                ],
                nowSignId:"",
                editVar:false,
                opers:[],
                imgUrl:"",
                imgVir:false,
                signinfos:[],
                signinstatus:[],
            }
        },
        methods:{
            init(){
                this.getSignins();
            },
            getSignins(){
                this.$axios.post("/signIn/signInResult",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.opers = res.data;
                })
                this.$axios.post("/signIn/getSignInStatus",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.signinstatus = res.data;
                })

            },
            editInfo(id){
                this.editVar = true;
                this.$axios.post("/signIn/signInResultById",{
                    projectId:this.$route.query.projectId,
                    id:id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.nowSignId = id;
                    this.signinfos = res.data;
                })
            },
            getImg(){
                this.$axios.post("/signIn/QRCode",{
                    projectId:this.$route.query.projectId
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.imgVir = true;
                    this.imgUrl = res.data
                })
            },
            editSignStatus(status){
                var tempArr = [];
                for (let i = 0; i < this.signinfos.length; i++) {
                    if(this.signinfos[i].check == true){
                        tempArr.push(this.signinfos[i])
                        this.signinfos[i].check = false
                    }
                }
                this.$axios.jsonPost("/signIn/reviseSignInResult",{
                    projectId:this.$route.query.projectId,
                    signInid:this.nowSignId,
                    status:status,
                    list:tempArr
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token'],
                        "Content-Type": "application/json"
                    }
                }).then(res=>{
                    this.editInfo(this.nowSignId)
                    this.$message.success("修改成功!")
                })
            },
            startSignin(num){
                this.$axios.post("/signIn/setSignIn",{
                    projectId:this.$route.query.projectId,
                    signIn:num
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }

                    // eslint-disable-next-line no-unused-vars
                }).then(res=>{
                    this.$alert('发起成功，请在签到信息中进行查看此次签到!', '提示', {
                        confirmButtonText: '确定',
                    });
                    this.init();
                }).catch(err=>{
                    window.console.log(err)
                })
            }
        }
    }
</script>

<style scoped>

</style>