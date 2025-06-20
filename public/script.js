// Only works on teacher.html
if (window.location.pathname.includes("teacher.html")) {
  const params = new URLSearchParams(window.location.search);
  const teacherName = params.get("name");
  document.getElementById("teacher-name").innerText = teacherName;

  const commentList = document.getElementById("comment-list");
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");

  // Fetch and display existing comments from MongoDB
  fetch(`http://localhost:3000/comments/${encodeURIComponent(teacherName)}`)
    .then(res => res.json())
    .then(data => {
      data.forEach(comment => {
        const li = document.createElement("li");
        const date = new Date(comment.timestamp);
        const formatted = date.toLocaleString();
        li.innerHTML = `<strong>${formatted}</strong><br>${comment.comment}`;
        commentList.appendChild(li);
      });
    });

  // Add new comment and save to MongoDB
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const comment = commentInput.value;

    fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ teacherName, comment })
    })
      .then(res => res.json())
      .then(savedComment => {
        const li = document.createElement("li");
        const date = new Date(savedComment.timestamp);
        const formatted = date.toLocaleString();
        li.innerHTML = `<strong>${formatted}</strong><br>${savedComment.comment}`;
        commentList.prepend(li);
        commentInput.value = "";
      });
  });
}
