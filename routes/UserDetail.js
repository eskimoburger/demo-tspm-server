const express = require('express')
const router = express.Router();
const db  = require('../config/db')

router.get("/byuser/:id",(req,res)=>{
    const id = req.params.id
    db.query("SELECT * FROM students WHERE student_id = ? ",id,(err,results)=>{
        if(err){
            console.log(err)
        }
        if(results.length > 0){ 
            // res.send({
            //     id: "data",
            //     thname: "กฤติน",
            //     thlastname: "เพิ่มพูล",
            //     enname: "Kridtin",
            //     enlastname: "Permpoon",
            //   });
            res.send({ 
                id : results[0].student_id,
                thname: results[0].name_th,
                thlastname: results[0].lastname_th,
                enname: results[0].name_eng,
                enlastname: results[0].lastname_eng,
            });
        }
        
    })}
)

router.get("/byuserv2/:id",(req,res)=>{
    var fullUrl = req.protocol + '://' + req.get('host');
    const id = req.params.id
    db.query("SELECT * FROM students WHERE student_id = ? ",id,(err,results)=>{
        if(err){
            console.log(err)
        }
       res.send({results:results,
                 message:`${fullUrl}/cat.jpg`
            })
        
    })}
)

router.put("/update/byuser/:id",(req,res)=>{
    

    const id = req.params.id
    const name_en =req.body.name_en
    const lastname_en =req.body.lastname_en
    const name =req.body.name
    const lastname =req.body.lastname
    const nickname = req.body.nickname
    const email = req.body.email
    const phone = req.body.phone

    db.query("UPDATE students SET name_th=?,lastname_th = ?,name_eng = ?,lastname_eng = ?, nickname = ?, "  
    +"email = ?,phone = ? WHERE student_id = ? ",[name,lastname,name_en,lastname_en,nickname,email,phone,id],(err,results)=>{
        if(err){
            console.log(err)
        }
       res.send(results)
        
    })}
)
// UPDATE students SET name_th = ?, lastname_th = ?, name_eng = ?,lastname_eng = ?, nickname = ? "
//             +", email = ?, phone=0931397197  WHERE student_id = ?


module.exports = router