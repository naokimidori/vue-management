<template>
  <div class="system-info">
    <!-- 面包屑 -->
      <el-breadcrumb separator="/" style="margin-bottom:10px">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/systeminfo' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统信息</el-breadcrumb-item>
      </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">系统信息</span>
      </div>

      <!-- body -->
      
      <el-alert title="欢迎登陆开欣超市后台管理系统！" type="success" show-icon></el-alert>

      <el-alert title="有待处理的商品信息！" type="info" show-icon></el-alert>

      <!-- 卡片 -->
      <el-row :gutter="30">
        <el-col :span="12">
          <!-- 左侧 -->
          <el-card class="left-box-card">
            <div slot="header" class="clearfix">
              <i class="el-icon-trophy" style="color:#ffee00;margin-right:5px;"></i>
              <span>上周销售排行</span>
            </div>
            <!-- echarts -->
            <div id="rankBox" style="width:100%;height:280px"></div>
          </el-card>
        </el-col>
        <!-- 右侧 -->
        <el-col :span="12">
          <el-card class="right-box-card">
            <div slot="header" class="clearfix">
              <i class="el-icon-info" style="color:#fb7e36;margin-right:5px;"></i>
              <span>缺货商品</span>
            </div>
            <el-table :data="lackData" style="width: 100%">
              <el-table-column prop="goodsName" label="商品名称" width="150"></el-table-column>
              <el-table-column prop="inventory" label="库存" width="150"></el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text">入库</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lackData: [
        { goodsName: "可口可乐", inventory: "100" },
        { goodsName: "牙刷", inventory: "50" },
        { goodsName: "可口可乐", inventory: "100" },
        { goodsName: "牙刷", inventory: "50" }
      ]
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
    }
  },
  mounted() {
    let rank = this.echarts.init(document.getElementById("rankBox"), "light");
    // 配置值
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ["家用电器", "酒水饮料", "日常用品", "零食玩具", "食品肉类"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "value"
      },
      yAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      },
      series: [
        {
          name: "家用电器",
          type: "bar",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: [220, 232, 201, 234, 190, 230, 310]
        },
        {
          name: "酒水饮料",
          type: "bar",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: [420, 402, 401, 444, 490, 430, 420]
        },
        {
          name: "日常用品",
          type: "bar",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: [520, 582, 491, 534, 390, 630, 410]
        },
        {
          name: "零食玩具",
          type: "bar",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: [250, 312, 301, 334, 390, 430, 310]
        },
        {
          name: "食品肉类",
          type: "bar",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          data: [720, 932, 701, 834, 990, 1250, 1320]
        }
      ]
    };

    // 使用
    rank.setOption(option);
  }
};
</script>

<style lang='less'>
@import "./systeminfo.less";
</style>
