export default{
    baseURL:'http://pic1.win4000.com/wallpaper/c/53cdd1f7c1f21.jpg',
    baseDownloadUrl:"/api/file/downloadFile?",
    baseToken:"",
    setBaseToken(token){
        this.baseToken = token;
    },
    getBaseToken(){
        return this.baseToken;
    }
}