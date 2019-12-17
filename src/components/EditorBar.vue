<template lang="html">
    <div class="editor">
        <div ref="toolbar" class="toolbar">
        </div>
        <div ref="editor" class="text">
        </div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    export default {
        name: 'Editorbar',
        data () {
            return {
                editor: null,
                info_: null
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            isClear: {
                type: Boolean,
                default: false
            },
            initContent: String,
        },
        watch: {
            initContent (val) {
                this.editor.txt.html(val);
            },
            isClear (val) {
                // 触发清除文本域内容
                if (val) {

                    this.editor.txt.clear();
                    this.info_ = null
                }
            },
            value (val) {
                // 使用 v-model 时，设置初始值
                window.console.log("更新："+val);
                this.editor.txt.html(val)
            }
        },
        mounted () {
            this.seteditor()
        },
        methods: {

            seteditor () {
                this.editor = new E(this.$refs.toolbar, this.$refs.editor);
                this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
                this.editor.customConfig.uploadImgServer = '/api/file/inputImg';// 配置服务器端地址
                this.editor.customConfig.uploadImgHeaders = {      };// 自定义 header
                this.editor.customConfig.uploadFileName = 'files'; // 后端接受上传文件的参数名
                this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
                this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 6 张图片
                this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

                // 配置菜单
                this.editor.customConfig.menus = [
                    'head', // 标题
                    'bold', // 粗体
                    'fontSize', // 字号
                    'fontName', // 字体
                    'italic', // 斜体
                    'underline', // 下划线
                    'strikeThrough', // 删除线
                    'foreColor', // 文字颜色
                    'backColor', // 背景颜色
                    'link', // 插入链接
                    'list', // 列表
                    'justify', // 对齐方式
                    'quote', // 引用
                    'emoticon', // 表情
                    'image', // 插入图片
                    'table', // 表格
                    'video', // 插入视频
                    'undo', // 撤销
                    'redo' // 重复
                ];

                this.editor.customConfig.uploadImgHooks = {

                    customInsert: (insertImg, result) => {
                        // 图片上传成功，插入图片的回调
                        let urls = Object.values(result.data);   //result.data就是服务器返回的图片链接
                        let step;
                        for(step = 0; step < urls.length; step++){
                            insertImg(urls[step]);
                        }

                    }
                };
                this.editor.customConfig.onchange = (html) => {
                    this.info_ = html // 绑定当前逐渐地值
                    this.$emit('change', this.info_) // 将内容同步到父组件中
                };
                // 创建富文本编辑器
                this.editor.create();
                this.initContent && this.editor.txt.html(this.initContent)

            }
        }
    }
</script>

<style lang="css">
    .editor {
        width: 100%;
        margin: 0 auto;
    }
    .toolbar {
        border: 1px solid #ccc;
    }
    .text {
        border: 1px solid #ccc;
        height: 500px;
    }
</style>