const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '***',
    port: 3306,
    database: 'tianyi-chat'
})

module.exports = {
    db: db
}
