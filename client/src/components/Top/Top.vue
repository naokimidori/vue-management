<template>
  <div class="top">
    <div class="header-right">
      <el-tooltip effect="dark" content="未读消息" placement="bottom">
        <i class="el-icon-bell"></i>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="fullscreen?`取消全屏`:`全屏`"
        placement="bottom"
        class="full-screen"
      >
        <i class="el-icon-rank" @click="toggleScreen"></i>
      </el-tooltip>
      <!-- 用户头像 -->
      <div class="user-pic">
        <img :src="avatarUrl" alt>
      </div>
      <!-- 用户下拉菜单 -->
      <el-dropdown trigger="click" class="drop-down" @command="handleCommand">
        <span class="el-dropdown-link">
          {{account}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
// 引入local
import local from "@/utils/local";
import { setTimeout } from "timers";
// 引入request
import request from "@/utils/request";

export default {
  data() {
    return {
      account: "",
      fullscreen: false,
      avatarUrl: ""
    };
  },
  methods: {
    handleCommand(command) {
      if (command === "personal") {
        this.$router.push("/home/personal");
      } else if (command === "logout") {
        // 清除token
        local.remove("n_a_o_k_i");
        // 提示信息
        this.$message({
          type: "success",
          message: "账户退出成功",
          center: true
        });
        // 路由跳转
        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
      }
    },
    // 获取用户名
    // getAccount() {
    //   request
    //     .get("/login/currentaccount")
    //     .then(res => {
    //       this.account = res;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    toggleScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 获取用户信息
    getUserInfo() {
      // 发送请求 获取用户信息
      this.$http
        .get("/account/userinfo")
        .then(res => {
          let { data } = res;
          let{ account,avatarUrl } = data[0];
          // 接收数据
          this.account = account;
          this.avatarUrl = "http://127.0.0.1:9999" + avatarUrl; // 渲染
          // this.avatarUrl = "http://172.16.12.253:9999" + avatarUrl; // 渲染
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    //在created钩子函数中获取用户名
    // this.getAccount();
    this.getUserInfo();
  }
};
</script>
<style lang="less">
.top {
  height: 100%;
  padding-right: 30px;
  .header-right {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .user-pic {
      margin: 0px 15px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    i {
      color: #fff;
      font-size: 24px;
      margin: 0 10px;
    }
    .full-screen {
      transform: rotate(45deg);
    }
    .drop-down {
      color: #fff;
      i {
        margin: 0;
        font-size: 16px;
      }
    }
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}
</style>
