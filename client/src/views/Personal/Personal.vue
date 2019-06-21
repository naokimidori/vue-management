<template>
  <div class="personal">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/systeminfo' }">系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">个人中心</span>
      </div>

      <!-- body -->
      <div>
        <p style='font-weight:bold;'>账户名：{{userInfo.account}}</p>
        <p>账户ID：{{userInfo.id}}</p>
        <p>用户组：{{userInfo.user_group}}</p>
        <p>创建时间：{{userInfo.ctime | filterCtime}}</p>
      </div>
      <el-divider></el-divider>
      <div>更改头像：</div>
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :http-request="uploadAvatar"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      userInfo: {},
      imageUrl: ""
    };
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      // 发送请求 获取用户信息
      this.$http
        .get("/account/userinfo")
        .then(res => {
          // console.log(res)
          let {data} = res;
          // 接收数据
          this.userInfo = data[0]; // 渲染
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 头像上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 头上上传之前限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //上传函数
    uploadAvatar(file) {
      // 创建formData实例对象
      let formData = new FormData();

      // 把文件信息添加进如对象
      formData.append("file", file.file);

      // 发送文件信息给后端
      axios
        .post("/account/uploadavatar", formData)
        .then(response => {
          // 获取地址
          let { avatarUrl } = response.data;
          // 回填
          this.imageUrl = "http://127.0.0.1:9999" + avatarUrl;
          // this.imageUrl = "http://172.16.12.253:9999" + avatarUrl;
          // 传递给父组件
          this.$emit("headimg");
          
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getUserInfo();
  },
  filters: {
    filterCtime(ctime) {
      return moment(ctime).format("YYYY-MM-DD");
    }
  }
};
</script>

<style lang='less'>
.personal {
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
      p {
        margin-bottom: 15px;
        font-size: 20px;
      }
    }
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
