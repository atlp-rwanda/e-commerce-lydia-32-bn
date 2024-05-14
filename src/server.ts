import express from "express";
import db from "./config/db.js";
import User from "./models/userModel.js";
import { Request, Response } from "express";


db.authenticate()
.then((res) => console.log(`connected to database successfully`))
.catch((error) => console.log(error))
const app =express()
const port = 3000

app.get('/',(req,res)=>{
    res.send('welcome to cohort 32')
})


app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})
