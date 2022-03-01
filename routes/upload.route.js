const express = require("express");
const router = express.Router();
const controller = require("../controller/fileUpload.controller");
const imageController = require("../controller/imageUpload.controller");
let routes = (app) => {
  router.post("/upload-file/:projectId", controller.uploadFile);
  router.post("/upload-file-state9/:projectId", controller.uploadFileState9);
  router.post("/upload-file-final/:projectId", controller.uploadFileFinalState);
  router.get("/files/:studentId", controller.getFilesList);
  router.get("/files/:studentId/:name", controller.downloadFiles);
  router.post("/profile/:studentId", imageController.uploadFileImage);
  router.get("/get-file-project/:projectId", controller.getFilesListProject);

  app.use(router);
};
module.exports = routes;
