const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./DB/database_connection');
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
     
const server = app.listen(8081, function () {
    const host = server.address().address
    const port = server.address().port
                   
    console.log("NodeJS app listening at http://%s:%s", host, port)
})

app.use('/api',routes);