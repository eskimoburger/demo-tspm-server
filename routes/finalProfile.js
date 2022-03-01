const express = require("express");
const router = express.Router();
const db = require("../config/db");


router.get("/student-profile/:studentId", (req, res) => {
    const {studentId} = req.params
    var query_data_student = `SELECT * from test_students WHERE student_id = ?`
    //console.log(id)
    db.query(
        query_data_student
      ,
      [studentId],
      (err, results) => {
        if (err) {
          console.log(err);
          //res.send((err))
        } 
        else {
          var status = null
          var fullUrl = req.protocol + "://" + req.get("host") + "/imagesProfiles" + "/" + results[0].pic;
          var noImage = req.protocol + "://" + req.get("host") + "/imagesProfiles" + "/" + "noimage.jpg";
          var picture = "";
          if (results[0].pic === "ยังไม่มีรายละเอียด") {
            picture = noImage;
            status = false
          }
          else{
            picture = fullUrl
            status = true
          }
          res.send({ dataStudent: results[0], picture: {status : status , data:picture} });
        }
      }
    );
  });

  



module.exports = router;
