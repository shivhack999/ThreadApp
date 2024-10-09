const mySql = require("mysql2");

const connection = mySql.createConnection({
    host:'localhost',
    user:'yourMySQLUser',
    password:'yourMySQLPassword',
    database:'yourMySQLDB'
});

const connectMySQL = () =>{
    connection.connect((error) =>{
        if(error) console.log('MySQL connection error:', error);
        else console.log('Connected to MySQL');
    })
}

module.exports = {
    connectMySQL,
    connection
}