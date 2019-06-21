<template>
  <div class="vip-add">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">会员中心</el-breadcrumb-item>
      <el-breadcrumb-item>会员添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">会员添加</span>
      </div>

      <!-- body -->
      <el-form
        :model="addVipForm"
        status-icon
        :rules="rules"
        ref="addVipForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 会员姓名-->
        <el-form-item label="会员姓名" prop="name">
          <el-input type="text" v-model="addVipForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 选择会员等级 -->
        <el-form-item label="会员等级" prop="level">
          <el-select v-model="addVipForm.level" placeholder="请设置会员等级">
            <el-option label="普通会员" value="普通会员"></el-option>
            <el-option label="黄金会员" value="黄金会员"></el-option>
            <el-option label="钻石会员" value="钻石会员"></el-option>
            <el-option label="至尊会员" value="至尊会员"></el-option>
          </el-select>
        </el-form-item>
        <!-- 会员卡号 -->
        <el-form-item label="会员卡号" prop="vipnum">
          <el-input type="text" v-model="addVipForm.vipnum" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 电话号码 -->
        <el-form-item label="电话号码" prop="tel">
          <el-input type="text" v-model="addVipForm.tel" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('addVipForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addVipForm: {
        name: "",
        level: "",
        vipnum: "",
        tel: ""
      },
      rules: {
        name: [{ required: true, message: "请输入会员名", trriger: "blur" }],
        level: [{ required: true, message: "请选择会员等级", trriger: "blur" }],
        vipnum: [
          { required: true, message: "请输入会员编号", trriger: "blur" }
        ],
        tel: [{ required: true, message: "请输入会员电话", trriger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 收集参数  以便发送给后台
          let params = {
            name: this.addVipForm.name,
            level: this.addVipForm.level,
            vipnum: this.addVipForm.vipnum,
            tel: this.addVipForm.tel
          };
          this.$http
            .post("/vip/addvip", params)
            .then(response => {
              // 接收后台响应的数据
              let { code, reason } = response;
              if (code === 0) {
                this.$message({
                  type: "success",
                  message: reason
                });
                // 并跳转
                this.$router.push("/home/vipmanage");
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
    }
  }
};
</script>

<style lang='less'>
.vip-add {
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
      .el-form {
        width: 300px;
      }
    }
  }
}
</style>
