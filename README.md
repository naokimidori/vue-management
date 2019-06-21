# vue-management
此项目是基于 vue2 + ElementUI + Nodejs + Mysql 的某超市后台管理系统
# About
>项目开发环境：windows10 + nodejs 10.15.3 + vscode

>后台数据库是Mysql 需创建本地数据库及相应的表配合使用
# 功能列表
- [x] 登陆/注销 
- [x] 添加管理员账户
- [x] 管理管理员账户
- [x] 账户密码修改 
- [x] 添加商品
- [x] 管理商品 
- [x] 添加会员 
- [x] 管理会员 
- [x] 上传头像
- [x] 引入图表
- [x] 权限验证

***

## FE部分
**技术栈** 
+   vue
+   vue-router
+   vue-cli 
+   Element-UI
+   axios 
+   echarts
+   ES6
+   less

**项目运行**

```
npm install 或 yarn

npm run serve 或 yarn serve

```
***

## BE部分
**技术栈**:   
+   Nodejs
+   express-generator
+   Mysql
+   jsonwebtoken
+   express-jwt

**项目运行**

```
npm install

npm start

```

# Mysql相关

>本地需用mysql创建对应的表

>下面提供建表的语句

>推荐使用 [navicat](https://www.navicat.com.cn/) 可视化工具 

```
//建表 account

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ctime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `account` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `user_group` varchar(50) DEFAULT NULL,
  `avatarUrl` text,
  PRIMARY KEY (`id`)
)
```
```
//建表 goods

CREATE TABLE `goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classify` varchar(50) DEFAULT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `goodsname` varchar(50) DEFAULT NULL,
  `inprice` varchar(50) DEFAULT NULL,
  `saleprice` varchar(50) DEFAULT NULL,
  `stocknum` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
)
```
```
//建表 vip

CREATE TABLE `vip` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `vipnum` varchar(50) DEFAULT NULL,
  `tel` varchar(50) DEFAULT NULL,
  `ctime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
```
# License

> MIT





