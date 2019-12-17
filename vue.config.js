module.exports = {
    publicPath: './',
    outputDir: 'dist',
    lintOnSave: true,
    runtimeCompiler: true, //关键点在这
    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
    chainWebpack: () => {},
    configureWebpack: () => {},
    // 配置 webpack-dev-server 行为。
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        https: false,
        hotOnly: true,
        // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
        proxy: {
            "/api": {
                //target: "http://39.107.227.124:8080/", // 访问数据的计算机域名
                //target:"http://172.17.0.1:8080/",
                //target:"https://xmhjx.qtc.edu.cn/api/",
                //target:"http://172.16.40.61/api/",
                //target:"http://192.168.137.1:8080/",
                target:"http://127.0.0.1:8080/",
                ws: true, // 是否启用websockets
                changOrigin: true, //开启代理
                pathRewrite:{
                    '^/api':''
                }
            }
        }, // string | Object
        before: app => {}
    }
}