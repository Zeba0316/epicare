const express = require('express');
const router = express.Router();
const db=require('../../knex');

router.get('/', async (req, res) => {
    res.json({
        message:"hello"
    })

})


module.exports=router;