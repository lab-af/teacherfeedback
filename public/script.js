if (window.location.pathname.includes("teacher.html")) {
  const params = new URLSearchParams(window.location.search);
  const teacherName = params.get("name");
  document.getElementById("teacher-name").innerText = teacherName;

  const commentList = document.getElementById("comment-list");
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");

  // Fetch existing comments (use relative URL)
  fetch(`/comments?teacherName=${encodeURIComponent(teacherName)}`)
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

  // Post new comment (use relative URL)
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const comment = commentInput.value;

    fetch('/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
