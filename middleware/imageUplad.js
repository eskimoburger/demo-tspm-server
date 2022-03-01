const util = require("util");
const multer = require("multer");
const fs = require("fs")

const FILE_TYPE_MAP = {
    // mime type
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        const dir = `./public/uploads/imagesProfiles/`
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)    
        }
        cb(null, dir);
      

    },
    filename: (req, file, cb) => {
        const studentId  = req.params.studentId
        const fileName = file.originalname.toLowerCase().split(' ').join('-');


        const filenames = file.originalname.replace(" ", "-");
        const extension = FILE_TYPE_MAP[file.mimetype]
        
        console.log(`${studentId}.${extension}`)
        cb(null, `${studentId}.${extension}`)
    },
});

let uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 
        //52428800
    },
    fileFilter: (req, file, cb) => {
        if ( file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File types allowed .jpeg, .jpg and .png!'));
        }
    }
}).single("file");

let imageUploadMiddleware = util.promisify(uploadImage);

module.exports = imageUploadMiddleware;