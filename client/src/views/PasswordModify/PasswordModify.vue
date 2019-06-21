<template>
  <div class="password-modify">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/accountmanage' }">账号管理</el-breadcrumb-item>
      <el-breadcrumb-item>密码修改</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>密码修改</span>
      </div>
      <!-- 表单 -->
      <div class="pwd-form">
        <el-form
          :model="pwdForm"
          status-icon
          :rules="rules"
          ref="pwdForm"
          label-width="100px"
          class="demo-pwdForm"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input type="password" v-model="pwdForm.oldPassword"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="pwdForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="pwdForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('pwdForm')">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入工具函数
import { pwdReg } from "@/utils/reg";
import { setTimeout } from 'timers';
import local from '@/utils/local';

export default {
  data() {
    // 旧密码验证
    const validateOldpwd = (rule, value, callback) => {
      // 发送axios
      this.$http.post('/account/passwordmodify',{ oldPassword: value })
      .then(res=>{
        let { code, reason } = res;
        if( code === 0 ){
          callback()
        }else if( code === 1){
          callback(new Error(reason))
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }
    // 新密码输入框验证
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
        if (this.pwdForm.checkPass !== "") {
          this.$refs.pwdForm.validateField("checkPass");
        }
        // 成功
        callback();
      }
    };

    // 确认密码
    const validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      pwdForm: {
        oldPassword:"",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPassword: [
          { required: true,  validator: validateOldpwd, trigger: "blur" }
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
            newPassword: this.pwdForm.pass
          };
          // console.log(params)
          this.$http.post('/account/newpassword',params)
          .then(res=>{
            let {code,reason} = res;
            if(code === 0){
              // 清除token
              local.remove('n_a_o_k_i');
              // 提示信息
              this.$message.success(reason);
              // 跳转至登录界面
              setTimeout(()=>{
                this.$router.push('/login')
              },1000)
            }else if(code === 1){
              this.$message.error(reason)
            }
          })
          .catch(err=>{
            console.log(err)
          })
          
        } else {
          alert("密码修改失败！");
          return false;
        }
      });
    }
  }
};
</script>

<style lang='less'>
@import './passwordmodify.less';
</style>
