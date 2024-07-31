const { db } = require('../dbconfig')
module.exports = {
    verifyUser,
    getUserList
}
//登录验证
function verifyUser(id, password) {
    return new Promise((resolve, reject) => {
        try {
            const query = `select * from user_login where id = "${id}" && password = "${password}";`
            db.query(query, (err, reslut) => {
                if (err) {
                    reject("查询失败" + err)
                } else {
                    resolve(reslut)
                }
            })
        } catch (error) {
            reject("查询异常")
        }

    })
}
//获取全部用户列表
function getUserList() {
    return new Promise((resolve, reject) => {
        try {
            const query = `select * from user_info;`
            db.query(query, (err, result) => {
                if (err) {
                    reject('获取全部用户列表失败')
                } else {
                    resolve(result)
                }
            })
        } catch (error) {
            reject('获取全部用户列表异常')
        }
    })
}