const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/login", (req, res) => {
  //const id = req.body.id
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM students_reg WHERE username = ? ",
    username,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        console.log(result[0].username);
        if (password == result[0].password) {
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
    }
  );
});

// LOG IN FINAL

router.post("/all", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * from test_students_reg WHERE username = ? UNION ALL SELECT * from teachers_reg WHERE username = ? ; ",
    [username, username],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        console.log(result[0].username + " Login Complete");
        if (password == result[0].password) {
          res.json({
            loggedIn: true,
            username: username,
            role: result[0].role,
            id: result[0].id,
          });
        } else {
          res.json({
            loggedIn: false,
            message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
          });
        }
      } else {
        res.json({ loggedIn: false, message: "ไม่พบข้อมูลผู้ใช้" });
      }
    }
  );
});

router.post("/test", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  res.send("good");
  res.send(username);
});

router.get("/getproject/:id", (req, res) => {
  const id = req.params.id;
  var query = "SELECT * from student_project WHERE student_name = ?";
  db.query(query, id, (err, results) => {
    if (err) {
      console.log(err);
    }

    if (results.length == 0) {
      res.send([
        {
          project_name_eng: "nodata",
        },
      ]);
    } else {
      res.send(results);
    }
  });
});



module.exports = router;
