import Vue from 'vue'
import App from './App.vue'
import Global from "./plugins/Global";
import './plugins/element.js'
import router from './router'
import Maxios from './plugins/axios-config'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import Video from 'video.js'
import Pdf from 'vue-pdf'
import 'video.js/dist/video-js.css'
import echarts from 'echarts'
import 'vue2-animate/dist/vue2-animate.min.css'


Vue.prototype.$echarts = echarts;
Vue.prototype.Global = Global;

var http = axios.create({
  baseURL:"/api",
  headers:{
    "Content-type":"form-data"
  }
});

Vue.prototype.$axios=Maxios;
Vue.prototype.$http=http;

Vue.component('pdf',Pdf);

Vue.config.productionTip = false;
Vue.use(router);
Vue.prototype.$video = Video;
Vue.use(VueCookies);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
