require ("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../../knex");
const {v2:cloudinary}=require('cloudinary');
const {CloudinaryStorage}=require('multer-storage-cloudinary');
const multer=require('multer');


// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'epicare',
        allowedFormats:['jpeg','png','jpg']
    }
});

const upload=multer({storage});

router.get("/", async (req, res) => {
  res.json({
    message: "hello",
  });
});

router.post("/signin", async (req, res) => {
    console.log("auth started")
  const { email, password } = req.body;
  try {
    const user=await db('users').where({email}).first();
    if(!user){
      return res.status(404).json({error:"user not found"});
    }
    if(user.password!==password){
      return res.status(401).json({error:"invalid credentials"});
    }
    res.status(200).json({message:"success",id:user.id});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/signup",upload.single('image'), async (req, res) => {
    console.log("auth started");
    
     const {username,email,password}=req.body;
     try {
        const user=await db('users').where({email}).first();
        if(user){
            return res.status(400).json({error:"user already exists"}); 
        }
        const imageUrl=req.file?.path;
        console.log(imageUrl);
        await db('users').insert({username,email,password,image_url:imageUrl});
        res.status(200).json({message:"success"});
     } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
     }

});

// /auth/getInfo/:id
router.get("/getInfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db("users").where({ id }).first();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
