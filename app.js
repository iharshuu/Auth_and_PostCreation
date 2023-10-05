const express = require("express");
const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
const userRoutes = require("./router/Router")
const logRoutes = require("./router/Login")
const postRou = require("./router/Posts");
const User = require("./Module/User");
const app = express();


app.use(express.json())

// we're creating our own middleware for validating the code have correct jwt token or not
// if it works only it will goes to the next next it will takes you to the actual router.
 app.use("/post",async(req,res,next)=>{
     let token = req.headers.authorization // we are given it manual but in coding part we gives it using frontend
     // decoding it the decode gives 3 things decode.data is what we sended.
     jwt.verify(token,"Blogapp", async function(err,decode){
        console.log(decode.data)
        let user = await User.findOne({_id:decode.data})
        if(user){
            req.user = decode.data; 
 // we added the req.user to decode.data so by using it just like "req.headers.authorization" 
 // you can acess user posted data by using findOne({_id:req.user}) i didn't done if you want you can
            next() // if it sucess only it goes to the "postRou"
        }
        else{
            return res.status(200).json({
                message:"Something Went wrong"
            })

        }

     })
 })

app.use("/api" , userRoutes); // base url
// when ever i get the "/api" comes in url it redirect to the userRoutes then it will append to them

app.use("/reg",logRoutes);

app.use("/post",postRou);

const mongoDBURL = "mongodb+srv://harshu:harshu24@cluster0.dptfkt0.mongodb.net/Blogapp?retryWrites=true&w=majority";

mongoose.connect(mongoDBURL)
.then(() => {
    // Start the Express app to listen on port 5050
    app.listen(5050, () => {
        console.log("Server is running on port 5050");
    });
    console.log("Connected to the database");
})
.catch((err) => {
    console.error("Error connecting to the database:", err);
});


