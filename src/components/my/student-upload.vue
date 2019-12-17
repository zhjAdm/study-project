<template>
    <div v-if="selectedMenu == 'worksUpload' && $cookies.get('user').role==4">
        <div style="float:left;width: 70%;">
            <div style="font-size:18px;">
                我的风采作品
                <el-divider></el-divider>
            </div>

            <el-tabs type="border-card">
                <el-tab-pane label="我的作品">
                    <el-card v-for="(work,index) in works" :key="index" shadow="hover" style="float:left;width:96%;margin-left:20px;margin-top: 10px;" class="box-card">
                        <div style="float: left;">
                            <el-image
                                    style="width: 60px; height: 60px"
                                    :src="work.img"
                                    fit="contain"></el-image>
                        </div>
                        <div style="float: left;">
                            <span >{{work.name}}</span>
                            <el-breadcrumb style="margin-top:10px;" separator="/">
                                <el-breadcrumb-item>{{work.author}}</el-breadcrumb-item>
                                <el-breadcrumb-item>发布于{{work.time}}</el-breadcrumb-item>
                                <el-breadcrumb-item>{{work.projectName}}</el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <div style="float:left;margin-top:25px;margin-left:160px;">
                            <el-button size="mini" @click="agreePassage(work.id,0)" >通过</el-button>
                            <el-button size="mini" @click="agreePassage(work.id,1)" type="danger">拒绝</el-button>
                        </div>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="作品上传">
                    <div>
                        <el-input v-model="passage.name" size="mini" placeholder="请输入标题"></el-input>
                        <br><br>
                        <el-select size="mini" v-model="passage.projectId" placeholder="请选择所属项目">
                            <el-option
                                    v-for="item in projects"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <br><br>
                        上传封面:
                        <el-upload
                                action="https://jsonplaceholder.typicode.com/posts/"
                                list-type="picture"
                                ref="uploadCover"
                                :auto-upload="false"
                                :multiple="false"
                                :on-change="imgChange"
                                :limit="1">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <br><br>
                        <quill-editor style="height: 500px;" v-model="passage.content" :options="editorOption" />
                        <br clear="all"><br><br><br>
                        <el-button @click="submitPassage">提交</el-button>
                    </div>

                </el-tab-pane>
            </el-tabs>


        </div>


        <br><br><br><br><br>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';

    export default {
        name: "student-upload",
        components:{
            quillEditor
        },
        props:['selectedMenu'],
        data(){
            return{
                passage:{
                    name:"",
                    projectId:"",
                    content:"",
                    file:[]
                },
                projects:[],
                works:[],
                editorOption: {}
            }
        },
        methods:{
            init(){
                this.getProjects();
            },
            getWorks(){
                this.$axios.post("/")
            },
            submitPassage(){
                let formData = new FormData()
                formData.append("file",this.passage.file[0])
                formData.append("name",this.passage.name)
                formData.append("projectId",this.passage.projectId)
                formData.append("content",this.passage.content)

                this.$http.post("/projectStyle/inputProjectStyle",formData,{
                    headers:{
                        Accept:"*/*",
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                        //"Content-type":"application/json"
                    }
                }).then(res => {
                    this.$message.success("上传成功!")
                    this.passage = {};
                    this.goBack();
                }).catch(err => {
                    console.log(err)
                })
            },
            getProjects(){
                var that = this;
                this.$axios.post("/project/getProject",{
                    action:"start",
                    page:1,
                    size:100
                },{
                    headers:{"X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']}
                }).then(res => {
                    that.projects = that.projects.concat(res.data.list);
                }).catch(err => {
                })
                this.$axios.post("/project/getProject",{
                    action:"end",
                    page:1,
                    size:100
                },{
                    headers:{"X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']}
                }).then(res => {
                    that.projects = that.projects.concat(res.data.list);
                }).catch(err => {
                })
            },
            imgChange(file, fileList){
                this.passage.file[0] = file.raw;
            }
        }
    }
</script>

<style scoped>

</style>