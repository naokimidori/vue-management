var express = require('express');
var router = express.Router();

// 引入数据库连接模块 测试
const connection = require('./js/conn');


// 同一设置响应头
router.all('*', (req, res, next) => {
    // 设置跨域
    res.header("Access-Control-Allow-Origin", "*");
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


// 会员添加
router.post('/addvip', (req, res) => {
    let { name, level, vipnum, tel } = req.body;
    //准备sql
    let sqlStr = `insert into vip(name,level,vipnum,tel) values('${name}','${level}','${vipnum}','${tel}')`;
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: '会员添加成功！' })
        } else {
            res.send({ code: 1, reason: '会员添加失败！' })
        }
    })
})

// 根据分页刷新页面
router.get('/viplistbypage', (req, res) => {
    let { currentPage, pageSize } = req.query;
    //准备sql
    let sqlStr = `select * from vip order by ctime desc`;
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // 获取数据总条数
        let total = data.length;
        // 计算需要跳过的条数
        let n = (currentPage - 1) * pageSize;
        // 拼接sql
        sqlStr += ` limit ${n}, ${pageSize}`;
        // 执行sql
        connection.query(sqlStr, (err, data) => {
            if (err) throw err;
            res.send({ total, data })
        })
    })

})

// 删除
router.get('/deletevip',(req,res)=>{
    // 接收id
    let { id } = req.query;
    // 准备sql
    let sqlStr = `delete from vip where id=${id}`;
    // 执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code:0,reason:"删除成功！"})
        }else{
            res.send({code:1,reason:"删除失败！"})
        }
    })
})

module.exports = router;
