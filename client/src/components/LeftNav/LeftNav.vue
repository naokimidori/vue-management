<template>
  <div class="left-nav">
    <div class="logoBox">
      <div class="kx">
        <img src="@/assets/img/logo.png" alt @click="collapseChage">开欣超市
      </div>
    </div>

    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#324157"
      text-color="#fff"
      active-text-color="yellowgreen"
      unique-opened
      router
      :collapse="isCollapse"
    >
      <el-submenu :index=" (key+1)+'' " v-for="(menu,key) in menus" :key="key">
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{ menu.title }}</span>
        </template>
        <el-menu-item :index="v.path" v-for="(v,i) in menu.submenus" :key="i">{{ v.subtitle }}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      // 导航数据菜单
      menus: []
    };
  },
  methods: {
    collapseChage() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    this.$http
      .get("/account/role")
      .then(res => {
        let { role } = res;
        // 定义导航数据
        let nav = [
          // 系统管理
          {
            icon: "el-icon-setting",
            title: "系统管理",
            roles: ["超级管理员", "普通用户"],
            submenus: [
              { path: "/home/systeminfo", subtitle: "系统信息" },
              { path: "/home/personal", subtitle: "个人中心" }
            ]
          },
          // 账号管理
          {
            icon: "el-icon-suitcase",
            title: "账号管理",
            roles: ["超级管理员"],
            submenus: [
              { path: "/home/accountmanage", subtitle: "账号管理" },
              { path: "/home/accountadd", subtitle: "添加账号" },
              { path: "/home/passwordmodify", subtitle: "密码修改" }
            ]
          },
          // 商品管理
          {
            icon: "el-icon-goods",
            title: "商品管理",
            roles: ["超级管理员", "普通用户"],
            submenus: [
              { path: "/home/goodsmanage", subtitle: "商品管理" },
              { path: "/home/goodsadd", subtitle: "添加商品" }
            ]
          },
          // 统计管理
          {
            icon: "el-icon-edit-outline",
            title: "统计管理",
            roles: ["超级管理员"],
            submenus: [
              { path: "/home/selltotal", subtitle: "销售统计" },
              { path: "/home/stocktotal", subtitle: "进货统计" }
            ]
          },
          // 会员中心
          {
            icon: "el-icon-user-solid",
            title: "会员中心",
            roles: ["超级管理员"],
            submenus: [
              { path: "/home/vipmanage", subtitle: "会员管理" },
              { path: "/home/vipadd", subtitle: "会员添加" }
            ]
          }
        ];
        // 过滤
        this.menus = nav.filter(v=>v.roles.includes(role))
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="less">
.left-nav {
  // width:200px;
  background: #324157;
  .logoBox {
    height: 60px;
    background: #242f42;
    .kx {
      position: fixed;
      top: 10px;
      left: 15px;
      color: #fff;
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      img {
        width: 40px;
        height: 40px;
        margin-right: 5px;
      }
    }
  }
  & > .el-menu:not(.el-menu--collapse) {
    width: 200px;
    margin-top: 20px;
    border-right: none;
    i {
      color: #fff;
    }
  }
  .el-menu--collapse {
    margin-top: 20px;
    border-right: none;
    i {
      color: #fff;
    }
  }
}
</style>

