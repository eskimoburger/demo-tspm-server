const db = require("../config/db");
const imageUpload = require("../middleware/imageUplad");

const uploadFileImage = async (req, res) => {
  const FILE_TYPE_MAP = {
    // mime type
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };
  const studentId = req.params.studentId;

  try {
    await imageUpload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    } else {
      const pathImg = studentId + "." + FILE_TYPE_MAP[req.file.mimetype];
      db.query(
        "UPDATE test_students SET pic = ? WHERE student_id = ?",
        [pathImg, studentId],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          //console.log(pathImg)
          res.status(200).send({
            message: "File uploaded successfully: " + req.file.originalname,
            name: req.file.originalname,
     
            // results : results,
            status: true,
          });
        }
      );
    }
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

module.exports = { uploadFileImage };
