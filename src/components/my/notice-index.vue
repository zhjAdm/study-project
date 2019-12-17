<template>
    <div>
        <div v-if="selectedMenu == 'notice' && $cookies.get('user').role<4">
            <div style="float: left;margin-left: 20px;width:70%;" >
                <div style="font-size:18px;">
                    通知公告
                    <el-divider></el-divider>
                </div>
                <div>
                    <el-tabs type="border-card" @tab-click="tabClick" v-model="tabNum">
                        <el-tab-pane label="我的通知" name="myNotice">
                            <el-card v-for="(work,index) in notices" :key="index" shadow="hover" style="float:left;width:96%;margin-left:20px;margin-top: 10px;" class="box-card">
                                <div style="float: left;margin-bottom: 20px;">
                                    <span >
                                        <el-link href="#" >
                                        <span @click="lookContent(work)">{{work.name}}</span>
                                        </el-link>
                                    </span>
                                    <el-breadcrumb style="margin-top:10px;" separator="/">
                                        <el-breadcrumb-item>{{work.author}}</el-breadcrumb-item>
                                        <el-breadcrumb-item>发布于{{work.time}}</el-breadcrumb-item>
                                        <el-breadcrumb-item>发布目标:{{work.objectName}}</el-breadcrumb-item>
                                    </el-breadcrumb>
                                </div>
                                <div style="float:right;">
                                    <el-dropdown>
                                        <i class="el-icon-more"></i>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item><span @click="editNotice(work)">编辑</span></el-dropdown-item>
                                            <el-dropdown-item><span @click="removeNotice(notices,index,work)">删除</span></el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </el-card>
                        </el-tab-pane>
                        <el-tab-pane label="发布通知" name="sendNotice">
                            <el-input v-model="notice.name" size="mini" placeholder="请输入公告标题"></el-input>
                            <br><br>
                            <el-select size="mini" @change="typeChange" v-model="sendType" placeholder="请选择发布类型">
                                <el-option
                                        v-for="item in notypes"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <br>
                            <el-select size="mini" v-if="sendType != '0000'" @change="projectChange" v-model="nowProjectId" placeholder="请选择发布项目">
                                <el-option
                                        v-for="item in projects"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <br>
                            <el-select size="mini" v-if="sendType=='group'" v-model="nowGroupId" placeholder="请选择发布小组">
                                <el-option
                                        v-for="item in groups"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <br><br>
                            <div style="width:100%;height:30px;border:1px solid #d3d4d6;border-radius: 0px">
                                <el-tooltip class="item" effect="dark" content="插入图片" placement="top-start">
                                    <i style="font-size: 20px;cursor: pointer;" @click="inputImageVir=true" class="el-icon-picture-outline"></i>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="插入链接" placement="top-start">
                                    <i @click="inputHref" style="margin-left:20px;font-size: 20px;cursor: pointer;" class="el-icon-link"></i>
                                </el-tooltip>
                            </div>
                            <div style="border:1px solid #d3d4d6;width:100%;min-height: 500px;" @blur="notice.content=$event.target.innerHTML" v-html="notice.content" contentEditable="true">
                                {{notice.content}}
                            </div>
                            <br clear="all"><br><br><br>
                            <el-button @click="sendNotice">提交</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>

        <el-dialog :title="nowNotice.name"
                :visible.sync="noticeContentVir"
                width="40%"
                center>

            <p v-html="nowNotice.content">
                {{nowNotice.content}}
            </p>


        </el-dialog>

        <el-dialog title="插入图片" :visible.sync="inputImageVir">
            <el-upload
                    class="upload-demo"
                    action="/api/file/inputImg"
                    :on-success="inputImageSuccess"
                    :file-list="tempAssessImages"
                    list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <br><br>
            <el-button size="small" type="success" @click="inputImage">插入图片</el-button>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "notice-index",
        components:{
        },
        props:['selectedMenu'],
        data(){
            return{
                inputImageVir:false,
                assessImages:[],
                tempAssessImages:[],//插入图片临时上传数组
                notices:[],
                noticeContentVir:false,
                notice:{},
                sendType:"0000",
                projects:[],
                tabNum:"myNotice",
                groups:[],
                nowNotice:{},
                edit:false,
                editorOption: {},
                nowProjectId:"",
                nowGroupId:"",
                notypes:[
                    {name:"全体",id:"0000"},
                    {name:"项目",id:"project"},
                    {name:"小组",id:"group"}
                ]
            }
        },
        watch:{
            notice(val){
                console.log(val)
            }
        },
        methods:{
            init(){
                this.getNotice();
            },
            tabClick(tab){
                this.edit=false;
                this.notice = {}
                if(tab.name == 'myNotice'){
                    this.getNotice();
                }

            },
            editNotice(work){
                this.edit = true;
                this.tabNum = "sendNotice"
                this.notice = work;
                this.projectChange();
                this.typeChange();
                if(work.type == 0){
                    this.sendType = '0000';
                }else if(work.type == 1){
                    this.sendType = 'project';
                    this.nowProjectId = work.object
                }else if(work.type == 2){
                    this.sendType = 'group';
                    this.nowGroupId = work.object
                }

                this.$axios.post("/bulletin/getBulletinContent",{
                    id:work.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.notice.content = res.data.content;
                })

            },
            sendNotice(){
                if(this.notice.name ==''){
                    this.$message.error("请输入公告标题!")
                    return;
                }
                if(this.sendType == 'project'){
                    this.notice.type = 1;
                    this.notice.objectId = this.nowProjectId;
                }else if(this.sendType == 'group'){
                    this.notice.type = 2;
                    this.notice.objectId = this.nowGroupId;
                }else{
                    this.notice.type = 0;
                    this.notice.objectId = '0000'
                }

                delete this.notice.time;
                if(this.edit == true){
                    this.$axios.post("/bulletin/reviseBulletin",this.notice,{
                        headers: {
                            "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        if(res.code === 0){
                            this.$message.success("修改成功!");
                            this.notice = {};
                            this.sendType = '0000'
                            this.edit= false;
                        }
                    })
                    return;
                }

                this.$axios.post("/bulletin/addBulletin",this.notice,{
                    headers: {
                        "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    if(res.code === 0){
                        this.$message.success("发布成功!");
                        this.sendType = '0000'
                        this.notice = {};
                    }
                })
            },
            getNotice(){
                this.$axios.post("/bulletin/getBulletin",{},{
                    headers: {
                        "X-Auth-Token": this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.notices = res.data;
                })
            },
            removeNotice(items,index,val){
                this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/bulletin/deleteBulletin",{
                        id:val.id
                    },{
                        headers:{
                            "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        }
                    }).then(res=>{
                        this.$message.success("删除成功!")
                        items.splice(index,1)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            lookContent(val){
                this.noticeContentVir = true;
                this.nowNotice = val;
                this.$axios.post("/bulletin/getBulletinContent",{
                    id:val.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res=>{
                    this.nowNotice.content = res.data.content;
                })
            },
            projectChange(){
                this.$axios.post("/project/getGroup",{id:this.nowProjectId},{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.groups = res.data;
                }).catch(err => {
                })
            },
            typeChange(){
                this.$axios.post("/project/getProject",{
                    action:'start',
                    page:0,
                    size:100
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.projects = res.data.list;
                }).catch(err => {
                })
            },
            inputImage(){
                if(this.notice.content == undefined){
                    this.notice.content = "";
                }
                for (let i = 0; i < this.assessImages.length; i++) {
                    this.notice.content += "<br><img width='300px' src='"+this.assessImages[i]+"'/><br>"
                }
                this.inputImageVir = false;
            },
            inputHref(){
                this.$prompt('请输入链接', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    this.notice.content = this.notice.content + '<br><a target="_blank" href="'+value+'">'+value+'</a><br>';
                    this.$forceUpdate()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            inputImageSuccess(response, file, fileList){
                this.assessImages.push(response.data)
            },
        }
    }
</script>

<style scoped>
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>