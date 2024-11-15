require('dotenv').config();
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const authrouter=require('./routes/auth/auth');

const app=express();

app.use(cors());
app.use(bodyParser.json());

//routes
app.use('/auth',authrouter);
app.get('/test',(req,res)=>{
    res.json({
        message:"h000"
    })
})



app.listen(5000,()=>{
    console.log('Server running on port 5000');
})

