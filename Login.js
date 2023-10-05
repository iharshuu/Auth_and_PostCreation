const express = require("express");
const User = require("../Module/User");
const post = require("../Module/Post")
const log = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const {body,validationResult} = require("express-validator")



log.post("/register",body("email").isEmail(),body("username").isAlpha(),body("password").isLength(
    {min:6,
    max:15}
),async (req,res)=>{
    try{
        let error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(500).json({error:error.array()})
        }
        const {username,email,password} = req.body
        bcrypt.hash(password, 10, async function(err, hash) {  
            //      plaintext , salt
            // Store hash in your password DB.
            if(err){
                res.status(500).json({
                    message:err.message
                })
            }
            else{
                const user = await User.create({
    // we can write in a way like username:username ==>eqaul to username,
    // when key&value is same we can write(username) for password we written in password:hash becoz they're not same
    // it's called as obj reconstructor.
                    username,
                    email,
                    password : hash
                });
                res.status(200).json({
                    message:"succesfull",
                    user
                })
            }

        });

    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

log.get("/join", async(req,res)=>{
    try{
    const {email,password} = req.body
    let user = await User.findOne({email}) // findone-->output:object;find-->output:array
    if(!user){
        res.status(400).json({
            message:"INVALID email"
        })
    }
    else{
        bcrypt.compare(password, user.password , function(err, result) {
            //         plaintext , comaring with bycrpt
            if(!result){
                return res.status(400).json({
                    message:"Wrong Password"
                })
            }
            else{
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // expire tym (60*60)-->1hr expire tym
                    data: user._id //data of the user it's should be minimal, we can exctract it using jwt decode.
                  },"Blogapp" ); // name of the collection
                return res.status(200).json({
                    message:"login Sucessful",
                    user,
                    token
                })
            }
        });
    }
}
catch(err){
    res.status(400).json({
        message:err.message
    })
}
})

module.exports = log

