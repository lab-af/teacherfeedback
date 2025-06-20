const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema
const commentSchema = new mongoose.Schema({
  teacherName: String,
  comment: String,
  timestamp: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

// Routes
app.post('/comments', async (req, res) => {
  const { teacherName, comment } = req.body;
  const newComment = new Comment({ teacherName, comment });
  await newComment.save();
  res.status(201).json(newComment);
});

app.get('/comments/:teacherName', async (req, res) => {
  const comments = await Comment.find({ teacherName: req.params.teacherName }).sort({ timestamp: -1 });
  res.json(comments);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
