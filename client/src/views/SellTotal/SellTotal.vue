<template>
  <div class="sell-total">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">统计管理</el-breadcrumb-item>
      <el-breadcrumb-item>销售统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>销售统计</span>
      </div>
      <!-- 准备容器来装echarts -->
      <div id="main" style="width:100%;height:460px"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  mounted() {
    let selltotal = this.echarts.init(document.getElementById("main"),'light');
    // 配置值
    let option = {
      title: {
        text: "销售额和净利润"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["销售额", "净利润"]
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          data: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "销售额",
          type: "bar",
          data: [3091, 2412, 5542, 4923, 4396, 6914, 4923],
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ]
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }]
          }
        },
        {
          name: "净利润",
          type: "bar",
          data: [1221, 998, 2478, 2265, 2134, 2899, 1859],
          markPoint: {
            data: [
              { name: "年最高", value: 182.2, xAxis: 7, yAxis: 183 },
              { name: "年最低", value: 2.3, xAxis: 11, yAxis: 3 }
            ]
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }]
          }
        }
      ]
    };

    // 使用
    selltotal.setOption(option);
  }
};
</script>

<style lang='less'>
@import "./selltotal.less";
</style>
