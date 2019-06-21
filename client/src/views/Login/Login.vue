<template>
  <div class="loginForm">
    <div class="login-container">
      <h1 class="title">
        <i class="el-icon-shopping-cart-2"></i>
        开欣超市管理系统
      </h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

// 引入工具函数
import { pwdReg } from "@/utils/reg";
//引入local
import local from "@/utils/local";

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
        if(this.ruleForm.checkPass !== ''){
          this.$refs.ruleForm.validateField('checkPass');
        }
        // 成功
        callback();
      }
    };

    // 确认密码
    const validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        name: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "账户名为3~10位", trigger: "blur" }
        ],
        pass: [
          { required: true, validator: validatePwd, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validateCheckPass, trigger: "blur" }
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
            account : this.ruleForm.name,
            password : this.ruleForm.pass
          }
          this.$http.post('/login/checklogin',params)
          .then(res=>{
            let { code, reason, token } = res;
            if(code===0){
              // 将token存入localStorage
              local.save('n_a_o_k_i',token)
              // 成功提示
              this.$message.success(reason);
              // 路由跳转
              this.$router.push('/home');
            }else if(code === 1){
              this.$message.error(reason);
            }
          })
          .catch(err=>{
            console.log(err)
          })
        } else {
          alert("登录失败！");
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
// 引入样式
@import "./login.less";
</style>
