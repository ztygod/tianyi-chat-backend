const { db } = require('../dbconfig')

module.exports = {
    getConversitionList,
    addConversitionList,
    totalConversitionList
}
//先根据sender,receiver的id确定我们的目标聊天记录，在根据时间先后排序
function getConversitionList(sender, receiver) {
    return new Promise((resolve, reject) => {
        try {
            const query = `select * from chat_content where (senderID = "${sender.id}" && receiverID = "${receiver.id}") or (senderID = "${receiver.id}" && receiverID = "${sender.id}") order by sendTime ASC;`
            db.query(query, (err, reslut) => {
                if (err) {
                    reject("获取聊天记录失败" + err)
                } else {
                    resolve(reslut)
                }
            })
        } catch (error) {
            reject("获取聊天异常" + error)
        }
    })
}
//新增聊天记录
function addConversitionList(content, sender, receiver, sendTime, index_id) {
    return new Promise((resolve, reject) => {
        try {
            const query = `INSERT INTO chat_content VALUES ("${content}","${sender.id}","${receiver.id}","${sendTime}","${index_id}");`
            db.query(query, (err, reslut) => {
                if (err) {
                    reject("新增聊天记录失败" + err)
                } else {
                    resolve(reslut)
                }
            })
        } catch (error) {
            reject("新增聊天记录异常" + error)
        }
    })
}
//获取聊天记录总数
function totalConversitionList() {
    return new Promise((resolve, reject) => {
        try {
            const query = "SELECT MAX(index_id) FROM chat_content;"
            db.query(query, (err, reslut) => {
                if (err) {
                    reject("获取聊天记录总数失败" + err)
                } else {
                    resolve(reslut)
                }
            })
        } catch (error) {
            reject("获取聊天记录总数异常" + error)
        }
    })
}