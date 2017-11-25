import mysql from 'mysql';

import config from './../../resources/config.json';

let shortConfig = config[process.argv[2].slice(4)];

const connection = mysql.createConnection({
        host: shortConfig.host,
        database: shortConfig.schema,
        user: shortConfig.username,
        password: shortConfig.password
    });

connection.connect((err) => {
    if (err) throw err;
    console.log("Database connected!");
});





module.exports = connection;


