<template>
  <div class="goods-add">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goodsmanage' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="title">
        <span>商品添加</span>
      </div>
      <!-- 表单 -->

      <el-form
        :model="addGoodsForm"
        status-icon
        :rules="rules"
        ref="addGoodsForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 选择商品分类 -->
        <el-form-item label="选择分类" prop="classify">
          <el-select v-model="addGoodsForm.classify" placeholder="请选择商品分类">
            <el-option label="零食" value="零食"></el-option>
            <el-option label="日用" value="日用"></el-option>
            <el-option label="食品" value="食品"></el-option>
            <el-option label="家用" value="家用"></el-option>
            <el-option label="酒水" value="酒水"></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品条形码 -->
        <el-form-item label="商品条形码" prop="barCode">
          <el-input type="text" v-model.number="addGoodsForm.barCode" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 商品名称-->
        <el-form-item label="商品名称" prop="goodsName">
          <el-input type="text" v-model="addGoodsForm.goodsName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 商品进价 -->
        <el-form-item label="商品进价" prop="inPrice">
          <el-input type="text" v-model="addGoodsForm.inPrice" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 商品售价 -->
        <el-form-item label="商品售价" prop="salePrice">
          <el-input type="text" v-model="addGoodsForm.salePrice" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 入库数量 -->
        <el-form-item label="入库数量" prop="stockNum">
          <el-input type="text" v-model="addGoodsForm.stockNum" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('addGoodsForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addGoodsForm: {
        classify: "",
        barCode: "",
        goodsName: "",
        inPrice: "",
        salePrice: "",
        stockNum: ""
      },
      rules: {
        classify: [{ required: true }],
        barCode: [{ required: true }],
        goodsName: [{ required: true }],
        inPrice: [{ required: true }],
        salePrice: [{ required: true }],
        stockNum: [{ required: true }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 收集参数
          let params = {
            classify: this.addGoodsForm.classify,
            barCode: this.addGoodsForm.barCode,
            goodsName: this.addGoodsForm.goodsName,
            inPrice: this.addGoodsForm.inPrice,
            salePrice: this.addGoodsForm.salePrice,
            stockNum: this.addGoodsForm.stockNum
          };
          // 发送axios
          this.$http
            .post("/goods/goodsadd", params)
            .then(res => {
              let { code, reason } = res;
              if( code === 0 ){
                this.$message.success(reason)
                // 跳转路由                 
                this.$router.push('/home/goodsmanage')
              }else if(code === 1){
                this.$message.error(reason)
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>

<style lang='less'>
@import "./goodsadd.less";
</style>
