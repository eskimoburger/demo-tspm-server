const upload = require("../middleware/fileUpload");
const fs = require("fs");
const db = require("../config/db");

const uploadFile = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }

    const path = `${projectId}/${req.file.originalname}`;

    // var query_add_file_path =
    //   "INSERT INTO test_project_file (id_project,state3_file) VALUE (?,?)";

    var query_add_file_path =
      "UPDATE test_project_file SET state3_file = ? WHERE id_project = ? ";

    db.query(query_add_file_path, [path, projectId], (err, results) => {
      if (err) {
        console.log(err);
      }

      res.status(200).send({
        message: "File uploaded successfully: " + req.file.originalname,
        name: req.file.originalname,
        results: results,
        status: true,
      });
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const uploadFileState9 = async (req, res) => {
  const idPrimary = req.params.projectId;
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }

    const path = `${req.params.projectId}/${req.file.originalname}`;

    var query_add_file_path =
      "UPDATE test_project_file SET state9_file = ? WHERE id_project = ? ";
    db.query(query_add_file_path, [path, idPrimary], (err, results) => {
      if (err) {
        console.log(err);
      }
      res.status(200).send({
        message: "File uploaded successfully: " + req.file.originalname,
        name: req.file.originalname,
        results: results,
        status: true,
      });
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const uploadFileFinalState = async (req, res) => {
  const idPrimary = req.params.projectId;
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }
    const path = `${req.params.projectId}/${req.file.originalname}`;
    db.query(
      "UPDATE test_project_file SET final_file = ? WHERE id_project = ?;UPDATE test_data_project SET final_asses =  0 WHERE id = ?",
      [path, idPrimary, idPrimary],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(422).send({ message: "Query Problem" });
        } else {
          res.status(200).send({
            message: "File uploaded successfully: " + req.file.originalname,
            name: req.file.originalname,
            results: results,
            status: true,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const EditUploadFileFinalState = async (req, res) => {
  const idPrimary = req.params.projectId;
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }
    const path = `${req.params.projectId}/${req.file.originalname}`;
    db.query(
      "UPDATE test_project_file SET final_file = ? WHERE id_project = ?; WHERE id = ?",
      [path, idPrimary, idPrimary],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(422).send({ message: "Query Problem" });
        } else {
          res.status(200).send({
            message: "File uploaded successfully: " + req.file.originalname,
            name: req.file.originalname,
            results: results,
            status: true,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const getFilesList = (req, res) => {
  var fullUrl = req.protocol + "s://" + req.get("host");
  const studentId = req.params.studentId;
  const path = __basedir + `/public/uploads/${studentId}/`;

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      filesList.push({
        name: file,
        // url: URL + file,
        url: `${fullUrl}/files/${studentId}/${file}`,
        show: `${fullUrl}/${studentId}/${file}`,
      });
    });

    res.status(200).send(filesList);
  });
};

const downloadFiles = (req, res) => {
  const fileName = req.params.name;
  const studentId = req.params.studentId;
  const path = __basedir + `/public/uploads/`;

  res.download(`${path}/${studentId}/${fileName}`, (err) => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
};

const getFilesListProject = (req, res) => {
  var fullUrl = req.protocol + "://" + req.get("host");
  const { projectId } = req.params;
  const path = __basedir + `/public/uploads/${projectId}/`;

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }
    const filterFile = (v) => {
      return v !== "state3file.pdf"&& v !== "state9file.pdf";
    };

    var filesList = fs
      .readdirSync(path)
      .filter(filterFile)
      .map((v) => {
        return {
          name: v,
          time: fs.statSync(path + v).mtime.getTime(),
          url: `${fullUrl}/files/${projectId}/${v}`,
          show: `${fullUrl}/${projectId}/${v}`,
        };
      })
      .sort(function (a, b) {
        return b.time - a.time;
      });
    res.status(200).send(filesList);
  });
};
module.exports = {
  uploadFile,
  downloadFiles,
  getFilesList,
  uploadFileState9,
  uploadFileFinalState,
  getFilesListProject,
};
