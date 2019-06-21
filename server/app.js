var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var loginRouter = require('./routes/login');      //登录
var accountRouter = require('./routes/account');  //账号
var goodsRouter = require('./routes/goods');      //商品
var vipRouter = require('./routes/vip')           //vip


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/************验证token合法性 *******************/
// // 准备一个密钥
// const secret = 'naokimidori';
// // 引入
// const expressJwt = require('express-jwt');

// // 验证token合法性
// app.use(expressJwt({
//   secret
// }).unless({
//   path: ['/login/checklogin']  //除了这些地址，其他的URL都需要验证
// }));

// //拦截器
// app.use(function (err, req, res, next) {
//   //当token验证失败时会抛出如下错误
//   if (err.name === 'UnauthorizedError') {
//     //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
//     res.status(401).send('invalid token...');
//   }
// });

/**************验证token结束******************* */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置路由
app.use('/login', loginRouter);
app.use('/account', accountRouter);
app.use('/goods', goodsRouter);
app.use('/vip', vipRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(9999, () => {
  console.log('服务器启动成功！ 地址：http://127.0.0.1:9999')
})

module.exports = app;
