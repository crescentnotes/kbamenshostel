import express from 'express';

const router=express.Router();


router.get('/',(req,res)=>{
    res.render('aboutus');
})

export default router;