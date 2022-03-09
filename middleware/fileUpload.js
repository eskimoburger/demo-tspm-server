const util = require("util");
const multer = require("multer");
const fs = require("fs");
const DIR = "./public/uploads/";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.projectId;
    const dir = `./public/uploads/${userId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLocaleLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    //52428800

    //1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("File types allowed .jpeg, .jpg and .png!"));
    }
  },
}).single("file");

let fileUploadMiddleware = util.promisify(upload);

module.exports = fileUploadMiddleware;
