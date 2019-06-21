<template>
  <div class="account-manage">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/accountmanage' }">账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>账号管理</span>
      </div>

      <!-- 用户表格 -->
      <el-table
        :data="accountData"
        style="width: 95%"
        ref="accountData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="account" label="账户" width="200"></el-table-column>
        <el-table-column prop="user_group" label="用户组" width="200"></el-table-column>
        <el-table-column label="创建时间" width="300">
          <template slot-scope="scope">{{ scope.row.ctime | filterTime }}</template>
        </el-table-column>

        <el-table-column label="管理">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑模态框 -->
      <el-dialog width="420px" title="修改账号" :visible.sync="dialogFormVisible">
        <el-form :model="editDialogForm" :rules="rules" ref="editDialogForm">
          <el-form-item prop="account" style="width:320px" label="账号" :label-width="formLabelWidth">
            <el-input v-model="editDialogForm.account" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="user_group" label="用户组" :label-width="formLabelWidth">
            <el-select v-model="editDialogForm.user_group" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通用户" value="普通用户"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-row>
        <!-- 批量删除 -->
        <el-col :span="2" class="btn">
          <el-button @click="delSelectedAccount" size="small">批量删除</el-button>
        </el-col>
        <!-- 取消选择 -->
        <el-col :span="2" class="btn">
          <el-button @click="toggleSelection()" size="small">取消选择</el-button>
        </el-col>
        <!-- 分页 -->
        <el-col :span="20">
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
// 引入request
import request from "@/utils/request";
// 引入moment模块
import moment from "moment";

export default {
  data() {
    return {
      accountData: [],
      total: 0, //数据总条数
      currentPage: 1, //当前页
      pageSize: 5, //每页条数
      editDialogForm: {
        //修改表单模态
        account: "",
        user_group: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入账户名", trigger: "blur" },
          { min: 3, max: 10, message: "账户名为3~10位", trigger: "blur" }
        ],
        user_group: [{ required: true }]
      },
      formLabelWidth: "100px", //
      dialogFormVisible: false, //模态框显示隐藏
      editId: "", //编辑按钮id
      selectedId: "" //选中状态的id
    };
  },
  methods: {
    // 封装刷新页面函数
    // getAccountList() {
    //   request
    //     .get("/account/accountlist")
    //     .then(res => {
    //       // console.log(res)
    //       this.accountData = res;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // 依据分页数据来刷新页面
    getAccountListByPage() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      request
        .get("/account/accountlistbypage", params)
        .then(res => {
          let { total, data } = res;
          // 响应数据到页面
          this.total = total;
          this.accountData = data;

          // 解决删除当前页数据后仍留在那一页 不跳回上一页的bug
          if (!data.length && this.currentPage != 1) {
            // 当前页减一
            this.currentPage -= 1;
            // 调用自己
            this.getAccountListByPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑
    handleEdit(id) {
      // 点击编辑显示模态框
      this.dialogFormVisible = true;
      // 保存id
      this.editId = id;
      // 将id值发给后台
      request
        .get("/account/editaccount", { id })
        .then(res => {
          // 将账号和用户组数据回填至模态框中的表单
          this.editDialogForm.account = res[0].account;
          this.editDialogForm.user_group = res[0].user_group;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 模态框点击确定保存修改
    saveEdit() {
      // 获取表单验证
      this.$refs.editDialogForm.validate(valid => {
        // 合法
        if (valid) {
          // 关闭模态框
          this.dialogFormVisible = false;
          // 收集参数
          let params = {
            account: this.editDialogForm.account,
            user_group: this.editDialogForm.user_group,
            id: this.editId
          };

          // 发送post请求
          request
            .post("/account/saveedit", params)
            .then(res => {
              let { code, reason } = res;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新页面
                this.getAccountListByPage();
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          //不合法
          console.log("修改失败");
        }
      });
    },
    // 删除
    handleDelete(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          request
            .get("/account/delete", { id })
            .then(res => {
              let { code, reason } = res;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表
                this.getAccountListByPage();
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
      this.getAccountListByPage();
    },
    // 当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      // 调用
      this.getAccountListByPage();
    },

    // 选中状态的id
    handleSelectionChange(val) {
      this.selectedId = val.map(v => v.id);
    },
    // 批量删除
    delSelectedAccount() {
      // 如果没有选中
      if (!this.selectedId.length) {
        this.$message.error("您没有选中任何数据");
        return;
      } else {
        // 弹出是否删除提示框
        this.$confirm("此操作将批量删除数据, 是否继续?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 收集数据
            let params = {
              idArr: this.selectedId
            };
            // 发送批量删除请求
            request
              .get("/account/delselected", params)
              .then(res => {
                let { code, reason } = res;
                if (code === 0) {
                  this.$message.success(reason);
                  // 刷新页面
                  this.getAccountListByPage();
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
      }
    },

    // 取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.accountData.toggleRowSelection(row);
        });
      } else {
        this.$refs.accountData.clearSelection();
      }
    }
  },
  // 钩子函数 发送axios
  created() {
    // 调用刷新页面函数
    this.getAccountListByPage();
  },
  filters: {
    filterTime(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang='less'>
@import "./accountmanage.less";
</style>
