<template>
  <div id="app" style="">
    <div class="content" :style="bgStyle">
      <router-view v-if="isRouterAlive"></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    components:{
    },
    provide(){
      return{
        reload:this.reload
      }
    },
    data(){
      return{
        isRouterAlive: true,
        bgStyle:{

          backgroundImage:'url('+require("../src/assets/images/3.jpg")+')',
          backgroundRepeat:'repeat-y',
          backgroundSize:"100%",
          minHeight:"1000px"
        }
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      }
    }
  }
</script>
<style>

  @media screen and (max-width: 1200px) {
    .content{
      width:1200px;
      margin: 0 auto;
    }
  }
  @media screen and (min-width: 1201px) {
    .content {
      width: 100%;
      margin: 0 auto;
    }
  }
  body{
    height:100%;
    background: #f9fafc;
    /*background:url('http://img.pptjia.com/image/20180514/08feea1275c93fddd7aa069298d0b90e.jpg') no-repeat;*/
    /*background-size: cover;*/
  }

</style>