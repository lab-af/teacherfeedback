const mongoose = require('mongoose');

let conn = null;
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  if (conn) return conn;
  conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return conn;
};

const commentSchema = new mongoose.Schema({
  teacherName: String,
  comment: String,
  timestamp: { type: Date, default: Date.now }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    const { teacherName, comment } = req.body;
    const newComment = new Comment({ teacherName, comment });
    const saved = await newComment.save();
    return res.status(201).json(saved);
  }

  if (req.method === 'GET') {
    const { teacherName } = req.query;
    const comments = await Comment.find({ teacherName }).sort({ timestamp: -1 });
    return res.status(200).json(comments);
  }

  res.status(405).end(); // Method Not Allowed
};
