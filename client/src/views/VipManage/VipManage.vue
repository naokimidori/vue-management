<template>
  <div class="vip-manage">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">会员中心</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">会员管理</span>
      </div>

      <!-- body -->
      <!-- 用户表格 -->
      <el-table :data="vipData" style="width: 95%" ref="vipData">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="账户" width="150"></el-table-column>
        <el-table-column prop="level" label="用户组" width="150"></el-table-column>
        <el-table-column prop="vipnum" label="会员号码" width="150"></el-table-column>
        <el-table-column prop="tel" label="会员电话" width="150"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">{{ scope.row.ctime | filterTime }}</template>
        </el-table-column>

        <el-table-column label="管理">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[3, 5, 8, 15]"
            :page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      vipData: [
        {}
      ],
      currentPage: 1,
      pageSize: 5,
      total: 20
    };
  },
  methods: {
    // 刷新页面函数
    getVipDataByPage() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      this.$http
        .get("/vip/viplistbypage", params)
        .then(res => {
          let { total, data } = res;
          // 响应数据到页面
          this.total = total;
          this.vipData = data;

          // 解决删除当前页数据后仍留在那一页 不跳回上一页的bug
          if (!data.length && this.currentPage != 1) {
            // 当前页减一
            this.currentPage -= 1;
            // 调用自己
            this.getVipDataByPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除按钮
    handleDelete(id) {
      this.$confirm("此操作将永久删除该会员, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$http
            .get("/vip/deletevip", { id })
            .then(res => {
              let { code, reason } = res;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表
                this.getVipDataByPage();
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 每页显示的条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      // 调用刷新页面
      this.getVipDataByPage();
    },
    // 当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      // 调用
      this.getVipDataByPage();
    }
  },
  created() {
    this.getVipDataByPage();
  },
  filters: {
    filterTime(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang='less'>
.vip-manage {
  height: 100%;
  .box-card {
    // height:100%;
    .el-card__header {
      background: #6f90c2;
      .title {
        color: #fff;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .el-card__body {
      // height:83%;
      padding-top: 3%;
      .el-table {
        margin: 0 auto;
        th,
        td {
          text-align: center;
        }
        td {
          padding: 8px 0;
        }
      }
      .btn,
      .el-pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
