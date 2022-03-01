const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const description = req.body.description;
  const state_name = req.body.state_name;
  const id_teacher = req.body.id_teacher;
  const project_name_eng = req.body.project_name_eng;

  db.query(
    "INSERT INTO notification (description,state_name,id_teacher,project_name_eng) VALUES (?,?,?,?)",
    [description, state_name, id_teacher, project_name_eng],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("Notification Complete!!");
    }
  );
});

router.post("/id", (req, res) => {
  const description = req.body.description;
  const state_name = req.body.state_name;
  const id_teacher = req.body.id_teacher;
  const project_name_eng = req.body.project_name_eng;
  const idProject = req.body.idProject;

  db.query(
    "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES (?,?,?,?)",
    [description, state_name, id_teacher, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("Notification Complete!!");
    }
  );
});

router.get("/project/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * from ((notification INNER JOIN teachers ON notification.id_teacher = teachers.id) INNER JOIN test_data_project ON notification.project_name_eng = test_data_project.project_name_eng  )  WHERE id_teacher = ?",
    id,
    (err, results) => {
      if (err) {
        console.log(err);
      }

      var notification = [];
      for (let i = 0; i < results.length; i++) {
        var date = new Date(results[i].notification_date).toLocaleString();
        notification.push({
          description: results[i].description,
          state_name: results[i].state_name,
          time: date,
          project_name_eng: results[i].project_name_eng,
          id: results[i].id,
          id_noti: results[i].id_noti,
          name: results[i].name,
          id_project: results[i].project_id,
          project_name_th: results[i].project_name_th,
        });
      }
      //res.send(results)
      res.send({ results: notification });
    }
  );
});

///success
router.get("/projecttest/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT notification.state_name,notification.id_noti,notification.description,notification.id_teacher,notification.id_project,test_data_project.project_name_eng AS project_name_eng,DATE_FORMAT(notification.notification_date , '%d-%c-%Y %T') as time  from notification INNER JOIN test_data_project on notification.id_project = test_data_project.id   WHERE id_teacher = ? ORDER BY notification.notification_date DESC;",
    id,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

router.get("/getproject/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM  test_project INNER JOIN test_students ON test_project.members = test_students.student_id WHERE id_project = ? ",
    [id],
    (err, result) => {
      if (err) {
      }
      var members = [];
      for (let i = 0; i < result.length; i++) {
        members.push({
          id: result[i].members,
          name:
            result[i].prefix_th +
            " " +
            result[i].student_name_th +
            " " +
            result[i].student_lastname_th,
        });
      }
      res.send({ members: members });
    }
  );
});

router.delete("/project/:username", (req, res) => {
  const username = req.params.username;
  db.query(
    "DELETE FROM  notification WHERE id_noti = ?",
    username,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send({ message: "Delete Complete!!!" });
    }
  );
});

router.post("/student", (req, res) => {
  const description = req.body.description;
  const state_name = req.body.state_name;
  const id_teacher = req.body.id_teacher;
  const project_name_eng = req.body.project_name_eng;

  db.query(
    "INSERT INTO notification_student (description,state_name,id_teacher,project_name_eng) VALUES (?,?,?,?)",
    [description, state_name, id_teacher, project_name_eng],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("Notification Complete!!");
    }
  );
});

router.get("/course-teacher/", (req, res) => {
  db.query("SELECT course_notification.state_name,course_notification.id_noti,course_notification.description,course_notification.id_project,DATE_FORMAT(course_notification.notification_date , '%d-%c-%Y %T') as time  from course_notification  ORDER BY course_notification.notification_date DESC;", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

router.post("/course-teacher/:id", (req, res) => {
  const description = req.body.description;
  const state_name = req.body.state_name;
  const id_teacher = req.body.id_teacher;

  const idProject = req.params.id;

  db.query(
    "INSERT INTO course_notification (description,state_name,id_project) VALUES (?,?,?)",
    [description, state_name, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("Notification Complete!!");
    }
  );
});

module.exports = router;
