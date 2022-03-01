const express = require('express')
const router = express.Router();
const db  = require('../config/db')

router.post("/",(req,res)=>{
    const id_noti = req.body.id_noti
    const request = req.body.request
    const username = req.body.username
    const statename = req.body.statename 
     db.query("INSERT INTO notification (description,id_noti,username_teacher,state_name) VALUES (?,?,?,?)" ,[request,id_noti,username,statename],(err,results) => {
         if(err) {
            console.log(err)
         }
         res.send(results)
    })
})

router.get("/project/:username",(req,res)=>{
     const username = req.params.username
     db.query("SELECT * from notification WHERE username_teacher = ?" ,username,(err,results) => {
         if(err) {
            console.log(err)
         }
         res.send(results)
    })
})


module.exports = router