const express = require("express");
const router = express.Router();
const db = require("../config/db");
var useragent = require("express-useragent");
var nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { query } = require("../config/db");

// Upload data from CSV files
router.post("/test", (req, res) => {
  const student_id = req.body.student_id;
  const prefix_th = req.body.prefix_th;
  const student_name_th = req.body.student_name_th;
  const student_lastname_th = req.body.student_lastname_th;
  const prefix_eng = req.body.prefix_eng;
  const student_name_eng = req.body.student_name_eng;
  const student_lastname_eng = req.body.student_lastname_eng;
  const student_email = req.body.student_email;
  const query =
    "INSERT INTO test_students (student_id, prefix_th, student_name_th, student_lastname_th,prefix_eng, student_name_eng ,student_lastname_eng, student_email ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

  db.query(
    query,
    [
      student_id,
      prefix_th,
      student_name_th,
      student_lastname_th,
      prefix_eng,
      student_name_eng,
      student_lastname_eng,
      student_email,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("Upload All Student to database Successfully!!");
    }
  );
});

/// Post data to student_reg

router.post("/sendreg", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query =
    "INSERT INTO test_students_reg (username, password) VALUES (?, ?);";

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
    console.log("Upload All Student to Reg Successfully!!");
  });
});



router.post("/mail", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "eskimoburger@gmail.com",
      pass: "eskee230541",
    },
  });


  var mailOptions = {
    from: "The Student Project Management System",
    to: email,
    subject: "Welcome To The Student Project Management System  ",
    html: `<h2>ยินดีต้อนรับเข้าสู่ระบบการจัดการโครงงานของนิสิตคณะวิศวกรรมศาสตร์ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์</h2><h3>รหัสผ่านของคุณคือ  : ${password} </h3>`,
  };


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent: " + info.response);
    }
  });
});

router.get("/get", (req, res) => {
  const years = "test_students";
  const query = `SELECT * FROM ${years}`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err.sqlMessage);
    }
    res.send(results);
  });
});

router.get("/show", (req, res) => {
  const query = `select table_name from information_schema.tables
where table_schema = 'cpe08'`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err.sqlMessage);
    }
    res.send(results);
    console.log(results.length);
  });
});

router.post("/all", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    "SELECT * from students_reg WHERE username = ? UNION ALL SELECT * from teachers_reg WHERE username = ? ; ",
    [username, username],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        console.log(result[0].username);
        if (password == result[0].password) {
          res.send(req.useragent.isMobile);
          console.log(req.useragent.isMobile);

          //res.json({loggedIn : true ,username:username,role : result[0].role ,id :result[0].id})
        } else {
          res.json({
            loggedIn: false,
            message: "รหัสนิสิตหรือรหัสผ่านไม่ถูกต้อง",
          });
        }
      } else {
        res.json({ loggedIn: false, message: "ไม่พบข้อมูลผู้ใช้" });
      }
    }
  );
});

router.post("/save-students",  (req, res) => {

    const testData = req.body.testData;
    
 
    var sql =
      "INSERT INTO students_fortest (student_id, prefix_th, student_name_th, student_lastname_th,prefix_eng, student_name_eng ,student_lastname_eng, student_email ) VALUES ? ";
    db.query(
      sql,
      [
        testData.map((data) => [
          data.studentcode,
          data.prefixname,
          data.studentname,
          data.studentsurname,
          data.prefixnameeng,
          data.studentnameeng,
          data.studentsurnameeng,
          data.studentemail,
        ])
       
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("complete");
          res.send("complete")
          
        }
      }
    );
    
});

router.post("/send-reg-hash", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const number = req.body.number;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  //res.send(hashPassword)
  const query =
    "INSERT INTO students_reg_fortest (username, password) VALUES (?, ?);";

  db.query(query, [username, hashPassword], (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send({ number: number, student: username });
    console.log(`Upload All Student ${number}  to Reg Successfully!!`);
  });
});



router.post("/hashcheck", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM students_reg_fortest WHERE username = ?  ";
  db.query(query, [username], async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      const hash = await bcrypt.compare(password, result[0].password);
      console.log(result[0].username);
      if (hash) {
        res.json({
          loggedIn: true,
          username: username,
          role: result[0].role,
        });
      } else {
        res.json({ loggedIn: false, message: "wrong password or username" });
      }
    } else {
      res.json({ loggedIn: false, message: "User doesn't exit" });
    }
  });
});

module.exports = router;
