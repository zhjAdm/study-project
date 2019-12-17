<template>
    <div>
        <div v-if="show">
            <el-row>
                <el-col :span="24">
                    <el-link type="info" style="font-size:16px;float:right;margin-right: 20px;">退出</el-link>
                    <el-link type="success" style="font-size:16px;float:right;margin-right: 20px;">我的申请</el-link>
                    <el-link type="warning" @click="goBack" style="font-size:16px;float:right;margin-right: 20px;">返回</el-link>
                    <el-link type="primary" style="font-size:16px;float:right;margin-right: 20px;">首页</el-link>
                </el-col>
            </el-row>

            <div style="height:800px;width: 100%;background-color: #E1E1E1;">
                <div style="margin:100px auto;height:90%;width: 70%;background-color: #fff;">
                    <el-link type="warning" @click="goBack" style="font-size:16px;">上传</el-link>
                    <br><br>
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
                </div>
                <el-button @click="submitPassage">提交</el-button>
            </div>



        </div>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    export default {
        name: "teach-upload",
        components:{
            quillEditor
        },
        data(){
            return{
                show:false,
                passage:{
                    name:"",
                    projectId:"",
                    content:"",
                    file:[]
                },
                projects:[],
                editorOption: {}
            }
        },
        methods:{
            init(){
                this.show = true;
                this.getProjects();
            },
            goBack(){
                this.show = false;
                this.$emit("goBack")
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
            },
        }
    }
</script>

<style scoped>

</style>