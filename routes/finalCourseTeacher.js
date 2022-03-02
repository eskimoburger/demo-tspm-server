const express = require("express");
const router = express.Router();
const db = require("../config/db");

//

router.get("/all-project", (req, res) => {
  //res.send("hello")

  var query_all_project = "SELECT * FROM test_data_project";

  db.query(query_all_project, (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send({
      status: true,
      message: "Get All data complete",
      results: results,
    });
  });
});

router.get("/get-project/:idProject", (req, res) => {
  const { idProject } = req.params;

  var query_project = "SELECT * FROM test_data_project WHERE id = ?;";
  var query_members =
    "SELECT test_project.members AS id , CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name FROM test_project INNER JOIN test_students ON test_project.members = test_students.student_id WHERE id_project = ? ;";

  var query_committees =
    "SELECT id_teacher,committee_name,role,status FROM committee_project  WHERE project_id = ?  ORDER BY role;";
  db.query(
    query_project + query_members + query_committees,
    [idProject, idProject, idProject],
    (err, results) => {
      if (err) {
        console.log(err);
      } else if (results[2].length > 0) {
        const CheckIsOne = (number) => number == 1;
        var status = [];
        results[2].map((result) => {
          status.push(result.status);
        });
        const Check = status.every(CheckIsOne);

        res.send({
          status: true,
          results: {
            project: results[0][0],
            members: results[1],
            committees: results[2],
            status: Check,
          },
        });
      } else {
        res.send({
          status: true,
          results: {
            project: results[0][0],
            members: results[1],
            committees: results[2],
          },
        });
      }
    }
  );
});

router.put("/update-project/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { projectId } = req.body;
  var query_update_project =
    "UPDATE test_data_project set project_id = ? WHERE id =?";
  db.query(query_update_project, [projectId, idProject], (err, results) => {
    if (err) {
      console.log(err);
    }
    res.send({ status: true, message: "Update Project_ID complete" });
  });
});

router.get("/project-asses/:idProject", (req, res) => {
  const { idProject } = req.params;

  var query_data_project =
    "SELECT id,project_name_eng,project_name_th,project_id FROM test_data_project WHERE id = ?;";

  var query_members =
    "SELECT test_project.members AS id , CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name FROM test_project INNER JOIN test_students ON test_project.members = test_students.student_id WHERE id_project = ? ;";

  var query_committees =
    "SELECT id_teacher,committee_name,role,status FROM committee_project  WHERE project_id = ?  ORDER BY role;";

  db.query(
    query_data_project + query_members + query_committees,
    [idProject, idProject, idProject],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).json({
        status: true,
        data_project: {
          project: results[0][0],
          members: results[1],
          committees: results[2],
        },
      });
    }
  );
});
//inProgress
router.post("/project-asses/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { final, finalStatus, idNotification } = req.body;

  var query_add_final_asses =
    " INSERT INTO final_assess (id_project,final1,final2,final3,final4) VALUE (?,?,?,?,?); ";
  var query_add_final_asses_status_2 =
    " INSERT INTO final_assess (id_project,final1,final2,final3,final4,final_details) VALUE (?,?,?,?,?,?); ";
  var query_delete_notification =
    "DELETE FROM course_notification WHERE id_noti = ?;";

  var query_update_final_asses =
    "UPDATE test_data_project SET final_asses = ? WHERE id = ?;";
  var query_update_count =
    "UPDATE test_data_project SET final_count = final_count+1 WHERE id = ?;";

  if (finalStatus == 1) {
    db.query(
      query_add_final_asses +
        query_delete_notification +
        query_update_final_asses,
      [
        idProject,
        final.final1,
        final.final2,
        final.final3,
        final.final4,
        idNotification,
        finalStatus,
        idProject,
      ],
      (err, results) => {
        if (err) throw err;
        res.send("hello");
      }
    );
  } else if (finalStatus == 2) {
    db.query(
      query_add_final_asses_status_2 +
        query_delete_notification +
        query_update_final_asses +
        query_update_count,
      [
        idProject,
        final.final1,
        final.final2,
        final.final3,
        final.final4,
        final.finalDetails,
        idNotification,
        finalStatus,
        idProject,
        idProject,
      ],
      (err, results) => {
        if (err) throw err;
        res.send("hello2");
      }
    );
  }

  console.log(idProject, final, idNotification);
  //res.send("Hello")
});

router.put("/project-asses/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { final, finalStatus, idNotification } = req.body;

  var query_update_final_asses =
    "UPDATE final_assess SET final1 = ?,final2 = ?,final3 = ?,final4 = ? WHERE id_project = ?;";

  var query_update_final_asses_project =
    "UPDATE test_data_project SET final_asses = ? WHERE id = ?;";

  //var query

  db.query(
    query_update_final_asses + query_update_final_asses_project,
    [
      final.final1,
      final.final2,
      final.final3,
      final.final4,
      idProject,
      finalStatus,
      idProject,
    ],
    (err, results) => {
      if (err) throw err;
      res.send("UPDATE COMPLETE");
    }
  );
});
router.get("/get-logbooks/:idProject", (req, res) => {
  const { idProject } = req.params;
});

router.get("/get-history/:idStudent", (req, res) => {
  const { idStudent } = req.params;
  const query_history_student =
    "SELECT id_project,CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name,id_member FROM test_history_members INNER JOIN test_students ON test_history_members.id_member = test_students.student_id WHERE id_member=?;";
  const query_history_project_data =
    "SELECT * FROM test_history_project_data WHERE id in (?) ORDER BY id DESC;";
  const query_history_members =
    "SELECT id_project,CONCAT(test_students.prefix_th,' ',test_students.student_name_th,' ',test_students.student_lastname_th) AS name,id_member FROM test_history_members INNER JOIN test_students ON test_history_members.id_member = test_students.student_id WHERE id_project in (?);";
  const query_history_committees =
    "SELECT * FROM test_history_committees INNER JOIN teachers ON test_history_committees.id_committee = teachers.id WHERE id_project in (?); ";

  //     SELECT column_name(s)
  // FROM table1
  // INNER JOIN table2
  // ON table1.column_name = table2.column_name ;
  db.query(query_history_student, [idStudent], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      db.query(
        query_history_project_data +
          query_history_members +
          query_history_committees,
        [
          results.map((r) => {
            return [r.id_project];
          }),
          results.map((r) => {
            return [r.id_project];
          }),
          results.map((r) => {
            return [r.id_project];
          }),
        ],
        (err1, results1) => {
          if (err1) throw err1;
          res.send({
            user: results[0],
            projectData: results1[0],
            members: results1[1],
            committees: results1[2],
          });
        }
      );
    } else {
      res.status(404).send("No data");
    }
  });
});

router.get("/get-final-file/:idProject", (req, res) => {
  const idProject = req.params.idProject;
  const query_final_file =
    "SELECT final_file FROM test_project_file WHERE id_project = ? ;";
  db.query(query_final_file, [idProject], (err, result) => {
    if (err) throw err;

    if (result.length >= 0) {
      const fullUrl =
        req.protocol + "s://" + req.get("host") + "/" + result[0]?.final_file;
      res.send(fullUrl);
    } else {
      res.status(404).send("No data");
    }
  });
});

router.post("/edit-asses/:idProject", (req, res) => {
  const { idProject } = req.params;
  const { final, finalStatus, idNotification, time } = req.body;

  var query_add_final_asses =
    " INSERT INTO final_assess (id_project,final1,final2,final3,final4,times) VALUE (?,?,?,?,?,?); ";
  var query_add_final_asses_status_2 =
    " INSERT INTO final_assess (id_project,final1,final2,final3,final4,final_details,times) VALUE (?,?,?,?,?,?,?); ";
  var query_delete_notification =
    "DELETE FROM course_notification WHERE id_noti = ?;";

  var query_update_final_asses =
    "UPDATE test_data_project SET final_asses = ? WHERE id = ?;";
  var query_update_count =
    "UPDATE test_data_project SET final_count = final_count+1 WHERE id = ?;";

  if (finalStatus == 1) {
    db.query(
      query_add_final_asses +
        query_delete_notification +
        query_update_final_asses,
      [
        idProject,
        final.final1,
        final.final2,
        final.final3,
        final.final4,
        time,
        idNotification,
        finalStatus,
        idProject,
      ],
      (err, results) => {
        if (err) throw err;
        res.send("hello");
      }
    );
  } else if (finalStatus == 2) {
    db.query(
      query_add_final_asses_status_2 +
        query_delete_notification +
        query_update_final_asses +
        query_update_count,
      [
        idProject,
        final.final1,
        final.final2,
        final.final3,
        final.final4,
        final.finalDetails,
        time,
        idNotification,
        finalStatus,
        idProject,
        idProject,
      ],
      (err, results) => {
        if (err) throw err;
        res.send("hello2");
      }
    );
  }

  console.log(idProject, final, idNotification);
  //res.send("Hello")
});

router.get("/get-asses/:idProject/:time", (req, res) => {
  const { idProject, time } = req.params;
  const query_asses =
    "SELECT * FROM final_assess WHERE id_project = ?  AND times = ?";

  db.query(query_asses, [idProject, time], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// router.post("/project-asses/:idProject", (req, res) => {
//   const { idProject } = req.params;
//   const { final, finalStatus, idNotification } = req.body;

//   var query_add_final_asses =
//     " INSERT INTO final_assess (id_project,final1,final2,final3,final4) VALUE (?,?,?,?,?); ";
//   var query_add_final_asses_status_2 =
//     " INSERT INTO final_assess (id_project,final1,final2,final3,final4,final_details) VALUE (?,?,?,?,?,?); ";
//   var query_delete_notification =
//     "DELETE FROM course_notification WHERE id_noti = ?;";

//   var query_update_final_asses =
//     "UPDATE test_data_project SET final_asses = ? WHERE id = ?;";
//   var query_update_count =
//     "UPDATE test_data_project SET final_count = final_count+1 WHERE id = ?;";

//   if (finalStatus == 1) {
//     db.query(
//       query_add_final_asses +
//         query_delete_notification +
//         query_update_final_asses,
//       [
//         idProject,
//         final.final1,
//         final.final2,
//         final.final3,
//         final.final4,
//         idNotification,
//         finalStatus,
//         idProject,
//       ],
//       (err, results) => {
//         if (err) throw err;
//         res.send("hello");
//       }
//     );
//   } else if (finalStatus == 2) {
//     db.query(
//       query_add_final_asses_status_2 +
//         query_delete_notification +
//         query_update_final_asses +
//         query_update_count,
//       [
//         idProject,
//         final.final1,
//         final.final2,
//         final.final3,
//         final.final4,
//         final.finalDetails,
//         idNotification,
//         finalStatus,
//         idProject,
//         idProject,
//       ],
//       (err, results) => {
//         if (err) throw err;
//         res.send("hello2");
//       }
//     );
//   }

//   console.log(idProject, final, idNotification);
//   //res.send("Hello")
// });

router.get("/get-logbook/:idProject", (req, res) => {
  const { idProject } = req.params;
  const query_logbook = "SELECT * FROM logbook WHERE id_project= ? ;";
  db.query(query_logbook, [idProject], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

module.exports = router;
