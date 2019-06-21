<template>
  <div class="home">
    <el-container>
      <!-- 左侧栏 -->
      <!-- <el-aside> -->
      <LeftNav></LeftNav>
      <!-- </el-aside> -->
      <!-- 大容器 -->
      <el-container>
        <!-- 头部 -->
        <el-header>
          <Top ref="top"></Top>
        </el-header>
        <!-- 主要内容 -->
        <el-main>
          <!-- 路由出口 -->
          <router-view @headimg="fn"></router-view>
        </el-main>
        <!-- 页脚 -->
        <el-footer>
          <Footer></Footer>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 引入组件
import LeftNav from "@/components/LeftNav/LeftNav.vue";
import Top from "@/components/Top/Top.vue";
import Footer from "@/components/Footer/Footer.vue";

export default {
  // 注册组件
  components: {
    LeftNav,
    Top,
    Footer
  },
  methods: {
    fn() {
      this.$refs.top.getUserInfo();
      // console.log(this.$refs.top.getUserInfo)
    }
  }
};
</script>

<style lang='less'>
@import "./home.less";
</style>
