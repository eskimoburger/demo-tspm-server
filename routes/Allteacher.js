const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM teachers", (err, results) => {
    if (err) {
      console.log(err);
    }

    let listTeacher = [];
    for (let i = 0; i < results.length; i++) {
      listTeacher.push({
        id: results[i].id,
        name: results[i].name,
      });
    }

    res.send(results);
  });
});

router.get("/byuser/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM teachers WHERE username = ? ", id, (err, results) => {
    if (err) {
      console.log(err);
    }

    res.send(results);
    console.log("pull Complete");
  });
});

router.post("/teachers", (req, res) => {
  const teacher_name = req.body.teacher_name;
  db.query("SELECT * FROM teachers", (err, results) => {
    if (err) {
      console.log(err);
    }
    //results[results.length-1].username
    var newUsername = results[results.length - 1].username;
    var lastIndex = newUsername.match(/\d+/);
    var newIndex = parseInt(lastIndex[0]) + 1;
    var newUsernameFinal = "t" + newIndex.toString();

    db.query(
      `INSERT INTO teachers(name,username)  VALUES  ('${teacher_name}','${newUsernameFinal}')`,
      (err1, results1) => {
        if (err) {
          console.log(err);
        }
        res.send("Add Complete!!");
        
      }
    );
  });
});

module.exports = router;
