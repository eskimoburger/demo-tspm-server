const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const finalRoute = require("./routes/finalProject");
const finalTeacherRoute = require("./routes/finalTeacher");
const finalCourseRoute = require("./routes/finalCourseTeacher");
const finalProfileRoute = require("./routes/finalProfile");
const finalFetchRoute = require("./routes/finalFetchAll");
global.__basedir = __dirname;

app.use(express.static(path.join(__dirname,"public/uploads/")));

app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({extended:false}));

const evokeRoutes = require("./routes/upload.route");
app.use(
  express.urlencoded({
    extended: true,
  })
);
evokeRoutes(app);

app.use(express.static("public/uploads/"));

const userRoute = require("./routes/User");
app.use("/user", userRoute);

const studentRoute = require("./routes/UserDetail");
app.use("/student", studentRoute);

const allstudentRoute = require("./routes/AllStudent");
app.use("/allstudent", allstudentRoute);

const allteacherRoute = require("./routes/Allteacher");
app.use("/allteacher", allteacherRoute);

const projectRoute = require("./routes/Project");
app.use("/project", projectRoute);

const notificationRoute = require("./routes/Notification");
app.use("/notification", notificationRoute);

const testRoute = require("./routes/test.route");
app.use("/students", testRoute);

///final routes

app.use("/final-project", finalRoute);
app.use("/final-teacher", finalTeacherRoute);
app.use("/final-course", finalCourseRoute);
app.use("/final-profile", finalProfileRoute);
app.use("/final-fetch", finalFetchRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
  console.log("Server running...");
  console.log(path.join(__dirname,"public/uploads/"))
});



// app.use((req, res, next) => {
//   setImmediate(() => {
//     next(new Error("Error occured"));
//   });
// });

// app.use(function (err, req, res, next) {
//   console.error(err.message);
//   if (!err.statusCode) err.statusCode = 500;
//   res.status(err.statusCode).send(err.message);
// });
//
