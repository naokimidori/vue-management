var express = require('express');
var router = express.Router();

// 引入数据库连接模块 测试
const connection = require('./js/conn');

//引入jwt
const jwt = require('jsonwebtoken');

// 同一设置响应头
router.all('*',(req,res,next)=>{
    // 设置跨域
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "authorization");
    // 出口
    next();
})


/************验证token合法性 *******************/
// 准备一个密钥
const secretKey = 'naokimidori';
// 引入
const expressJwt = require('express-jwt');

// 验证token合法性
router.use(expressJwt({
    secret: secretKey
}).unless({
    path: ['/login/checklogin']  // 除了这些地址，其他的URL都需要验证
}));

router.use(function (err, req, res, next) {
    // 如果前端没有token或者是错误的token 就会抛出如下错误
    if (err.name === 'UnauthorizedError') {
        // 响应给前端token无效的信息
        res.status(401).send('token不合法...');
    }
})

/**************验证token结束******************* */


/* 登录验证 */
router.post('/checklogin',(req,res)=>{
  // 接收参数
  let { account, password } = req.body;
  // 准备sql
  let sqlStr = `select * from account where account='${account}' and password='${password}'`;
  // console.log(sqlStr);
  // 执行sql
  connection.query(sqlStr,(err,data)=>{
    if(err) throw err;
    if(data.length){
      // 登录成功时同时响应一个token给前端
      const token = jwt.sign(Object.assign({},data[0]),secretKey,{expiresIn: 3600})

      res.send({code:0,reason:'欢迎您！登录成功！',token})
    }else{
      res.send({code:1,reason:'登录失败！请检查用户名和密码！'})
    }
  })
})

/* 获取当前用户名 */
router.get('/currentaccount',(req,res)=>{
  res.send(req.user.account)
})

module.exports = router;
