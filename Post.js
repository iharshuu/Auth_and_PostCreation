

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
        type:String,
        required : true,
        unique:true
    },
    descr:{
        type:String,
        required : true,
    },
    user:{
        type:Schema.Types.ObjectId , 
        ref:"User"
    }


},{timestamps:true})

const post = mongoose.model("Post",PostSchema);

module.exports = post;