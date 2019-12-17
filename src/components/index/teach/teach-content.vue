<template>
<!--  学生风采内容页面  -->
    <div>
        <div  v-if="show" >
            <el-row>
                <el-col :span="24">
                    <el-link @click="goBack" type="info" style="font-size:16px;float:right;margin-right: 20px;">返回</el-link>
                </el-col>
            </el-row>
            <el-card class="box-card" style="margin-top:20px;">
                <div slot="header" class="clearfix">
                    <span>{{stuStyle.name}}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">{{stuStyle.author}}</el-button>
                    <span style="font-size: 14px;">[{{stuStyle.time}}]</span>
                </div>
                <div class="text item">
                    <div v-html="stuStyle.content">
                        {{stuStyle.content}}
                    </div>
                </div>
            </el-card>

        </div>
    </div>
</template>

<script>
    export default {
        name: "teach-content",
        data(){
            return{
                stuStyle:{},
                show:false
            }
        },
        methods:{
            init(val){
                this.show = true;
                this.stuStyle = val;
                this.getStyleContent(val);
            },
            getStyleContent(){
                this.$axios.post("/projectStyle/getProjectStyleContent",{
                    id:this.stuStyle.id
                },{
                    headers:{
                        "X-Auth-Token":this.$cookies.get("user")['X-Auth-Token']
                    }
                }).then(res => {
                    this.stuStyle.content = res.data
                })
            },
            goBack(){
                this.show = false;
                this.$emit("goBack")
            }
        }
    }
</script>

<style scoped>

</style>