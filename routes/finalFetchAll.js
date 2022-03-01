const express = require("express");
const router = express.Router();
const db = require("../config/db");


//Fetch List For Insert Data
router.get("/", (req, res) => {
  var query_data_student =
    "SELECT CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name,test_students.student_id AS id  FROM test_students  ;";
  var query_data_teacher = "SELECT * FROM teachers ;";
  db.query(query_data_student + query_data_teacher, (err, results) => {
    {
      if (err) {
        console.log(err);
      }
      return res.json({ studentList: results[0], teacherList: results[1] });
    }
  });
});


module.exports = router;
