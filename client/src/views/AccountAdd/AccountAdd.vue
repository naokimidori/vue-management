<template>
  <div class="account-add">
     <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/accountmanage' }">账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加账号</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>添加管理员账号</span>
      </div>
      <!-- 表单 -->
      <div class="add-form">
        <el-form
          :model="addForm"
          status-icon
          :rules="rules"
          ref="addForm"
          label-width="100px"
          class="demo-addForm"
        >
          <el-form-item label="账户" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="addForm.pass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="addForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <!-- 选择用户组 -->
          <el-form-item label="选择用户组" prop="userGroup">
            <el-select v-model="addForm.userGroup" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通用户" value="普通用户"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('addForm')">添加</el-button>
            <el-button type="warning" @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入工具函数
import { pwdReg } from "@/utils/reg";
// 引入request
import request from "@/utils/request";
// console.log(request.get)

export default {
  data() {
    // 密码输入框验证
    const validatePwd = (rule, value, callback) => {
      // 正则表达式 必须包含至少一位数字和一位字母
      var length = value.length;

      if (value === "") {
        // 非空
        callback(new Error("密码不能为空"));
      } else if (length < 5 || length > 11) {
        // 长度
        callback(new Error("密码长度为5~10位"));
      } else if (!pwdReg(value)) {
        // 正则验证
        callback(new Error("密码必须包含至少一位数字和一位字母"));
      } else {
        // 确认密码不为空 反向验证
        if (this.addForm.checkPass !== "") {
          this.$refs.addForm.validateField("checkPass");
        }
        // 成功
        callback();
      }
    };

    // 确认密码
    const validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      addForm: {
        pass: "",
        checkPass: "",
        name: "",
        userGroup: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在3到10位", trigger: "blur" }
        ],
        pass: [{ required: true, validator: validatePwd, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validateCheckPass, trigger: "blur" }
        ],
        userGroup: [
          { required: true, message: "请选择用户组", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 收集参数  以便发送给后台
          let params = {
            accout: this.addForm.name,
            password: this.addForm.pass,
            userGroup: this.addForm.userGroup
          };

          request
            .post("/account/accountadd", params)
            .then(response => {
              // 接收后台响应的数据
              let { code, reason } = response;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: reason
                });
                // 并跳转
                this.$router.push('/home/accountmanage');
              } else if (code === 1) {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          alert("添加失败！");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang='less'>
@import "./accountadd.less";
</style>
