import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入axios
// import axios from 'axios'
// // 挂载axios到vue的原型
// Vue.prototype.$http = axios;

// 引入echarts 并挂载原型
import echarts from 'echarts';
Vue.prototype.echarts = echarts;


// 重置样式 和 公用样式
import './assets/css/reset.css'
import './assets/css/common.css'

// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入local
import local from "@/utils/local";
import request from "@/utils/request";

Vue.prototype.$http = request;

Vue.use(ElementUI);

Vue.config.productionTip = false

// Vue路由守卫
router.beforeEach((to, from, next)=>{
  // 获取浏览器token
  const token = local.get('n_a_o_k_i');
  // 如果有token 直接放行
  if(token){
    next();
  }else{ //没有token
    // 如果没有登录 到login的路由放行
    if(to.path === '/login'){
      next();
    }else{
      // 如果要去其他页面，直接跳转至登录
      next('/login');
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
