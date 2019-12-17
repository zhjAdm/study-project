<template>
<!--  点击系统公告后打开内容页面  -->
    <div>
        <div v-if="show">
            <el-row>
                <el-col :span="24">
                    <el-link @click="goBack" type="info" style="font-size:16px;float:right;margin-right: 20px;">返回</el-link>
                </el-col>
            </el-row>
            <el-card>
                <div slot="header">
                    {{notice.name}}
                </div>
                正文：
                <div v-html="notice.content">
                    <div  style="width:100%;">
                        {{notice.content}}
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "notice-content",
        data(){
            return{
                notice:{},
                show:false
            }
        },
        methods:{
            init(val){
                this.show = true;
                this.notice = val;
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