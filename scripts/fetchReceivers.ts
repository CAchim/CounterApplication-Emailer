const queryusersDB = (sqlCommand) => {
  const mysql = require("mysql");

  process.env.DB_HOST = "127.0.0.1";
  process.env.DB_USER = "root";
  process.env.DB_PASSWORD = "3ng1n33r";
  process.env.DB_NAME = "counterdb";

  return new Promise((resolve, reject) => {
    const con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    con.connect(function (connectionErr) {
      if (connectionErr) reject(connectionErr);

      con.query(
        { sql: sqlCommand, timeout: 2000 },
        function (queryErr, result) {
          if (queryErr) {
            console.log("Throwing query err: ", queryErr?.sqlMessage);
            reject(queryErr?.sqlMessage);
          }
          if (result) {
            con.end();
            resolve(result);
          }
        }
      );
    });
  });
};

async function fetchReceivers() {
  const sqlCommand = `call getEmailsByUserGroup("maintenance");`;

  return new Promise((resolve, reject) => {
    queryusersDB(sqlCommand)
      .then((responseFromDB) => {
        resolve({ message: responseFromDB, status: 200 });
      })
      .catch((err) => {
        console.log(err);
        resolve({ message: err, status: 500 });
      });
  });
}

module.exports = {
  fetchReceivers: fetchReceivers,
};
