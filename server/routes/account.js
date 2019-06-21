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
        res.status(401).send('token不合法!');
    }
})

/**************验证token结束******************* */

/* 添加账号路由 */
router.post('/accountadd', (req, res) => {
    // 接收数据
    let { accout, password, userGroup } = req.body;
    // 设置sql语句
    let sqrStr = `insert into account(account, password, user_group) values('${accout}','${password}','${userGroup}')`;
    // console.log(sqrStr) //打印测试！！！！
    // 执行sql
    connection.query(sqrStr, (err, data) => {
        // 错误优先
        if (err) throw err;
        // 如果data.affectedRows > 0 表示成功！
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: '添加成功！' })
        } else {
            res.send({ code: 1, reason: '添加失败！' })
        }
    })

})

/* 账号列表路由 */
router.get('/accountlist', (req, res) => {

    // 准备sql语句
    let sqrStr = `select * from account order by ctime desc`;
    // 执行sql
    connection.query(sqrStr, (err, data) => {
        if (err) throw err;
        // console.log(data)
        res.send(data);
    })
})

/* 依据页面来刷新列表路由 */
router.get('/accountlistbypage', (req, res) => {
    let { currentPage, pageSize } = req.query;
    //准备sql
    let sqlStr = `select * from account order by ctime desc`;
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

/* 删除按钮路由 */
router.get('/delete', (req, res) => {
    // 接收id
    let { id } = req.query;
    // 准备sql
    let sqlStr = `delete from account where id=${id}`;
    // console.log(sqlStr) //测试sql是否正确
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: "删除成功！" })
        } else {
            res.send({ code: 1, reason: "删除失败！" })
        }
    })
})

/* 编辑按钮路由 */
router.get('/editaccount', (req, res) => {
    // 接收id
    let { id } = req.query;
    // 准备sql
    let sqlStr = `select * from account where id=${id}`;
    // console.log(sqlStr)
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send(data);
    })
})

/* 保存编辑路由 */
router.post('/saveedit', (req, res) => {
    // 获取前端发来的数据
    let { id, account, user_group } = req.body;
    // 准备sql语句
    let sqrStr = `update account set account='${account}',user_group='${user_group}' where id=${id}`;
    // console.log(sqrStr)
    //执行sql
    connection.query(sqrStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: '账户信息修改成功！' })
        } else {
            res.send({ code: 1, reason: '账户信息修改失败！' })
        }
    })
})

/* 批量删除路由 */
router.get('/delselected', (req, res) => {
    // 接收参数
    let { idArr } = req.query;
    // 准备sql
    let sqlStr = `delete from account where id in (${idArr})`;
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: '删除数据成功！' })
        } else {
            res.send({ code: 1, reason: '删除数据失败！' })
        }
    })
})

/* 获取原密码路由 */
router.post('/passwordmodify', (req, res) => {
    let { oldPassword } = req.body;
    if (oldPassword === req.user.password) {
        res.send({ code: 0, reason: "旧密码正确" })
    } else {
        res.send({ code: 1, reason: "旧密码错误,请重新输入！" })
    }
})

/* 设置新密码 */
router.post('/newpassword', (req, res) => {
    let { newPassword } = req.body;
    let id = req.user.id;
    // 准备sql
    let sqlStr = `update account set password='${newPassword}' where id=${id}`;
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;

        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: "密码修改成功！请重新登录" })
        } else {
            res.send({ code: 1, reason: "密码修改失败！" })
        }
    })
})

/* 用户信息 */
router.get('/userinfo', (req, res) => {
    let id = req.user.id;
    const sqlStr = `select * from account where id=${id}`;
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
        res.send({data})
    })
})

/* -------------上传开始-------------- */

// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
    var file = req.file;
    // 文件名
    let fileName = file.filename;
    // 拼接文件路径
    let avatarUrl = '/upload/' + fileName

    // 构造sql
    const sqlStr = `update account set avatarUrl = '${avatarUrl}' where id=${req.user.id}`;
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: "上传成功", avatarUrl })
        } else {
            res.send({ code: 1, reason: "上传失败" })
        }
    })
})

/* -------------上传结束--------------- */

/* 获取用户组 */ 
router.get('/role', (req, res) => {
	res.send({role: req.user.user_group})
})


module.exports = router;