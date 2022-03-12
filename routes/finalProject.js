const express = require("express");
const router = express.Router();
const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const removeDir = function (path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename);
        } else {
          fs.unlinkSync(path + "/" + filename);
        }
      });
      fs.rmdirSync(path);
      return "Delete Complete!!";
    } else {
      fs.rmdirSync(path);
    }
  } else {
    console.log("Directory path not found.");
    return "Directory path not found.";
  }
};

router.get("/project-detail/:idStudent", (req, res) => {
  const { idStudent } = req.params;
  var query_check =
    "SELECT test_project.id_project FROM test_project WHERE members =  ?";
  var query_data_project = "SELECT  * FROM test_data_project WHERE id = ?;";
  var query_data_committee =
    "SELECT *,committee_name AS teacher_name FROM committee_project WHERE project_id = ?;";
  var query_data_advisor =
    "SELECT *,committee_name AS teacher_name FROM committee_project WHERE project_id = ? AND role = 'อาจารย์ที่ปรึกษา';";
  var query_data_member =
    "SELECT test_project.members AS id , CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name FROM test_project INNER JOIN test_students ON test_project.members = test_students.student_id WHERE id_project = ? ;";

  db.query(query_check, [idStudent], (err, results) => {
    //console.log(results);
    if (err) {
      console.log(err);
    }
    if (results.length == 0) {
      res.send({ status: false, message: "No Data Student in database" });
    } else {
      var idProject = results[0].id_project;
      console.log(idProject);
      db.query(
        query_data_project +
          query_data_committee +
          query_data_advisor +
          query_data_member,
        [idProject, idProject, idProject, idProject],
        (err_data, results_data) => {
          if (err_data) {
            console.log(err_data);
          } else {
            res.send({
              status: true,
              message: "Fetch Data Student Complete ",
              data: {
                projectData: results_data[0][0],
                committees: results_data[1],
                advisor: results_data[2][0],
                members: results_data[3],
              },
            });
          }
        }
      );

      //console.log(results)
      // res.send({
      //   status: true,
      //   message: "Fetch Data Student Complete ",
      //   projectDetails: results,
      // });
    }
  });
});

//demo

router.get("/testPush/:id_student", (req, res) => {
  const id_student = req.params.id_student;
  var query = "SELECT * FROM test_project WHERE members =  ? and status = 0";
  db.query(query, [id_student], (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length == 0) {
      res.send({ status: false, message: "No data" });
    } else {
      db.query(
        "SELECT *  FROM test_project INNER JOIN  test_students ON test_project.members = test_students.student_id WHERE test_project.project_name_eng = ?  ",
        [results[0].project_name_eng],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }

          let projectMem = [];
          for (let i = 0; i < results1.length; i++) {
            projectMem.push({
              id: results1[i].student_id,
              name:
                results1[i].prefix_th +
                " " +
                results1[i].student_name_th +
                " " +
                results1[i].student_lastname_th,
            });
          }
          db.query(
            "SELECT * from committee_project WHERE project_name_eng = ?",
            [results[0].project_name_eng],
            (err2, results2) => {
              if (err2) {
                console.log(err1);
              }

              let teacher = [];
              for (let i = 0; i < results2.length; i++) {
                teacher.push({
                  teacher_name: results2[i].committee_name,
                  role: results2[i].role,
                  id_teacher: results2[i].id_teacher,
                });
              }

              db.query(
                "SELECT * from test_data_project WHERE project_name_eng = ?",
                [results[0].project_name_eng],
                (err3, results3) => {
                  if (err3) {
                    console.log(err3);
                  }

                  res.status(200).send({
                    status: true,
                    message: "pull data successful",
                    project_th: results[0].project_name_th,
                    project_eng: results[0].project_name_eng,
                    state: results3[0].state,
                    logbook: results3[0].logbook,
                    id_project: results3[0].project_id,
                    members: projectMem,
                    committees: teacher,
                    description: results3[0].project_description,
                    idP: results3[0].id,
                    assesStatus: results3[0].asses_status,
                    testStatus: results3[0].test_status,
                    finalStatus: results3[0].final_status,
                    finalAsses: results3[0].final_assess,
                  });
                }
              );
            }
          );
        }
      );
    }

    // else {
    //   res.send(results);
    // }

    //console.log("Get Project By " + id_student + "!!!");
  });
});

//success
router.post("/state-1", (req, res) => {
  const {
    project_th,
    project_eng,
    project_des,
    selectedStudent,
    selectedTeacher,
  } = req.body;
  const stateName = "เสนอหัวข้อโครงงาน";
  var query_add_data_project =
    "INSERT INTO test_data_project (project_name_th,project_name_eng,project_description) VALUES (?,?,?);";
  var query_add_committee =
    "INSERT INTO committee_project (committee_name,role,id_teacher,project_name_eng) VALUES ?;";
  var query_add_member =
    "INSERT INTO test_project (project_name_th,project_name_eng,members) VALUES ?;";
  var query_add_notification =
    "INSERT INTO notification (description,state_name,id_teacher,project_name_eng) VALUES ?;";

  //res.send(selectedStudent);

  db.query(
    query_add_data_project +
      query_add_committee +
      query_add_member +
      query_add_notification,
    [
      project_th,
      project_eng,
      project_des,
      selectedTeacher.map((teacher) => {
        return [
          JSON.parse(teacher.teacher).name,
          teacher.role,
          JSON.parse(teacher.teacher).id,
          project_eng,
        ];
      }),
      selectedStudent.map((student) => {
        return [project_th, project_eng, student.id];
      }),
      selectedTeacher.map((teacher) => {
        return [
          `${project_eng} ได้ส่งคำขอให้ ${
            JSON.parse(teacher.teacher).name
          } เป็น ${teacher.role} ประจำโครงงาน`,
          stateName,
          JSON.parse(teacher.teacher).id,
          project_eng,
        ];
      }),
    ],
    (err, results) => {
      if (err) {
        res.send({ status: false, message: err.message });
        console.log(err);
      } else {
        res.send({
          status: true,
          message: "Add Data Project to database Complete",
        });
        console.log("Add Data Project to database Complete");
      }
    }
  );
});

// cancel project success
router.post("/cancel/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const stateName = "เสนอหัวข้อโครงงาน";
  // const projectName = req.body.projectName;
  var query_del_data_project = "DELETE FROM test_data_project WHERE id = ?;";
  var query_del_mem = "DELETE FROM test_project WHERE  id_project = ?;";
  var query_del_committee =
    "DELETE FROM committee_project WHERE project_id = ?;";
  var query_del_notification =
    "DELETE FROM notification WHERE id_project = ? AND state_name = ?; ";
  var query_del_file = "DELETE FROM test_project_file WHERE id_project = ? ";

  db.query(
    query_del_data_project +
      query_del_mem +
      query_del_committee +
      query_del_notification +
      query_del_file,
    [idProject, idProject, idProject, idProject, stateName, idProject],
    (err, results) => {
      if (err) {
        res.send({ status: false, message: err.message });
        console.log(err);
      } else {
        res.send({ status: true, message: "Cancel Project Complete" });
      }
    }
  );
});

//รอแก้
// router.post("/cancel/:idProject", (req, res) => {
//   const idProject = req.params.idProject;
//   const stateName = "เสนอหัวข้อโครงงาน";
//   const projectName = req.body.projectName;
//   var query_del_data_project = "DELETE FROM test_data_project WHERE id = ?;";
//   var query_del_mem =
//     "DELETE FROM test_project WHERE project_name_eng = ? AND id_project = 0;";
//   var query_del_committee =
//     "DELETE FROM committee_project WHERE project_name_eng = ? AND project_id = 0;";
//   var query_del_notification =
//     "DELETE FROM notification WHERE project_name_eng = ? AND state_name = ?;";

//   db.query(
//     query_del_data_project +
//       query_del_mem +
//       query_del_committee +
//       query_del_notification,
//     [idProject, projectName, projectName, projectName, stateName],
//     (err, results) => {
//       if (err) {
//         res.send({ status: false, message: err.message });
//         console.log(err);
//       } else {
//         res.send({ status: true, message: "Cancel Project Complete" });
//       }
//     }
//   );
// });

//EditProject //success
router.post("/edits/:idProject", (req, res) => {
  //const idProject = req.params.idProject

  const { idProject } = req.params;
  const { projectNameTH, projectNameENG, delStudents, addStudents } = req.body;

  var query_add_member =
    "INSERT INTO test_project (project_name_th,project_name_eng,members,id_project) VALUES ?;";
  var query_del_member =
    "DELETE FROM test_project WHERE members IN (?) AND id_project = ? ;";

  console.log(
    delStudents.length,
    addStudents.length,
    projectNameENG,
    projectNameTH
  );

  if (delStudents.length > 0 && addStudents.length == 0) {
    db.query(
      query_del_member,
      [
        delStudents.map((mem) => {
          return [mem.id];
        }),
        idProject,
      ],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ status: true, message: "Delete Members Complete" });
          //console.log(results);
        }
      }
    );
  } else if (addStudents.length > 0 && delStudents.length == 0) {
    db.query(
      query_add_member,
      [
        addStudents.map((mem) => [
          projectNameTH,
          projectNameENG,
          mem.id,
          idProject,
        ]),
      ],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          //console.log(results);
          res.send({ status: true, message: "Add Members Complete" });
        }
      }
    );
  } else if (addStudents.length > 0 && delStudents.length > 0) {
    db.query(
      query_del_member + query_add_member,
      [
        delStudents.map((mem) => {
          return [mem.id];
        }),
        idProject,
        addStudents.map((mem) => [
          projectNameTH,
          projectNameENG,
          mem.id,
          idProject,
        ]),
      ],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          //console.log(results);
          res.send({
            status: true,
            message: "Add AND Delete Members Complete",
          });
        }
      }
    );
  }
});

router.post("/state-1/change/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { changeTeacher, rejectTeacher, project_eng } = req.body;
  const stateName = "เสนอหัวข้อโครงงาน";
  var query_del_old_teacher =
    "DELETE FROM committee_project WHERE id_teacher IN (?) AND project_id = ? AND status = 2;";
  var query_add_new_teacher =
    "INSERT INTO committee_project (committee_name,role,id_teacher,project_name_eng,project_id) VALUES ?;";
  var query_add_notification =
    "INSERT INTO notification (description,state_name,id_teacher,project_name_eng,id_project) VALUES ?;";

  db.query(
    query_del_old_teacher + query_add_new_teacher + query_add_notification,
    [
      rejectTeacher.map((teacher) => [teacher.id_teacher]),
      idProject,
      changeTeacher.map((teacher) => [
        teacher.teacher.name,
        teacher.role,
        teacher.teacher.id,
        project_eng,
        idProject,
      ]),
      changeTeacher.map((teacher) => [
        `${project_eng} ได้ส่งคำขอให้ ${teacher.teacher.name} เป็น ${teacher.role} ประจำโครงงาน`,
        stateName,
        teacher.teacher.id,
        project_eng,
        idProject,
      ]),
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ status: true, message: "Change Teacher Complete" });
      }
    }
  );

  //console.log(changeTeacher,("   "),rejectTeacher)
  console.log(idProject);
});

router.get("/get-teacher-state5/:idProject", (req, res) => {
  const { idProject } = req.params;
  var query_get_teachers =
    "SELECT committee_project.committee_name,committee_project.role,committee_project.id_teacher, '' AS exam_value ,'' AS exam_detail FROM committee_project WHERE project_id = ? ORDER BY committee_project.role DESC ";
  db.query(query_get_teachers, idProject, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send({ status: true, results: results });
  });
});

router.post("/results-state5/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { teachers, project_eng } = req.body;
  const stateName = "บันทึกผลการสอบหัวข้อโครงงาน";

  console.log(teachers);
  var query_mid_results =
    "INSERT INTO mid_exam_results( exam_value,exam_details,id_project,id_teacher) VALUES ?;";
  // `${props.project.name_eng} ได้ส่งแบบบันทึกผลการสอบหัวข้อโครงงานให้ ${validation[k].name} ตรวจสอบ !! `
  var query_add_notification =
    "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES ?;";

  db.query(
    query_mid_results + query_add_notification,
    [
      teachers.map((teacher) => [
        teacher.exam_value,
        teacher.exam_detail,
        idProject,
        teacher.id_teacher,
      ]),
      teachers.map((teacher) => [
        ` ${project_eng} ได้ส่งแบบบันทึกผลการสอบหัวข้อโครงงานให้ ${teacher.committee_name} ตรวจสอบ `,
        stateName,
        teacher.id_teacher,
        idProject,
      ]),
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

//success
router.post("/state-1-demo", (req, res) => {
  const {
    project_th,
    project_eng,
    project_des,
    selectedStudent,
    selectedTeacher,
  } = req.body;
  const stateName = "เสนอหัวข้อโครงงาน";
  var query_add_data_project =
    "INSERT INTO test_data_project (project_name_th,project_name_eng,project_description) VALUES (?,?,?);";
  var query_add_committee =
    "INSERT INTO committee_project (committee_name,role,id_teacher,project_id) VALUES ?;";
  var query_add_member =
    "INSERT INTO test_project (project_name_th,project_name_eng,id_project,members) VALUES ?;";
  var query_add_notification =
    "INSERT INTO notification (description,state_name,id_teacher,project_name_eng,id_project) VALUES ?;";
  var query_add_data_file =
    "INSERT INTO test_project_file (id_project) VALUE (?) ;";
  //res.send(selectedStudent);

  db.query(
    query_add_data_project,
    [project_th, project_eng, project_des],
    (err, results) => {
      if (err) {
        res.send({ status: false, message: err.message });
        console.log(err);
      }

      if (results) {
        console.log(results.insertId);
        db.query(
          query_add_committee +
            query_add_member +
            query_add_notification +
            query_add_data_file,
          [
            selectedTeacher.map((teacher) => {
              return [
                JSON.parse(teacher.teacher).name,
                teacher.role,
                JSON.parse(teacher.teacher).id,
                results.insertId,
              ];
            }),
            selectedStudent.map((student) => {
              return [project_th, project_eng, results.insertId, student.id];
            }),
            selectedTeacher.map((teacher) => {
              return [
                `${project_eng} ได้ส่งคำขอให้ ${
                  JSON.parse(teacher.teacher).name
                } เป็น ${teacher.role} ประจำโครงงาน`,
                stateName,
                JSON.parse(teacher.teacher).id,
                project_eng,
                results.insertId,
              ];
            }),
            results.insertId,
          ],
          (err_add, results_add) => {
            if (err_add) {
              console.log(err_add);
            } else {
              res.send({
                status: true,
                message: "Add Data Project to database Complete",
              });
              console.log("Add Data Project to database Complete");
            }
          }
        );
      }
      // else {
      //   res.send({
      //     status: true,
      //     message: "Add Data Project to database Complete",
      //   });
      //   console.log("Add Data Project to database Complete");
      // }
    }
  );
});

router.post("/state-6-asses/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { idTeacher, teacherName, project_eng, project_th } = req.body;

  const stateName = "ขอประเมินความก้าวหน้าของโครงงาน";
  var description = `${project_eng} ได้ส่งคำขอให้อาจารย์ที่ปรึกษาประจำ ${project_th} (${project_eng}) ประเมินความก้าวหน้าของโครงงาน `;
  console.log(description, idProject, idTeacher, teacherName);
  var query_add_notification =
    "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES (?,?,?,?);";
  db.query(
    query_add_notification,
    [description, stateName, idTeacher, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ status: true, message: "Send Asses Complete" });
      }
    }
  );
});

router.get("/asses-feedback/:idProject", (req, res) => {
  const { idProject } = req.params;
  var query_get_asses_feedback =
    "SELECT feedback FROM asses WHERE id_project = ? ;";

  db.query(query_get_asses_feedback, idProject, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 0) {
        return res.status(404).send("no data available!");
      }
      return res.send({ status: true, results: results[0] });
    }
  });
});

router.put("/next-stage/:idProject", (req, res) => {
  const { idProject } = req.params;
  console.log(idProject);

  var query_update_next_stage =
    "UPDATE test_data_project SET state = state+1 WHERE id = ? ";

  db.query(query_update_next_stage, idProject, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ status: true, message: "Update Stage" });
    }
  });
});

///complete
router.post("/state-7-test/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { idTeacher, teacherName, project_eng } = req.body;

  const stateName = "ขอสอบโครงงาน";

  var description = `${project_eng} ได้ส่งคำขอสอบโครงงานให้ ${teacherName} ได้ตรวจสอบ`;
  console.log(description, idProject, idTeacher, teacherName);

  var query_add_notification =
    "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES (?,?,?,?);";
  db.query(
    query_add_notification,
    [description, stateName, idTeacher, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ status: true, message: "Send Test Complete" });
      }
    }
  );
});

router.get("/get-test-feedback/:idProject", (req, res) => {
  const { idProject } = req.params;
  var query_test_feedback =
    "SELECT test_feedback FROM test_assess WHERE id_project = ? ORDER BY id DESC";

  db.query(query_test_feedback, [idProject], (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length == 0) {
      res.send({
        status: true,
        message: "Get test feedback complete",
        results: { test_feedback: "" },
      });
    } else {
      res.send({
        status: true,
        message: "Get test feedback complete",
        results: results[0],
      });
    }
  });
});

router.put("/back-to-stage/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { state } = req.body;

  var query_update_to_state8 =
    "UPDATE test_data_project SET state = ?,test_status = 0 WHERE id = ?;";
  var query_delete_test_feedback =
    "DELETE FROM test_assess WHERE id_project = ?;";
  db.query(
    query_update_to_state8 + query_delete_test_feedback,
    [state, idProject, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results[1]);
      res.send({ status: true, message: "Back to Stage8 complete" });
    }
  );
});

router.get("/get-teacher-state10/:idProject", (req, res) => {
  const { idProject } = req.params;
  var query_get_teachers =
    "SELECT committee_project.committee_name,committee_project.role,committee_project.id_teacher, '' AS exam_value ,'' AS exam_detail FROM committee_project WHERE project_id = ? ORDER BY committee_project.role DESC ";
  db.query(query_get_teachers, idProject, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send({ status: true, results: results });
  });
});

router.post("/results-state10/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { teachers, project_eng } = req.body;
  const stateName = "บันทึกผลการสอบโครงงาน";

  console.log(teachers);
  var query_mid_results =
    "INSERT INTO final_exam_results( exam_value,exam_details,id_project,id_teacher) VALUES ?;";
  // `${props.project.name_eng} ได้ส่งแบบบันทึกผลการสอบหัวข้อโครงงานให้ ${validation[k].name} ตรวจสอบ !! `
  var query_add_notification =
    "INSERT INTO notification (description,state_name,id_teacher,id_project) VALUES ?;";

  db.query(
    query_mid_results + query_add_notification,
    [
      teachers.map((teacher) => [
        teacher.exam_value,
        teacher.exam_detail,
        idProject,
        teacher.id_teacher,
      ]),
      teachers.map((teacher) => [
        ` ${project_eng} ได้ส่งแบบบันทึกผลการสอบหัวข้อโครงงานให้ ${teacher.committee_name} ตรวจสอบ `,
        stateName,
        teacher.id_teacher,
        idProject,
      ]),
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
        res.send(results);
      }
    }
  );
});

router.get("/get-request-state2/:idProject", (req, res) => {
  const { idProject } = req.params;
  var query_request_committees =
    "SELECT * FROM committee_project WHERE project_id = ?";
  db.query(query_request_committees, [idProject], (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length > 0) {
      let teacherStatus = [];
      results.map((result) => {
        teacherStatus.push(result.status);
      });

      const checkIsZero = teacherStatus.every((status) => status === 0);
      const checkIsOne = teacherStatus.every((status) => status === 1);

      let checkIsIfTwo = false;
      for (let i = 0; i < teacherStatus.length; i++) {
        if (teacherStatus[i] == 2) {
          checkIsIfTwo = true;
        }
      }
      //console.log(checkIsZero, checkIsOne, checkIsIfTwo);
      return res.send({
        status: true,
        data_request: results,
        checkSubmitAll: checkIsZero,
        checkNext: checkIsOne,
        checkReject: checkIsIfTwo,
        message: "get request state2 complete",
      });
    }
  });
});

router.get("/reject-teacher/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  db.query(
    "SELECT * from committee_project WHERE status = 2 AND project_id = ?",
    idProject,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      return res.send(results);
      //console.log("Update Complete");
    }
  );
});

router.get("/get-committees-state6/:idP", (req, res) => {
  const idProject = req.params.idP;
  const query_committees =
    "SELECT * from committee_project WHERE project_id = ?";
  db.query(query_committees, [idProject], (err, results) => {
    if (err) {
      console.log(err);
    }

    if (results.length > 0) {
      const teacherStatus = [];
      results.map((t) => {
        teacherStatus.push(t.status_state5);
      });

      const nextStage = teacherStatus.every(function (status) {
        return status == 1;
      });

      return res.send({ results, nextStage });
    }

    return res.send("No data in this id!");
  });
});

router.get("/get-logbook/:idP/:logbook", (req, res) => {
  const { idP, logbook } = req.params;
  const query_get_logbook =
    "SELECT * FROM logbook WHERE id_project = ? and number = ?";

  db.query(query_get_logbook, [idP, logbook], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ status: "Ok", results: results[0] });
    }
  });
});

router.post("/delete-project/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { projectData, committees, members } = req.body;

  const query_history_projectData =
    "INSERT INTO test_history_project_data (project_name_eng,project_name_th,project_id) VALUES (?,?,?);";
  const query_history_committees =
    "INSERT INTO test_history_committees (id_project,id_committee,role) VALUES ?;";
  const query_history_members =
    "INSERT INTO test_history_members (id_project,id_member) VALUE ?;";

  const query_delete_project_data =
    "DELETE FROM test_data_project WHERE id = ?;";
  const query_delete_committees =
    "DELETE  FROM committee_project WHERE project_id = ?;";
  const query_delete_members =
    "DELETE FROM test_project WHERE id_project = ?; ";
  const query_delete_files =
    "DELETE FROM test_project_file WHERE id_project = ?;";

  let pathToDir = path.join(
    path.dirname(__dirname),
    `public/uploads/${idProject}`
  );

  db.query(
    query_history_projectData,
    [
      projectData.project_name_eng,
      projectData.project_name_th,
      projectData.project_id,
    ],
    (err, results) => {
      if (err) throw err;
      if (results) {
        db.query(
          query_history_committees +
            query_history_members +
            query_delete_project_data +
            query_delete_committees +
            query_delete_members +
            query_delete_files,
          [
            committees.map((c) => {
              return [results.insertId, parseInt(c.id_teacher), c.role];
            }),
            members.map((m) => {
              return [results.insertId, parseInt(m.id)];
            }),
            idProject,
            idProject,
            idProject,
            idProject,
          ],
          (err1, results1) => {
            if (err1) throw err1;
            res.send({ results, results1, results1 });
          }
        );
      }
    }
  );

  //console.log(req.body.projectData);
  //console.log(pathToDir)
  //removeDir(pathToDir)
  // res.send(
  //   "hello"
  //   //removeDir(pathToDir)
  //   );
});
router.get("/mid-exam-result/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  console.log(idProject);
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
        });
      }
    }
  );
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
        });
      }
    }
  );
});

router.get("/get-asses-results/:idProject", (req, res) => {
  const { idProject } = req.params;
  const query_asses_results = "SELECT * FROM asses WHERE id_project = ?;";
  const query_asses_members =
    "SELECT  asses_student.id_student,asses_student.student1,asses_student.student2,asses_student.student3,asses_student.student4,CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name FROM asses_student INNER JOIN test_students ON asses_student.id_student = test_students.student_id WHERE id_project = ? ;";

  db.query(
    query_asses_results + query_asses_members,
    [idProject, idProject],
    (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.send({ asses_project: results[0][0], asses_member: results[1] });
      }
    }
  );
});

router.get("/get-asses-final/:idProject/:time", (req, res) => {
  const { idProject, time } = req.params;
  const query_asses =
    "SELECT * FROM final_assess WHERE id_project = ?  AND times = ?";

  db.query(query_asses, [idProject, time], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

router.get("/research", (req, res) => {
  const query_research = "SELECT * FROM test_research";
  db.query(query_research, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.post("/research-download", (req, res) => {
  const file = req.body.file;
  const path = __basedir + `/public/uploads/`;
  console.log(file)
  res.download(`${path}${file}`, (err) => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
});

router.post("/research/:idProject", (req, res) => {
  const { idProject } = req.params;
  const query_final_file =
    "SELECT final_file FROM test_project_file WHERE id_project = ?;SELECT * FROM test_data_project WHERE id = ?;";
  const query_add_research =
    "INSERT INTO test_research(id_project,file_project,project_name_th,project_name_eng,project_description) VALUE (?,?,?,?,?); ";

  db.query(query_final_file, [idProject, idProject], (err1, results1) => {
    if (err1) {
      res.send(err1);
    } else {
      if (results1[0].length === 0 && results1[1].length === 0) {
        res.send("No data");
      } else {
        //res.send(results1);
        db.query(
          query_add_research,
          [
            idProject,
            results1[0][0].final_file,
            results1[1][0].project_name_th,
            results1[1][0].project_name_eng,
            results1[1][0].project_description,
          ],
          (err2, results2) => {
            if (err2) {
              res.send(err2);
            } else {
              res.send("Add data Complete");
            }
          }
        );
      }
    }
  });
});

module.exports = router;
