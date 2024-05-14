import express from "express";
import db from "./config/db.js";
import User from "./models/userModel.js";
import { Request, Response } from "express";


db.authenticate()
.then((res) => console.log(`connected to database successfully`))
.catch((error) => console.log(error))
const app =express()
const port = 5000

app.get('/',(req,res)=>{
    res.send('welcome to our project')
})


app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})
