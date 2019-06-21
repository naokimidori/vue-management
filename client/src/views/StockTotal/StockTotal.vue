<template>
  <div class="stock-total">
     <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>进货统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>进货统计</span>
      </div>
      <!-- 准备容器来装echarts -->
      <div id="main" style="width:100%;height:460px"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  mounted() {
    let selltotal = this.echarts.init(document.getElementById("main"));
    // 配置值
    let option = {
      title: {
        text: "进货统计"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      legend: {
        data: ["上周", "本周"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: "category",
        data: ["家用电器", "酒水饮料", "日常用品", "零食玩具", "食品肉类"]
      },
      series: [
        {
          name: "上周",
          type: "bar",
          data: [3248, 5489, 6834, 6970, 8629],
        },
        {
          name: "本周",
          type: "bar",
          data: [3492, 5125, 6256, 7123,8941]
        }
      ]
    };

    // 使用
    selltotal.setOption(option);
  }
};
</script>

<style lang='less'>
@import "./stocktotal.less";
</style>
