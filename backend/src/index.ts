import express from 'express';
import cors from 'cors';


const app= express()
const PORT=5000 

app.use(cors())
app.use(express.json())


app.get('/api', (_req,res)=>{
    res.json({message:"This is coming through backend via api endpoint"})
 })


 app.listen(PORT,async ()=>{
  console.error(`HTTP is running on port ${PORT}`)
 })

