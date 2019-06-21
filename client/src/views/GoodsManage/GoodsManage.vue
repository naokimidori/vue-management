<template>
  <div class="goods-manage">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goodsmanage' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>商品管理</span>
      </div>

      <!-- body -->
      <!-- 商品查询 -->
      <el-form size="mini" :inline="true" :model="searchForm" class="demo-form-inline">
        <el-button
          type="primary"
          @click="deleteSelected"
          size="small"
          style="margin-right:20px"
        >批量删除</el-button>
        <!-- 分类 -->
        <el-form-item label="选择分类" prop="cateName" style="margin-right:20px">
          <el-select v-model="searchForm.cateName" placeholder="请选择分类">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="零食" value="零食"></el-option>
            <el-option label="日用" value="日用"></el-option>
            <el-option label="食品" value="食品"></el-option>
            <el-option label="家用" value="家用"></el-option>
            <el-option label="酒水" value="酒水"></el-option>
          </el-select>
        </el-form-item>
        <!-- 关键字 -->
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="商品名称或条形码"></el-input>
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 表格 -->
      <el-table
        :data="goodsData"
        style="width: 95%"
        ref="goodsData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column prop="barcode" label="商品条形码" width="100"></el-table-column>
        <el-table-column prop="goodsname" label="商品名称" width="200"></el-table-column>
        <el-table-column prop="classify" label="所属分类" width="150"></el-table-column>
        <el-table-column prop="saleprice" label="售价(元)" width="150"></el-table-column>
        <el-table-column prop="stocknum" label="库存" width="150"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑模态框 -->
      <el-dialog width="440px" title="商品信息修改" :visible.sync="dialogFormVisible">
        <el-form :model="editForm">
          <el-form-item label="商品名称" :label-width="formLabelWidth" style="width:320px">
            <el-input v-model="editForm.goodsname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" :label-width="formLabelWidth">
            <el-select v-model="editForm.classify" placeholder="请选择商品分类">
              <el-option label="零食" value="零食"></el-option>
              <el-option label="日用" value="日用"></el-option>
              <el-option label="食品" value="食品"></el-option>
              <el-option label="家用" value="家用"></el-option>
              <el-option label="酒水" value="酒水"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品售价" :label-width="formLabelWidth" style="width:320px">
            <el-input v-model="editForm.saleprice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品库存" :label-width="formLabelWidth" style="width:320px">
            <el-input v-model="editForm.stocknum" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 5, 8, 20]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { constants } from "crypto";
export default {
  data() {
    return {
      select_cate: "",
      select_word: "",
      currentPage: 1,
      pageSize: 5,
      total: 0,
      goodsData: [],
      dialogFormVisible: false,
      editForm: {
        goodsname: "",
        classify: "",
        saleprice: "",
        stocknum: ""
      },
      formLabelWidth: "100px",
      editId: "",
      selectedId: [],
      searchForm: {
        //搜索框表单
        cateName: "", //分类
        keyword: "" //关键字
      }
    };
  },
  methods: {
    // 分页
    getGoodsList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        cateName: this.searchForm.cateName,
        keyword: this.searchForm.keyword
      };
      this.$http
        .get("/goods/getgoodslist", params)
        .then(res => {
          let { total, data } = res;
          // 总条数
          this.total = total;

          this.goodsData = data;

          if (!data.length && this.currentPage != 1) {
            this.currentPage -= 1;
            // 调用自己
            this.getGoodsList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 模糊搜索
    search() {
      this.getGoodsList();
    },
    // 编辑
    handleEdit(id) {
      // 显示模态框
      this.dialogFormVisible = true;
      //保存id
      this.editId = id;
      let params = {
        id
      };
      // 发送axios
      this.$http
        .get("/goods/goodsedit", params)
        .then(res => {
          this.editForm = res[0];
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存编辑修改
    saveEdit() {
      // 收集参数
      let params = {
        goodsname: this.editForm.goodsname,
        classify: this.editForm.classify,
        saleprice: this.editForm.saleprice,
        stocknum: this.editForm.stocknum,
        id: this.editId
      };
      // 发送axios
      this.$http
        .post("/goods/saveedit", params)
        .then(res => {
          let { code, reason } = res;
          if (code === 0) {
            this.$message.success(reason);
            this.dialogFormVisible = false;
            this.getGoodsList();
          } else if (code === 1) {
            this.$message.error(reason);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除
    handleDelete(id) {
      this.$confirm("将删除此商品, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id
          };
          this.$http
            .get("/goods/deletegoods", params)
            .then(res => {
              let { code, reason } = res;
              if (code === 0) {
                this.$message.success(reason);
                // 刷新页面
                this.getGoodsList();
              } else if (code === 1) {
                this.$message.error(reason);
              } else if (code === 2) {
                this.$alert(reason, "注意", {
                  confirmButtonText: "确定"
                });
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
    // 批量删除
    deleteSelected() {
      if (!this.selectedId.length) {
        this.$message.warning("您还没选择任何数据！");
        return;
      }
      // 提示
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            idArr: this.selectedId
          };
          this.$http
            .get("/goods/delselected", params)
            .then(res => {
              let { code, reason } = res;
              if (code === 0) {
                this.$message.success(reason);
                // 刷新页面
                this.getGoodsList();
              } else if (code === 1) {
                this.$message.error(reason);
              }else if (code === 2) {
                this.$alert(reason, "注意", {
                  confirmButtonText: "确定"
                });
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
    handleSelectionChange(val) {
      this.selectedId = val.map(v => v.id);
    },
    // 切换单页显示条数
    handleSizeChange(v) {
      this.pageSize = v;
      this.getGoodsList();
    },
    //切换当前页
    handleCurrentChange(v) {
      this.currentPage = v;
      this.getGoodsList();
    }
  },
  // 钩子函数
  created() {
    this.getGoodsList();
  }
};
</script>

<style lang='less'>
@import "./goodsmanage.less";
</style>
