const express = require("express");
const router = express.Router();
const db = require("../config/db");
var SqlString = require("sqlstring");

router.post("/addproject", (req, res) => {
  const project_th = req.body.project_th;
  const project_eng = req.body.project_eng;
  const members = req.body.members;

  db.query(
    "INSERT INTO test_project (project_name_th,project_name_eng,members) VALUES (?,?,?)",
    [project_th, project_eng, members],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );

  //console.log(memberID.length)
  // var result = memberID.map(function (x) {
  //      return parseInt(x, 10);
  //     });

  //console.log(memberID);

  //  db.query("INSERT INTO project (project_name_th,project_name_eng,members) VALUES (?,?,?)",[project_th,project_eng,memberID] ,(err,results) => {
  //      if(err) {
  //         console.log(err)
  //      }
  //      res.send(results)
  // })
  // if (memberID.length == 1){

  //      db.query("INSERT INTO project (project_name_th,project_name_eng,members) VALUES (?,?,'[?]');",[project_th,project_eng,memberID],(err,results)=>{

  //         if (err){
  //             console.log(err)
  //         }
  //         res.send(results)
  //     })

  // }else if (memberID.length == 2){
  //     db.query("INSERT INTO `test` (`test`) VALUES ('[?,?]');",memberID,(err,results)=>{

  //         if (err){
  //             console.log(err)
  //         }
  //         res.send(results)
  //     })

  // }else if (memberID.length == 3){
  //     db.query("INSERT INTO `test` (`test`) VALUES ('[?,?,?]');",memberID,(err,results)=>{

  //     if (err){
  //         console.log(err)
  //     }
  //     res.send(results)
  //     })
  // }
  // db.query("SELECT * FROM test" ,(err,results) => {
  //     if(err) {
  //         console.log(err)
  //     }
  //     if (results.length > 0)

  //     res.send({test : JSON.parse(results[2].test)})
  // })
});

router.post("/addprojecttest", (req, res) => {
  const project_th = req.body.project_th;
  const project_eng = req.body.project_eng;

  db.query(
    "INSERT INTO project (project_name_th,project_name_eng) VALUES (?,?)",
    [project_th, project_eng],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

router.post("/addstudentproject", (req, res) => {
  const project_th = req.body.project_th;
  const project_eng = req.body.project_eng;
  const student_name = req.body.student_name;

  db.query(
    "INSERT INTO student_project (project_name_th,student_name,project_name_eng) VALUES (?,?,?)",
    [project_th, student_name, project_eng],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});
//add commit in project
router.post("/addcommitproject", (req, res) => {
  const committee_name = req.body.committee_name;
  const role = req.body.role;
  const id_teacher = req.body.id_teacher;
  const project_eng = req.body.project_eng;
  db.query(
    "INSERT INTO committee_project (committee_name,role,id_teacher,project_name_eng) VALUES (?,?,?,?)",
    [committee_name, role, id_teacher, project_eng],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});
//delete commit project
router.delete("/deletecommitproject", (req, res) => {
  const id_teacher = req.body.id_teacher;
  const project_eng = req.body.project_eng;

  //res.send({message:id_teacher+project_eng})
  db.query(
    "DELETE FROM committee_project WHERE id_teacher = ? AND project_name_eng = ? ",
    [id_teacher, project_eng],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("8;pppp");
    }
  );
});

router.get("/getproject/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM test_project WHERE id_project = ? ",
    id,
    (err, results) => {
      if (err) {
        console.log(err);
      }

      res.send({
        project_name_th: results[0].project_name_th,
        project_name_eng: results[0].project_name_eng,
      });
    }
  );
});

router.get("/getrequest/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM committee_project WHERE project_name_eng = ? ",
    id,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

router.get("/getmainproject/:projectname", (req, res) => {
  const projectName = req.params.projectname;
  db.query(
    "SELECT * FROM test_data_project WHERE project_name_eng = ?",
    projectName,
    (err, results) => {
      if (err) {
        console.log(err);
      }

      res.send(results[0]);
    }
  );
});

router.post("/addwait", (req, res) => {
  const project_th = req.body.project_th;
  const committee_name = req.body.committee_name;
  const pos = req.body.pos;
  const username = req.body.username;
  db.query(
    "INSERT INTO waiting (project_name_th,committee_name,pos,username_teacher) VALUES (?,?,?,?)",
    [project_th, committee_name, pos, username],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

router.put("/nextstage/:projectid", (req, res) => {
  const projectId = req.params.projectid;

  db.query(
    "UPDATE test_data_project SET state = state+1 WHERE id = ? ",
    projectId,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("UPDATE COMPLETE");
    }
  );
});

//get project by ID student
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

router.get("/testPush/commits/:namep", (req, res) => {
  const namep = req.params.namep;
  var query = "SELECT * FROM committee_project WHERE project_name_eng  = ?";

  db.query(query, namep, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length == 0) {
      res.send([{ committee_name: null, pos: null }]);
    } else {
      res.send(results);
    }

    console.log("Get Project By " + namep + "!!!");
  });
});

router.get("/testPush/members/:namep", (req, res) => {
  const namep = req.params.namep;
  var query =
    "SELECT student_project.student_name,students.name_th,students.lastname_th FROM student_project INNER JOIN students ON student_project.student_name = students.student_id  WHERE project_name_eng  = ?";

  db.query(query, namep, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (results.length == 0) {
      res.send([
        {
          student_name: null,
        },
      ]);
    } else {
      res.send(results);
    }
    console.log("Get Project By " + namep + "!!!");
  });
});

//"SELECT project.project_name_eng, project.project_name_th, committee_project.committee_name  FROM project INNER JOIN committee_project ON project.project_name_eng = committee_project.project_name_eng WHERE project.project_name_eng = ?

///get data project from clients

router.post("/addprojectdatatest", (req, res) => {
  const project_th = req.body.project_th;
  const project_eng = req.body.project_eng;
  const project_des = req.body.project_des;

  db.query(
    "INSERT INTO test_data_project (project_name_th,project_name_eng,project_description) VALUES (?,?,?)",
    [project_th, project_eng, project_des],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("Update Complete");
    }
  );
});

///remind name project
router.get("/rejectteacher/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  db.query(
    "SELECT * from committee_project WHERE status = 2 AND project_id = ?",
    idProject,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
      console.log("Update Complete");
    }
  );
});

router.delete("/deleterejectteacher", (req, res) => {
  db.query("DELETE FROM committee_project WHERE status=2", (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
    console.log("Delete Complete");
  });
});

///pull data from teacherID

router.get("/getprojectbyteacher/:id/:status", (req, res) => {
  const id = req.params.id;
  const status = req.params.status;

  var query_all_project =
    "SELECT   test_data_project.project_id,test_data_project.state,test_data_project.project_name_th AS project_th ,test_data_project.id FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? ";
  var query_advisor = "SELECT   test_data_project.project_id,test_data_project.state,test_data_project.project_name_th AS project_th ,test_data_project.id FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? AND role = 'อาจารย์ที่ปรึกษา';"
  var query_coAdvisor = "SELECT   test_data_project.project_id,test_data_project.state,test_data_project.project_name_th AS project_th ,test_data_project.id FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? AND role = 'อาจารย์ที่ปรึกษาร่วม';"
  var query_committee = "SELECT   test_data_project.project_id,test_data_project.state,test_data_project.project_name_th AS project_th ,test_data_project.id FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? AND role = 'กรรมการ';"
  if (status == 1) {
    db.query(query_all_project, [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  }
  if (status == 2) {
    db.query(query_advisor, [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  }
  if (status == 3) {
    db.query(query_coAdvisor, [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  }
  if (status == 4) {
    db.query(query_committee, [id], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    });
  }
  

  // db.query(
  //   " SELECT   test_data_project.project_id,test_data_project.state,test_data_project.project_name_th AS project_th ,test_data_project.id FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? AND role = 'อาจารย์ที่ปรึกษา';SELECT  test_data_project.project_id,test_data_project.state,test_data_project.project_name_th AS project_th ,test_data_project.id FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id WHERE id_teacher = ? AND role = 'อาจารย์ที่ปรึกษาร่วม'; SELECT  test_data_project.project_id,test_data_project.state,test_data_project.project_name_th AS project_th ,test_data_project.id FROM committee_project INNER JOIN test_data_project ON committee_project.project_id = test_data_project.id  WHERE id_teacher = ? AND role = 'กรรมการ';" ,
  //   [id,id,id],
  //   (err, results) => {
  //     if (err) {
  //       console.log(err);
  //     }

  //     // var advisor=[]
  //     // var committee=[]
  //     // var co_advisor =[]

  //     // for (let i = 0; i < results.length;i++){
  //     //   if(results[i].role=="อาจารย์ที่ปรึกษา"){
  //     //     advisor.push({id:results[i].project_id ,project_name_eng:results[i].project_name_eng})
  //     //   }
  //     //   else if (results[i].role=="อาจารย์ที่ปรึกษาร่วม"){
  //     //     co_advisor.push(results[i].project_id)
  //     //   }
  //     //   else if (results[i].role=="กรรมการ"){
  //     //     committee.push(results[i].project_id)
  //     //   }

  //     // }

  //     //res.send({advisor:advisor,co_advisor:co_advisor,committee:committee});
  //     res.send({
  //       advisor : results[0],
  //       co_advisor : results[1],
  //       committee : results[2]

  //     });
  //     console.log("Get data Complete");
  //   }
  // );
});

///pull dataproject from projectNameEng WHERE project_name_eng = 'project1'

router.get("/getprojectbyname/:name", (req, res) => {
  const name = req.params.name;
  db.query(
    "SELECT *  FROM test_project INNER JOIN  test_students ON test_project.members = test_students.student_id WHERE test_project.project_name_eng = ?  ",
    [name],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      let projectMem = [];
      for (let i = 0; i < results.length; i++) {
        projectMem.push({
          id: results[i].student_id,
          name:
            results[i].prefix_th +
            " " +
            results[i].student_name_th +
            " " +
            results[i].student_lastname_th,
        });
      }

      db.query(
        "SELECT * from committee_project WHERE project_name_eng = ?",
        [name],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }

          let teacher = [];
          for (let i = 0; i < results1.length; i++) {
            teacher.push({
              teacher_name: results1[i].committee_name,
              role: results1[i].role,
              status: results1[i].status,
              id_teacher: results1[i].id_teacher,
            });
          }

          db.query(
            "SELECT * from test_data_project WHERE project_name_eng = ?",
            [name],
            (err2, results2) => {
              if (err2) {
                console.log(err2);
              }

              res.send({
                project_th: results[0].project_name_th,
                project_eng: results[0].project_name_eng,
                state: results[0].state,
                logbook: results[0].logbook,
                id_project: results2[0].project_id,
                name: projectMem,
                teachers: teacher,
                description: results2[0].project_description,
              });
            }
          );
        }
      );
    }
  );
});

///pull all project

router.get("/getallproject", (req, res) => {
  db.query("SELECT *  FROM test_data_project ", (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
    console.log("Delete Complete");
  });
});

// submitted
router.put("/submitted/:project_name/:id", (req, res) => {
  const id = req.params.id;
  const project_name = req.params.project_name;
  db.query(
    "UPDATE committee_project SET status = 1  WHERE id_teacher = ? and project_name_eng = ?",
    [id, project_name],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send({ message: "submitted complete" });
    }
  );
});

//rejected
router.put("/rejected/:project_name/:id", (req, res) => {
  const id = req.params.id;
  const project_name = req.params.project_name;
  db.query(
    "UPDATE committee_project SET status = 2  WHERE id_teacher = ? and project_name_eng = ?",
    [id, project_name],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send({ message: "reject complete" });
    }
  );
});

//update project ID

router.put("/updateidbyname/:project_name", (req, res) => {
  const id_project = req.body.id_project;
  const project_name = req.params.project_name;
  let str = req.body.id_project.toString();
  str = str.padStart(2, 0);
  var id_project_new = "CPE" + str;
  db.query(
    "UPDATE test_project SET id_project = ?  WHERE  project_name_eng = ?",
    [id_project, project_name],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "UPDATE test_data_project SET project_id = ?  WHERE  project_name_eng = ?",
        [id_project, project_name],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }

          db.query(
            "UPDATE committee_project SET project_id = ?  WHERE  project_name_eng = ?",
            [id_project, project_name],
            (err2, results2) => {
              if (err2) {
                console.log(err2);
              }

              res.send({
                message: `Update ID ${id_project_new}  in ${project_name} Successful!!`,
                results: results,
                results1: results1,
                results2: results2,
              });
            }
          );
        }
      );
    }
  );
});

router.post("/examresult", (req, res) => {
  const exam_value = req.body.exam_value;
  const exam_details = req.body.exam_details;
  const id_project = req.body.id_project;
  const id_teacher = req.body.id_teacher;

  db.query(
    "INSERT INTO mid_exam_results( exam_value,exam_details,id_project,id_teacher) VALUES (?,?,?,?)",
    [exam_value, exam_details, id_project, id_teacher],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      res.send("Post Result Exam Complete!!");
    }
  );
});

router.get("/examresult/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT  mid_exam_results.exam_status,mid_exam_results.id_teacher, mid_exam_results.exam_value,mid_exam_results.exam_details,committee_project.committee_name,committee_project.role,committee_project.project_name_eng,committee_project.project_id FROM mid_exam_results INNER JOIN committee_project ON mid_exam_results.id_teacher = committee_project.id_teacher where committee_project.project_id =  ?  and mid_exam_results.id_project = ?",
    [id, id],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      //res.send(results);
      db.query(
        "SELECT * from test_data_project WHERE id = ?  ",
        [id],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }
          res.send({
            results: results,
            project: results1[0],
          });
        }
      );
    }
  );
});

router.put("/examresult/:idTeacher", (req, res) => {
  const idTeacher = req.params.idTeacher;
  const idProject = req.body.idProject;
  const edit = req.body.edit;

  db.query(
    " UPDATE mid_exam_results SET exam_details = CONCAT(exam_details, ? ) , exam_status = 1  WHERE id_teacher = ? and id_project = ?",
    [edit, idTeacher, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("update exam result !!");
    }
  );
  //res.send(idProject)
});

router.get("/getexamresult/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  db.query("SELECT * from ");
});
router.put("/updateresult/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    " UPDATE mid_exam_results SET exam_status = 1  WHERE id_teacher = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("accept exam result !!");
    }
  );
});

// router.post("/asses", (req, res) => {
//   const id = req.body.id;
//   const asses1 = req.body.asses1;
//   const asses2 = req.body.asses2;
//   const asses3 = req.body.asses3;
//   const asses4 = req.body.asses4;
//   const asses5 = req.body.asses5;
//   const feedback = req.body.feedback;

//   db.query(
//     "INSERT INTO asses (id_project,asses1,asses2,asses3,asses4,asses5,feedback) VALUES (?,?,?,?,?,?,?) ",
//     [id, asses1, asses2, asses3, asses4, asses5, feedback],
//     (err, results) => {
//       if (err) {
//         console.log(err);
//       }
//       res.send("insert to database complete");
//     }
//   );
// });

router.get("/asses/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM asses WHERE id_project = ? ",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      db.query(
        "SELECT  asses_student.id_student,asses_student.student1,asses_student.student2,asses_student.student3,asses_student.student4,test_students.prefix_th,test_students.student_name_th,test_students.student_lastname_th  FROM asses_student INNER JOIN test_students on asses_student.id_student = test_students.student_id  WHERE id_project = ? ",
        [id],
        (err1, results1) => {
          if (err) {
            console.log(err1);
          }
          //res.send({ asses: results, asses_student: results1 });
          db.query(
            "SELECT * FROM test_data_project WHERE id = ? ",
            [id],
            (err2, results2) => {
              if (err2) {
                console.log(err2);
              }
              res.send({
                asses: results,
                asses_student: results1,
                project_data: results2,
              });
            }
          );
        }
      );
    }
  );
});

router.post("/asses_student", (req, res) => {
  const id_student = req.body.id_student;
  const student1 = req.body.student1;
  const student2 = req.body.student2;
  const student3 = req.body.student3;
  const student4 = req.body.student4;
  const student_name = req.body.student_name;

  db.query(
    "INSERT INTO asses_student(id_student,student1,student2,student3,student4) VALUES (?,?,?,?,?,?)",
    [id_student, student1, student2, student3, student4, student_name],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("insert into asses student complete");
    }
  );
});

router.put("/update/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "UPDATE test_project SET state = state+1 WHERE id_project = ?  ",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("Update Complete");
    }
  );
});

router.get("/allproject", (req, res) => {
  db.query("SELECT * FROM test_data_project", (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send(results);
  });
});

router.delete("/deleterejecteacher/:idteacher", (req, res) => {
  const id_teacher = req.params.idteacher;
  const project = req.body.project;
  db.query(
    "DELETE FROM committee_project WHERE id_teacher = ? and project_name_eng = ? ",
    [id_teacher, project],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("delete teacher from project complete");
      console.log(id_teacher, project);
    }
  );
});

router.put("/editid/:idprimary", (req, res) => {
  const idProject = req.body.idProject;
  const idPrimary = req.params.idprimary;
  const projectName = req.body.projectName;
  db.query(
    "UPDATE test_data_project SET project_id = ? WHERE id = ? ",

    [idProject, idPrimary],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      console.log(projectName);
      db.query(
        "UPDATE committee_project SET project_id = ? WHERE project_name_eng = ?",
        [idPrimary, projectName],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }

          db.query(
            "UPDATE test_project set id_project = ? WHERE project_name_eng = ?  ",
            [idPrimary, projectName],
            (err2, results2) => {
              if (err2) {
                console.log(err2);
              }

              res.send("update complete!");
            }
          );
        }
      );

      //console.log(id_teacher,project)
    }
  );
});

router.get("/getcommittee/:idP", (req, res) => {
  const idProject = req.params.idP;
  db.query(
    "SELECT * from committee_project WHERE project_id = ?",
    [idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

router.get("/showfile/:idproject", (req, res) => {
  const idProject = req.params.idproject;
  var fullUrl =
    req.protocol +
    "://" +
    req.get("host") +
    "/" +
    idProject +
    "/state3file.pdf";
  res.send(fullUrl);
});

router.get("/showfilestate9/:idproject", (req, res) => {
  const idProject = req.params.idproject;
  var fullUrl =
    req.protocol +
    "://" +
    req.get("host") +
    "/" +
    idProject +
    "/state9file.pdf";
  res.send(fullUrl);
});

router.get("/showfilefinalstate/:idproject", (req, res) => {
  const idProject = req.params.idproject;
  var fullUrl =
    req.protocol + "://" + req.get("host") + "/" + idProject + "/finalfile.pdf";
  res.send(fullUrl);
});

router.put("/validationstate3/:idproject", (req, res) => {
  const idProject = req.params.idproject;
  const idTeacher = req.body.idTeacher;
  db.query(
    "UPDATE committee_project set status_state3  = 1 WHERE project_id = ? AND id_teacher = ? ",
    [idProject, idTeacher],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("ValidationState3 Complete");
    }
  );
});

router.put("/validationstate5/:idproject", (req, res) => {
  const idProject = req.params.idproject;
  const idTeacher = req.body.idTeacher;
  db.query(
    "UPDATE committee_project set status_state5  = 1 WHERE project_id = ? AND id_teacher = ? ",
    [idProject, idTeacher],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("ValidationState5 Complete");
    }
  );
});

router.post("/studentasses/:idProject", (req, res) => {
  const idStudent = req.body.idStudent;
  const idProject = req.params.idProject;
  db.query(
    "INSERT INTO asses_student(id_student,id_project) VALUE (?,?)",
    [idStudent, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      res.send(results);
    }
  );
});

router.post("/asses/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  db.query(
    "INSERT INTO asses(id_project) VALUE (?) ",
    [idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

router.put("/asses/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const asses1 = req.body.asses1;
  const asses2 = req.body.asses2;
  const asses3 = req.body.asses3;
  const asses4 = req.body.asses4;
  const asses5 = req.body.asses5;
  const feedback = req.body.feedback;
  const assesStatus = req.body.assesStatus;

  db.query(
    "UPDATE asses SET asses1 = ? , asses2 = ? ,asses3=? ,asses4 = ?,asses5 = ?,feedback = ? WHERE id_project =?   ",
    [asses1, asses2, asses3, asses4, asses5, feedback, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      db.query(
        "UPDATE test_data_project SET asses_status = ? WHERE id = ? ",
        [assesStatus, idProject],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }
          res.send({
            result: results,
            results1: results1,
          });
        }
      );
      //res.send(results)
    }
  );
});

router.put("/asses_student/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const idStudent = req.body.idStudent;
  const student1 = req.body.student1;
  const student2 = req.body.student2;
  const student3 = req.body.student3;
  const student4 = req.body.student4;

  db.query(
    "UPDATE asses_student SET student1 = ? ,student2 = ? ,student3 = ? ,student4=? WHERE id_project = ? AND id_student = ?  ",
    [student1, student2, student3, student4, idProject, idStudent],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send("hello1");
    }
  );
});

router.post("/logbook/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const date = req.body.date;
  const summary = req.body.summary;
  const problem = req.body.problem;
  const solution = req.body.solution;
  const nextDate = req.body.nextDate;
  const number = req.body.number;

  db.query(
    "INSERT INTO logbook(id_project,date,summary,problem,solution,next_date,number)  VALUE (?,?,?,?,?,?,?)",
    [idProject, date, summary, problem, solution, nextDate, number],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "UPDATE test_data_project set logbook = logbook+1 WHERE id = ?",
        [idProject],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }
          res.send("complete");
        }
      );
    }
  );
});

router.post("/cancel/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const stateName = "เสนอหัวข้อโครงงาน";
  const projectName = req.body.projectName;

  db.query(
    "DELETE FROM test_data_project WHERE id = ? ",
    [idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "DELETE FROM committee_project WHERE project_name_eng = ? AND project_id = 0 ",
        [projectName],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }
          db.query(
            "DELETE FROM test_project WHERE project_name_eng = ? AND id_project = 0",
            [projectName],
            (err2, results2) => {
              if (err2) {
                console.log(err2);
              }
              db.query(
                "DELETE FROM notification WHERE project_name_eng = ? AND state_name = ? ",
                [projectName, stateName],
                (err3, results3) => {
                  if (err3) {
                    console.log(err3);
                  }
                  res.send("Cancel Complete");
                }
              );
            }
          );
        }
      );
    }
  );
});

router.get("/testtest/:id", (req, res) => {
  db.query(
    "SELECT * FROM test_project WHERE members =  ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

router.get("/getprojectbyid/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  db.query(
    "SELECT * FROM test_data_project WHERE id = ? ",
    [idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "SELECT test_project.members AS id_student,test_students.prefix_th,test_students.student_name_th,test_students.student_lastname_th FROM test_project INNER JOIN test_students on test_project.members = test_students.student_id  WHERE id_project = ? ",
        [idProject],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }

          db.query(
            "SELECT id_teacher,committee_name,role FROM committee_project  WHERE project_id =? ORDER BY role",
            [idProject],
            (err2, results2) => {
              if (err2) {
                console.log(err2);
              }

              db.query(
                "SELECT * FROM final_assess WHERE id_project = ?",
                [idProject],
                (err3, results3) => {
                  if (err3) {
                    console.log(err3);
                  }
                  res.send({
                    data_project: results[0],
                    members: results1,
                    committees: results2,
                    final_assess: results3[0],
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

router.get("/test-feedBack/:idProject", (req, res) => {
  //const testFeedback = req.body.testFeedback
  const idProject = req.params.idProject;
  db.query(
    "SELECT test_feedback  FROM  test_assess  WHERE id_project = ?",
    [idProject],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

router.post("/test-feedBack/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  db.query(
    "INSERT INTO test_assess(id_project) VALUE (?)",
    [idProject],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send("Complete");
    }
  );
});

router.put("/test-feedBack/:idProject", (req, res) => {
  const testFeedback = req.body.testFeedback;
  const idProject = req.params.idProject;
  db.query(
    "UPDATE  test_assess SET test_feedback = ? WHERE id_project = ?",
    [testFeedback, idProject],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send("Update Complete");
    }
  );
});

router.put("/test-feedBackStatus/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const status = req.body.status;
  if (status == 1) {
    db.query(
      " UPDATE test_data_project SET test_status = 1 WHERE id = ? ",
      [idProject],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        res.send(results);
      }
    );
  } else {
    db.query(
      " UPDATE test_data_project SET test_status = 2 WHERE id = ? ",
      [idProject],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        res.send(results);
      }
    );
  }
});

router.put("/backToStage/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const state = req.body.state;
  db.query(
    "UPDATE test_data_project SET state = ?,test_status = 0 WHERE id = ?",
    [state, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      res.send(results);
    }
  );
});

router.post("/finalexamresult", (req, res) => {
  const { exam_value, exam_details, id_project, id_teacher } = req.body;
  db.query(
    "INSERT INTO final_exam_results(exam_value,exam_details,id_project,id_teacher) VALUES (?,?,?,?)",
    [exam_value, exam_details, id_project, id_teacher],
    (err, results) => {
      if (err) {
        console.log(err);
      }

      res.send("Post Final Result Exam Complete!!");
    }
  );
});

router.get("/finalexamresult/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT final_exam_results.exam_status,final_exam_results.id_teacher,final_exam_results.exam_value,final_exam_results.exam_details,committee_project.committee_name,committee_project.role,committee_project.project_name_eng,committee_project.project_id FROM final_exam_results INNER JOIN committee_project ON final_exam_results.id_teacher = committee_project.id_teacher where committee_project.project_id =  ?  and final_exam_results.id_project = ?",
    [id, id],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      //res.send(results);
      db.query(
        "SELECT * from test_data_project WHERE id = ?  ",
        [id],
        (err1, results1) => {
          if (err1) {
            console.log(err1);
          }
          res.send({
            results: results,
            project: results1[0],
          });
        }
      );
    }
  );
});

router.get("/hello", (req, res) => {
  db.query(
    "SELECT * FROM test_data_project wHERE id_u = 1; SELECT * FROM student_project; SELECT  * FROM committee_project",
    (err, results) => {
      if (err) {
        res.status(400).json({ err: err });
      } else {
        res
          .status(201)
          .json({
            results1: results[0],
            results2: results[1],
            results3: results[2],
          });
      }
      //db.destroy();
    }
  );
});

module.exports = router;

// db.query("UPDATE committee_project SET project_id = ? WHERE project_name_eng = ?",[idPrimary,projectName],(err1,results1)=>{
