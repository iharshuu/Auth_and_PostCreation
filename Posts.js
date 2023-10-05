const express = require("express");
const post = require("../Module/Post");
const postRou = express.Router();
const jwt = require('jsonwebtoken');

// Corrected route handler for viewing all posts
postRou.get("/view", async (req, res) => {
    try {
        const users = await post.find();
        res.status(200).json({
            message: "Viewing all posts",
            users // Changed variable name to users to match the response
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Corrected route handler for creating a new post
postRou.post("/create", async (req, res) => {
    try {
        const newUser = await post.create({
            title: req.body.title, // Use req.body for title
            descr: req.body.descr, // Use req.body for descr
            user: req.body.user // Use req.body for user
        });
        res.status(201).json({
            message: "Post created successfully",
            user: newUser
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = postRou;
