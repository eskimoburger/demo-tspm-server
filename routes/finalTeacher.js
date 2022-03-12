const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.put("/confirm-state1/:teacherId/:status", (req, res) => {
  const { status, teacherId } = req.params;
  const { projectName, description, idNotification } = req.body;

  var query_status1_teacher =
    "UPDATE committee_project SET status = 1  WHERE id_teacher = ? ;";
  var query_status2_teacher =
    "UPDATE committee_project SET status = 2  WHERE id_teacher = ? ;";
  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";
  var query_add_log_notification =
    "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  console.log(status, teacherId, projectName, description, idNotification);

  if (status == 1) {
    db.query(
      query_status1_teacher +
        query_delete_notification +
        query_add_log_notification,
      [teacherId, idNotification, teacherId, description],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ status: true, message: "Submitted Complete" });
          console.log(results);
        }
      }
    );
    console.log("status1");
  } else if (status == 2) {
    db.query(
      query_status2_teacher +
        query_delete_notification +
        query_add_log_notification,
      [teacherId, idNotification, teacherId, description],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ status: true, message: "Rejected Complete" });
          console.log(results);
        }
      }
    );
  }

  //res.send("hello")
});

//fileState3
router.get("/file-state3/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  var fullUrl =
    req.protocol +
    "://" +
    req.get("host") +
    "/" +
    idProject +
    "/state3file.pdf";
  res.send(fullUrl);
});

router.put("/validation-state3/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { idTeacher, idNotification, description } = req.body;

  var query_validation_teacher =
    "UPDATE committee_project set status_state3  = 1 WHERE project_id = ? AND id_teacher = ?;";
  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";

  var query_add_log_notification =
    "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  db.query(
    query_validation_teacher +
      query_delete_notification +
      query_add_log_notification,
    [idProject, idTeacher, idNotification, idTeacher, description],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(idNotification, description);
        res.send({ status: true, message: "ValidationState3 Complete" });
      }
    }
  );
});

///state บันทึกการสอบหัวข้อโปรเจค

router.get("/mid-exam-result/:idProject", (req, res) => {
  const idProject = req.params.idProject;

  var query_get_project = "SELECT * from test_data_project WHERE id = ?;";
  var query_mid_results =
    "SELECT  mid_exam_results.exam_status,mid_exam_results.id_teacher, mid_exam_results.exam_value,mid_exam_results.exam_details,committee_project.committee_name,committee_project.role,committee_project.project_name_eng,committee_project.project_id FROM mid_exam_results INNER JOIN committee_project ON mid_exam_results.id_teacher = committee_project.id_teacher where committee_project.project_id =  ?  and mid_exam_results.id_project = ?;";

  db.query(
    query_get_project + query_mid_results,
    [idProject, idProject, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          status: true,
          exam_result: results[1],
          project: results[0][0],
        });
      }
    }
  );
});

router.put("/validation-state5/:idProject/:status", (req, res) => {
  const { idProject, status } = req.params;
  const { idTeacher, idNotification, description, edit } = req.body;

  var query_validation_state5 =
    "UPDATE committee_project set status_state5  = 1 WHERE project_id = ? AND id_teacher = ?;";

  var query_validation_state5_edit =
    " UPDATE mid_exam_results SET exam_details = CONCAT(exam_details, ? ) WHERE id_teacher = ? and id_project = ?;";

  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";

  var query_add_log_notification =
    "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  console.log(idProject, status, idTeacher, idNotification, description, edit);
  if (status == 1) {
    db.query(
      query_validation_state5 +
        query_delete_notification +
        query_add_log_notification,
      [idProject, idTeacher, idNotification, idTeacher, description],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        res.send({ status: true, message: "ValidationState5 Complete" });
      }
    );
  } else if (status == 2) {
    db.query(
      query_validation_state5 +
        query_validation_state5_edit +
        query_delete_notification +
        query_add_log_notification,
      [
        idProject,
        idTeacher,
        edit,
        idTeacher,
        idProject,
        idNotification,
        idTeacher,
        description,
      ],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        res.send({
          status: true,
          message: "Edit And ValidationState5  Complete",
        });
      }
    );
  }
});

router.get("/asses/:idProject", (req, res) => {
  const { idProject } = req.params;
  console.log(idProject);
  var query_data_project =
    "SELECT  id,project_id,project_name_th,project_name_eng, 0 AS asses1, 0 AS asses2, 0 AS asses3, 0 AS asses4, 0 AS asses5  FROM test_data_project WHERE id = ?;";
  var query_data_member =
    "SELECT test_project.members AS id , CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name, '' AS student1,'' AS student2,'' AS student3,'' AS student4 FROM test_project INNER JOIN test_students ON test_project.members = test_students.student_id WHERE id_project = ? ;";

  db.query(
    query_data_project + query_data_member,
    [idProject, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          status: true,
          message: "Fetch Asses Complete",
          project_asses: results[0][0],
          student_asses: results[1],
        });
      }
    }
  );
});

router.post("/asses/:idProject", (req, res) => {
  const { idProject } = req.params;
  const {
    asses,
    assesStudent,
    assesStatus,
    feedback,
    idNotification,
    idTeacher,
    description,
  } = req.body;

  var query_update_asses_status =
    "UPDATE test_data_project SET asses_status = ? WHERE id = ?;";
  var query_add_asses =
    "INSERT INTO asses (id_project,asses1,asses2,asses3,asses4,asses5,feedback) VALUE (?,?,?,?,?,?,?);";
  var query_add_asses_student =
    "INSERT INTO asses_student(id_student,id_project,student1,student2,student3,student4) VALUE ?;";
  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";

  var query_add_log_notification =
    "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  db.query(
    query_update_asses_status +
      query_add_asses +
      query_add_asses_student +
      query_delete_notification +
      query_add_log_notification,
    [
      assesStatus,
      idProject,
      idProject,
      asses.asses1,
      asses.asses2,
      asses.asses3,
      asses.asses4,
      asses.asses5,
      feedback,
      assesStudent.map((student) => [
        student.id,
        idProject,
        student.student1,
        student.student2,
        student.student3,
        student.student4,
      ]),
      idNotification,
      idTeacher,
      description,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ status: true, message: "Asses Complete" });
        //console.log("ASSES complete");
      }
    }
  );

  ///console.log(asses.id)
});

router.get("/file-state9/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  var fullUrl =
    req.protocol +
    "://" +
    req.get("host") +
    "/" +
    idProject +
    "/state9file.pdf";
  res.send(fullUrl);
});

router.put("/confirm-state9/:teacherId/:status", (req, res) => {
  const { status, teacherId } = req.params;
  const { projectName, description, idNotification, testFeedback, idProject } =
    req.body;

  var query_update_test_status = `UPDATE test_data_project SET test_status = ${status} WHERE id = ? ;`;
  var query_add_feedback =
    "INSERT INTO  test_assess(id_project,test_feedback) VALUE (?,?);";
  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";
  var query_add_log_notification =
    "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  console.log(
    status,
    teacherId,
    projectName,
    description,
    idNotification,
    testFeedback,
    idProject
  );

  if (status == 1) {
    //console.log("status1")

    if (testFeedback.length == 0) {
      db.query(
        query_update_test_status +
          query_delete_notification +
          query_add_log_notification,
        [idProject, idNotification, teacherId, description],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("No feedback1");
            res.send({
              status: true,
              message: "Update test status and No test feedback Complete",
            });
          }
        }
      );
    } else {
      db.query(
        query_update_test_status +
          query_add_feedback +
          query_delete_notification +
          query_add_log_notification,
        [
          idProject,
          idProject,
          testFeedback,
          idNotification,
          teacherId,
          description,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("feedback1" + testFeedback.length);
            res.send({
              status: true,
              message: "Update test status and Add test feedback Complete",
            });
          }
        }
      );
    }
  } else if (status == 2) {
    if (testFeedback.length == 0) {
      db.query(
        query_update_test_status +
          query_delete_notification +
          query_add_log_notification,
        [idProject, idNotification, teacherId, description],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("No feedback2");
            res.send({
              status: true,
              message: "Update test status and No test feedback Complete",
            });
          }
        }
      );
    } else {
      db.query(
        query_update_test_status +
          query_add_feedback +
          query_delete_notification +
          query_add_log_notification,
        [
          idProject,
          idProject,
          testFeedback,
          idNotification,
          teacherId,
          description,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("feedback2" + testFeedback.length);
            res.send({
              status: true,
              message: "Update test status and Add test feedback Complete",
            });
          }
        }
      );
    }
  }
});

router.get("/final-exam-result/:idProject", (req, res) => {
  const idProject = req.params.idProject;

  var query_get_project = "SELECT * from test_data_project WHERE id = ?;";
  var query_mid_results =
    "SELECT  final_exam_results.exam_status,final_exam_results.id_teacher, final_exam_results.exam_value,final_exam_results.exam_details,committee_project.committee_name,committee_project.role,committee_project.project_name_eng,committee_project.project_id FROM final_exam_results INNER JOIN committee_project ON final_exam_results.id_teacher = committee_project.id_teacher where committee_project.project_id =  ?  and final_exam_results.id_project = ?;";

  db.query(
    query_get_project + query_mid_results,
    [idProject, idProject, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          status: true,
          exam_result: results[1],
          project: results[0][0],
        });
      }
    }
  );
});

//in progress

router.put("/validation-state10/:teacherId/:idProject", (req, res) => {
  const { idProject, teacherId } = req.params;
  const { idNotification, description, edit } = req.body;
  const stateName = "ยืนยันบันทึกผลการสอบโครงงาน";

  var query_update_final_status =
    "UPDATE committee_project SET status_state10=1 WHERE id_teacher = ? AND project_id= ?;";

  var query_validation_state10_edit =
    " UPDATE mid_exam_results SET exam_details = CONCAT(exam_details, ? ) WHERE id_teacher = ? and id_project = ?;";

  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";

  var query_add_log_notification =
    "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  var query_status_state10 =
    "SELECT committee_project.status_state10 FROM committee_project WHERE project_id = ?;";

  var query_get_advisor =
    "SELECT id_teacher FROM committee_project WHERE project_id = ? AND role='อาจารย์ที่ปรึกษา';";
  var query_add_notification_advisor =
    "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES (?,?,?,?);";

  db.query(
    query_update_final_status +
      query_status_state10 +
      query_get_advisor +
      query_delete_notification,
    [teacherId, idProject, idProject, idProject, idNotification],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        let Test = [];
        if (results[1].length > 0) {
          function checkStatus(status) {
            return status === 1;
          }
          results[1].map((result) => {
            Test.push(result.status_state10);
          });
          const CheckIsOne = Test.every(checkStatus);
          console.log(Test);
          console.log(CheckIsOne);

          if (CheckIsOne) {
            db.query(
              query_add_notification_advisor,
              [`${idProject}`, stateName, results[2][0].id_teacher, idProject],
              (err_notification, results_notification) => {
                if (err_notification) {
                  console.log(err_notification);
                } else {
                  res.send("Send Complete!!");
                }
              }
            );
            //res.send(Test);

            // res.send({
            //   status: true,
            //   TestArray: Test,
            //   message: "Hello true",
            //   advisor: results[2][0].id_teacher,
            // });
          } else {
            res.send({
              status: false,
              TestArray: Test,
              message: "Hello false",
            });
          }
        } else {
          res.send("No data In this Project");
        }
      }
    }
  );

  // console.log(idProject)
  // res.send("EIEI")
});
router.put("/validation-state10-test/:teacherId/:idProject", (req, res) => {
  const { idProject, teacherId } = req.params;
  const { idNotification, description, edit } = req.body;
  const stateName = "ยืนยันบันทึกผลการสอบโครงงาน";

  var query_update_final_status =
    "UPDATE committee_project SET status_state10=1 WHERE id_teacher = ? AND project_id= ?;";

  var query_validation_state10_edit =
    " UPDATE mid_exam_results SET exam_details = CONCAT(exam_details, ? ) WHERE id_teacher = ? and id_project = ?;";

  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";

  var query_add_log_notification =
    "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  var query_status_state10 =
    "SELECT committee_project.status_state10 FROM committee_project WHERE project_id = ?;";

  var query_get_advisor =
    "SELECT id_teacher FROM committee_project WHERE project_id = ? AND role='อาจารย์ที่ปรึกษา';";
  var query_add_notification_advisor =
    "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES (?,?,?,?);";
  var query_validation_state10_edit =
    "UPDATE final_exam_results SET exam_details=CONCAT(exam_details, ?) WHERE id_teacher=? and id_project=? ;  ";

  db.query(
    query_update_final_status +
      query_status_state10 +
      query_get_advisor +
      query_validation_state10_edit +
      query_delete_notification,
    [
      teacherId,
      idProject,
      idProject,
      idProject,
      edit,
      teacherId,
      idProject,
      idNotification,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        let Test = [];
        if (results[1].length > 0) {
          function checkStatus(status) {
            return status === 1;
          }
          results[1].map((result) => {
            Test.push(result.status_state10);
          });
          const CheckIsOne = Test.every(checkStatus);
          console.log(Test);
          console.log(CheckIsOne);

          if (CheckIsOne) {
            db.query(
              query_add_notification_advisor,
              [`${idProject}`, stateName, results[2][0].id_teacher, idProject],
              (err_notification, results_notification) => {
                if (err_notification) {
                  console.log(err_notification);
                } else {
                  res.send("Send Complete!!");
                }
              }
            );
            //res.send(Test);

            // res.send({
            //   status: true,
            //   TestArray: Test,
            //   message: "Hello true",
            //   advisor: results[2][0].id_teacher,
            // });
          } else {
            res.send({
              status: false,
              TestArray: Test,
              message: "Hello false",
            });
          }
        } else {
          res.send("No data In this Project");
        }
      }
    }
  );

  // console.log(idProject)
  // res.send("EIEI")
});

// router.put("/validation-state10-edit/:teacherId/:idProject", (req, res) => {
//   const { idProject, teacherId } = req.params;
//   const { idNotification, description, edit } = req.body;
//   const stateName = "ยืนยันบันทึกผลการสอบโครงงาน";

//   var query_validation_state10 =
//     "UPDATE committee_project set status_state10=1 WHERE project_id=? AND id_teacher=?; ";

//   var query_validation_state10_edit =
//     "UPDATE final_exam_results SET exam_details=CONCAT(exam_details, ?) WHERE id_teacher=? and id_project=? ;  ";

//   var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";
//   var query_status_state10 =
//     "SELECT committee_project.status_state10 FROM committee_project WHERE project_id = ?; ";

//   var query_get_advisor =
//     "SELECT id_teacher FROM `committee_project` WHERE `project_id` = ? AND `role`='อาจารย์ที่ปรึกษา' ; ";
//   var query_add_notification_advisor =
//     "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES (?,?,?,?);";

//   // //var query_add_log_notification =
//   //   "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

//   //console.log(idProject, idNotification, edit);

//   db.query(
//     query_validation_state10 +
//       query_validation_state10_edit +
//       query_get_advisor +
//       query_status_state10,
//     //query_delete_notification
//     [
//       idProject,
//       teacherId,
//       edit,
//       teacherId,
//       idProject,
//       idProject,
//       // idNotification,
//     ],
//     (err, results) => {
//       if (err) {
//         return res.send(err);
//         console.log(err);
//       }

//       res.send(results[2]);
//       // else {
//       //   let Test = [];
//       //   if (results[2].length > 0) {
//       //     function checkStatus(status) {
//       //       return status === 1;
//       //     }
//       //     results[2].map((result) => {
//       //       Test.push(result.status_state10);
//       //     });
//       //     const CheckIsOne = Test.every(checkStatus);
//       //     console.log(Test);
//       //     console.log(CheckIsOne);

//       //     if (CheckIsOne) {
//       //       // db.query(
//       //       //   query_add_notification_advisor,
//       //       //   [`${idProject}`, stateName, results[4][0].id_teacher, idProject],
//       //       //   (err_notification, results_notification) => {
//       //       //     if (err_notification) {
//       //       //       console.log(err_notification);
//       //       //     } else {
//       //       //       res.send("Send Complete!!");
//       //       //     }
//       //       //   }
//       //       // );
//       //       //res.send(Test);

//       //       // res.send({
//       //       //   status: true,
//       //       //   TestArray: Test,
//       //       //   message: "Hello true",
//       //       //   advisor: results[2][0].id_teacher,
//       //       // });
//       //     } else {
//       //       res.send({
//       //         status: false,
//       //         TestArray: Test,
//       //         message: "Hello false",
//       //       });
//       //     }
//       //   } else {
//       //     res.send("No data In this Project");
//       //   }
//       // }
//     }
//   );
// });

router.get("/test", (req, res) => {
  console.log(__basedir);
});

router.get("/get-project/:id", (req, res) => {
  const { id } = req.params;
  const query_data_project = "SELECT * FROM test_data_project WHERE id = ?; ";
  const query_data_committee =
    "SELECT *,committee_name AS teacher_name FROM committee_project WHERE project_id = ?;";
  const query_data_member =
    "SELECT test_project.members AS id , CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name FROM test_project INNER JOIN test_students ON test_project.members = test_students.student_id WHERE id_project = ? ;";
  db.query(
    query_data_project + query_data_committee + query_data_member,
    [id, id, id],
    (err, results) => {
      if (err) throw err;
      res.send({
        data: {
          project_details: results[0][0],
          committees: results[1],
          members: results[2],
        },
      });
    }
  );
});

router.put("/validation-state11/:idProject", (req, res) => {
  const { idProject, teacherId } = req.params;
  const { idNotification } = req.body;
  var query_delete_notification = "DELETE FROM notification WHERE id_noti = ?;";
  var query_update_final_status_data_project =
    "UPDATE test_data_project SET final_status=1 WHERE id= ?;";

  // var query_add_log_notification =
  //   "INSERT INTO log_notifications (id_teacher,description) VALUES (?,?);";

  db.query(
    query_update_final_status_data_project + query_delete_notification,
    [idProject, idNotification],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

router.get("/count-project/:idTeacher", (req, res) => {
  const { idTeacher } = req.params;
  const query_count_project =
    "SELECT COUNT(test_data_project.id) AS allP  FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ?;";
  const query_count_project_resume =
    "SELECT COUNT(test_data_project.id) AS allR  FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? AND test_data_project.state < 14;";
  const query_count_project_success =
    "SELECT COUNT(test_data_project.id) AS allS  FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? AND test_data_project.state = 14;";
  db.query(
    query_count_project +
      query_count_project_resume +
      query_count_project_success,
    [idTeacher, idTeacher, idTeacher],
    (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.send({
          allP: results[0][0]?.allP,
          allR: results[1][0]?.allR,
          allS: results[2][0]?.allS,
        });
      }
    }
  );
  //res.send("Hello" + idTeacher);
});

module.exports = router;
