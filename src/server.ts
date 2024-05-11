import express from "express";
const app =express()
const port = 5000

app.get('/',(req,res)=>{
    res.send('welcome to cohort 32')
})

app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})