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

/* 添加商品 */
router.post('/goodsadd', (req, res) => {
    let { classify, barCode, goodsName, inPrice, salePrice, stockNum } = req.body;
    // 准备sql
    let sqlStr = `insert into goods(classify,barcode,goodsname,inprice,saleprice,stocknum) values('${classify}','${barCode}','${goodsName}','${inPrice}','${salePrice}',${stockNum})`;
    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: "商品添加成功！" })
        } else {
            res.send({ code: 1, reason: "商品添加失败！" })
        }
    })
})

/* 分页渲染页面路由 */
router.get('/getgoodslist', (req, res) => {
    let { currentPage, pageSize, cateName, keyword } = req.query;

    // 准备sql
    let sqlStr = `select * from goods where 1=1`;
    //拼接sql

    if (cateName !== '全部' && cateName !== '') {
        sqlStr += ` and classify='${cateName}'`;
    }
    if (keyword !== '') {
        sqlStr += ` and (goodsname like '%${keyword}%' or barcode like '%${keyword}%')`
    }
    // 拼接排序
    sqlStr += ` order by id desc`


    // 执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        //获取总条数
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

/* 删除路由 */
router.get('/deletegoods', (req, res) => {
    let { id } = req.query;
    let user_group = req.user.user_group;
    // 判断是否是普通用户
    if (user_group === '普通用户') {
        res.send({ code: 2, reason: '对不起,您没有此操作权限！' })
    } else {
        // 准备sql
        let sqlStr = `delete from goods where id=${id}`;
        // 执行sql
        connection.query(sqlStr, (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                res.send({ code: 0, reason: '商品删除成功！' })
            } else {
                res.send({ code: 1, reason: '商品删除失败！' })
            }
        })
    }


})

/* 批量删除路由 */
router.get('/delselected', (req, res) => {
    let { idArr } = req.query;

    let user_group = req.user.user_group;
    // 判断是否是普通用户
    if (user_group === '普通用户') {
        res.send({ code: 2, reason: '对不起,您没有此操作权限！' })
    } else {
        let sqlStr = `delete from goods where id in (${idArr})`;
        connection.query(sqlStr, (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                res.send({ code: 0, reason: '删除数据成功！' })
            } else {
                res.send({ code: 1, reason: '删除数据失败！' })
            }
        })
    }


})

/* 编辑按钮路由 */
router.get('/goodsedit', (req, res) => {
    let { id } = req.query;
    // 准备sql
    let sqlStr = `select * from goods where id=${id}`;
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send(data)
    })
})

/* 保存编辑路由 */
router.post('/saveedit', (req, res) => {
    let { goodsname, classify, saleprice, stocknum, id } = req.body;
    // 准备sql
    let sqlStr = `update goods set goodsname='${goodsname}',classify='${classify}',saleprice='${saleprice}',stocknum='${stocknum}' where id=${id}`;
    // 执行
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, reason: '信息修改成功！' })
        } else {
            res.send({ code: 1, reason: '信息修改失败！' })
        }
    })
})



module.exports = router;