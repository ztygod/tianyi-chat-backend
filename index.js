const express = require('express')
const cors = require('cors')
const socket = require('socket.io')
const jwt = require('jsonwebtoken')//用于生成token
const expressJWT = require('express-jwt')//用于检验token

const tokenconfig = require('./tokenconfig')
const {
    verifyUser,
    getUserList
} = require('./api/user')
const { getConversitionList, addConversitionList, totalConversitionList } = require('./api/content')

const app = express();
app.use(cors());//处理跨域,之后每个响应头都会被添加上跨域标识
app.use(express.json());//解析json数据到req.body中
app.use(express.urlencoded({ extended: true }));
//app.use(expressJWT.expressjwt({ secret: tokenconfig.jwtSecretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api/] }))
//unless({ path: [/^\/api/] })
//意思就是除了/api开头的请求都验证，其他请求都需要验证token

//简化格式的函数
function simplify(data) {
    return JSON.parse(JSON.stringify(data))
}



//登录接口
app.post('/api/login', async (req, res) => {
    try {
        //这里的console.log是调试错误是用到的
        console.log('1')
        const { id, password } = req.body
        console.log('2')
        const reslut = await verifyUser(id, password)
        console.log('3')
        const simple_reslut = simplify(reslut)
        console.log('4')
        const user = simple_reslut[0]
        console.log(reslut)
        console.log(simple_reslut)
        console.log(user)
        if (reslut.length !== 0) {
            //生成token
            const token = jwt.sign(user, tokenconfig.jwtSecretKey, {
                expiresIn: tokenconfig.expiresIn
            })
            res.send({
                user,
                token: 'Bearer ' + token,
                code: 1
            })
        } else {
            res.send({
                reslut,
                code: 0
            })
        }
    } catch (error) {
        console.error('Error executing query:', error)
        res.status(500).send('Internal Server Error')
    }
})

//获取全部用户列表接口
app.get('/getuserlist', async (req, res) => {
    try {
        const reslut = await getUserList()
        console.log(reslut)
        const simple_reslut = simplify(reslut)
        if (reslut.length !== 0) {
            res.send({
                simple_reslut,
                code: 1
            })
        } else {
            res.send({
                code: 0
            })
        }
    } catch (error) {
        console.error('Error executing query:', error)
        res.status(500).send('Internal Server Error')
    }
})

app.post('/getconversitionList', async (req, res) => {
    try {
        const { sender, receiver } = req.body
        const reslut = await getConversitionList(sender, receiver)
        const simple_reslut = simplify(reslut)
        if (simple_reslut.length !== 0) {
            res.send({
                simple_reslut,
                code: 1
            })
        } else {
            res.send({
                simple_reslut,
                code: 0
            })
        }
    } catch (error) {
        console.error('Error executing query:', error)
        res.status(500).send('Internal Server Error')
    }
})
//新增聊天信息,接受方不在线的情况
app.post('/addconversitionList', async (req, res) => {
    try {
        const { content, people, sendTime } = req.body
        const { sender, receiver } = people
        //获取索引
        const totalList = await totalConversitionList()
        const simple_totalList = simplify(totalList)[0]
        let key = 'MAX(index_id)'
        const index_id = simple_totalList[key]
        // console.log(simple_totalList)
        // console.log(index_id)
        // console.log(content)
        // console.log(people)
        // console.log(sendTime)
        const reslut = await addConversitionList(content, sender, receiver, sendTime, index_id + 1)
        // console.log(reslut)
        // console.log(reslut.warningCount)
        if (reslut.warningCount === 0) {
            res.send({
                reslut,
                code: 1
            })
        } else {
            res.send({
                reslut,
                code: 0
            })
        }
    } catch (error) {
        console.error('Error executing query:', error)
        res.status(500).send('Internal Server Error')
    }
})
//新增聊天信息,接受方在线的情况
app.post('/addconversitionlistOnline', async (req, res) => {
    try {
        const { content, people, sendTime } = req.body
        const { sender, receiver } = people
        //获取索引
        const totalList = await totalConversitionList()
        const simple_totalList = simplify(totalList)[0]
        let key = 'MAX(index_id)'
        const index_id = simple_totalList[key]

        const reslut = await addConversitionList(content, sender, receiver, sendTime, index_id + 1)
        // console.log(reslut)
        // console.log(reslut.warningCount)
        if (reslut.warningCount === 0) {
            res.send({
                reslut,
                code: 1
            })
        } else {
            res.send({
                reslut,
                code: 0
            })
        }
    } catch (error) {
        console.error('Error executing query:', error)
        res.status(500).send('Internal Server Error')
    }
})

const server = app.listen(3000, () => {
    console.log("服务器启动监听3000端口")
})

const userState = ['ONLINE', 'OFFLINE']
const user = {}

const io = socket(server, {
    cors: {
        origin: "*"
    }
})

io.on('connect', function (socket) {
    console.log("连接成功")
    //用户上线
    socket.on('online', (userID) => {
        socket.userName = userID
        user[userID] = {
            socketID: socket.id,
            status: userState[0]
        }
        console.log("用户上线")
        console.log("用户ID " + userID)
        console.log("用户信息 " + user[userID].socketID + " " + user[userID].status)
    })
    socket.on('sendMsg', async (data) => {
        let receiverID = data.people.receiver.id
        // console.log(receiverID)
        // console.log(user[receiverID].status)
        if (receiverID in user) {
            if (receiverID && user[receiverID].status === userState[0]) {
                // //向指定房间传递消息
                // //获取索引
                // const totalList = await totalConversitionList()
                // const simple_totalList = simplify(totalList)[0]
                // let key = 'MAX(index_id)'
                // const index_id = simple_totalList[key]
                // //先将消息存入数据库中
                // const reslut = await addConversitionList(data.content, data.people.sender, data.people.receiver, data.sendTime, index_id + 1)
                socket.to(user[receiverID].socketID).emit('receiveMsg', data)
            } else {
                //离线则不做处理
                return
            }
        } else {
            return
        }
    })
    socket.on('disconnect', reason => {
        console.log('disconnect: ' + reason)

        if (user[socket.userName]) {
            user[socket.userName].status = userState[1]
        }
    })
})

