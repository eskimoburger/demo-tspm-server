const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (results.length > 0) {
      console.log("Pull Students Complete!! ");
      res.send(results);
    }
  });
});

///sendData StudentList Final
router.get("/test", (req, res) => {
  db.query("SELECT * FROM test_students", (err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    }

    let listStudent = [];
    for (let i = 0; i < results.length; i++) {
      listStudent.push({
        id: results[i].student_id,
        name:
          results[i].prefix_th +
          " " +
          results[i].student_name_th +
          " " +
          results[i].student_lastname_th,
      });
    }
    //res.send("easy")
    res.send({ count: results.length, studentList: listStudent });
  });
});

///sendData only one student

router.get("/test/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    `SELECT * FROM test_students where student_id = ${id}`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.send(err);
      }

      let listStudent = [];
      for (let i = 0; i < results.length; i++) {
        listStudent.push({
          id: results[i].student_id,
          prefix_th: results[i].prefix_th,
          thname: results[i].student_name_th,
          thlastname: results[i].student_lastname_th,
          enname: results[i].student_name_eng,
          enlastname: results[i].student_name_eng,
          nickname: "ยังไม่มีข้อมูล",
          email: results[i].student_email,
          tel: "ยังไม่มีข้อมูล",
          teacher: "ยังไม่มีข้อมูล",
        });
      }
      //res.send("easy")
      res.send({ count: results.length, studentList: listStudent });
    }
  );
});
//{"id":"60360197","thname":"กฤติน","thlastname":"เพิ่มพูล","enname":"Kridtin","enlastname":"Permpoon","nickname":"เคน","email":"email","tel":"เบอร์โทร","teacher":"ที่ปรึกษา"}

router.get("/get/:id", (req, res) => {
  const id = req.params.id;

  console.log(id);
  db.query(
    `SELECT * from test_students WHERE student_id = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
        //res.send((err))
      } else {
        var status = null;
        var fullUrl =
          req.protocol +
          "://" +
          req.get("host") +
          "/imagesProfiles" +
          "/" +
          results[0].pic;
        var noImage =
          req.protocol +
          "://" +
          req.get("host") +
          "/imagesProfiles" +
          "/" +
          "noimage.jpg";
        var picture = "";
        if (results[0].pic === "ยังไม่มีรายละเอียด") {
          picture = noImage;
          status = false;
        } else {
          picture = fullUrl;
          status = true;
        }
        res.send({
          dataStudent: results[0],
          picture: { status: status, data: picture },
        });
      }
    }
  );
});

router.post("/check/:idStudent", (req, res) => {
  const idStudent = req.params.idStudent;
  const { oldPassword, newPassword } = req.body;

  db.query(
    "SELECT * FROM students_reg_fortest WHERE username = ?  ",
    [idStudent],
    async (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const hash = await bcrypt.compare(oldPassword, results[0].password);
        if (hash) {
          const salt = await bcrypt.genSalt();
          const hashPassword = await bcrypt.hash(newPassword, salt);
          //res.send(hashPassword)
          db.query(
            "UPDATE students_reg_fortest SET password = ? WHERE username = ?  ",
            [hashPassword, idStudent],
            (err1, results1) => {
              if (err1) {
                console.log(err1);
              } else {
                res.send({ status: true });
              }
            }
          );
        } else {
          res.send({ status: false });
        }
      }
    }
  );
});

router.put("/edit", (req, res) => {
  //const { idStudent } = req.params;
  const { editStudent } = req.body;
  const query_edit_profile =
    "UPDATE test_students SET  student_name_th = ? ,student_lastname_th = ? , student_name_eng = ? ,student_lastname_eng = ?, student_email=?,phone = ?,nickname = ? WHERE student_id = ? ;  ";
  db.query(query_edit_profile, [
    editStudent.student_name_th,
    editStudent.student_lastname_th,
    editStudent.student_name_eng,
    editStudent.student_lastname_eng,
    editStudent.student_email,
    editStudent.phone,
    editStudent.nickname,
    editStudent.student_id
  ],(err, results) => {
    if(err){
      res.send(err)
      console.log(err)
    }
    else{
      res.send("Edit Successfully")
    }
   
  });
  // console.log(editStudent);

  // res.send(editStudent);
});

module.exports = router;
