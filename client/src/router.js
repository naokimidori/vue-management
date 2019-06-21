import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({

  routes: [
    // 重定向
    {
      path:'/',
      redirect:'/login'
    },
    // 登录
    {
      path:'/login',
      component:()=>import('./views/Login/Login.vue')
    },
    // 主页面
    {
      path:'/home',
      component:()=>import('./views/Home/Home.vue'),
      redirect:'/home/systeminfo',
      // 子路由
      children:[
        // 系统信息
        {path:'/home/systeminfo',component:()=>import('./views/SystemInfo/SystemInfo.vue')},
        // 个人中心
        {path:'/home/personal',component:()=>import('./views/Personal/Personal.vue')},
        // 账户管理
        {path:'/home/accountmanage',component:()=>import('./views/AccountManage/AccountManage.vue')},
        // 添加账户
        {path:'/home/accountadd',component:()=>import('./views/AccountAdd/AccountAdd.vue')},
        // 密码修改
        {path:'/home/passwordmodify',component:()=>import('./views/PasswordModify/PasswordModify.vue')},
        // 商品管理
        {path:'/home/goodsmanage',component:()=>import('./views/GoodsManage/GoodsManage.vue')},
        // 商品添加
        {path:'/home/goodsadd',component:()=>import('./views/GoodsAdd/GoodsAdd.vue')},
        // 销售统计
        {path:'/home/selltotal',component:()=>import('./views/SellTotal/SellTotal.vue')},
        // 进货统计
        {path:'/home/stocktotal',component:()=>import('./views/StockTotal/StockTotal.vue')},
        // 会员管理
        {path:'/home/vipmanage',component:()=>import('./views/VipManage/VipManage.vue')},
        // 会员添加
        {path:'/home/vipadd',component:()=>import('./views/VipAdd/VipAdd.vue')},
      ]
    }
  ]
})
