//const mysql =require('mysql');
// const db = mysql.createConnection(
    
//     {
//         host : "localhost",
//         user:'root',
//         password:'',
//         database :'cpe08',
//         timezone: 'utc' 

//     },{multipleStatements: true});
    
// db.on('error', err => {
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             // db error reconnect
//         disconnect_handler();
//     } else {
//         throw err;
//     }
//     });
// var db_config = {
//     host: 'localhost',
//     user: 'root',
//     password:'',
//     database :'cpe08',
//     timezone: 'utc' 
// };


// var db;


// function handleDisconnect() {
//   db = mysql.createConnection(db_config,{multipleStatements: true}); // Recreate the connection, since
//                                                   // the old one cannot be reused.

//   db.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   db.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
// }

// handleDisconnect();
// const mysql = require('mysql2')
// var db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'cpe08',
//   multipleStatements: true
  
// })
const mysql = require('mysql2')
var db = mysql.createConnection({
  host: 'exbodcemtop76rnz.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'xjrben7pa20ve2ms',
  password: 'ucwst4ismkxsk7n5',
  database: 'jsanxxmbidb1wksg',
  multipleStatements: true, 
  port:3306
  
  
})


module.exports = db;