/* =========================
   CREATE / PUBLISH ARTWORK
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

  const fileInput = document.querySelector(".file-input");
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const categorySelect = document.getElementById("category");
  const publishBtn = document.querySelector(".publish-btn");

  if (!publishBtn) return;

  publishBtn.addEventListener("click", function () {

    const title = titleInput.value.trim();
    if (!title) {
      alert("Please give your artwork a title.");
      titleInput.focus();
      return;
    }

    // Reuse the same logged-in-user check the gallery comments use
    const activeUser = window.user ||
      JSON.parse(localStorage.getItem("gd_user") || sessionStorage.getItem("gd_user") || "null");

    if (!activeUser) {
      alert("Please log in before publishing.");
      if (typeof openLoginModal === "function") openLoginModal();
      return;
    }

    function savePublishedArtwork(imageData) {
      const published = JSON.parse(localStorage.getItem("published_arts") || "[]");

      published.push({
        id: "user_" + Date.now(),
        image: imageData || "",
        title: title,
        description: descInput.value.trim(),
        category: categorySelect.value || "",
        artist: "@" + (activeUser.name || activeUser.username || "you"),
        likes: 0,
        comments: []
      });

      localStorage.setItem("published_arts", JSON.stringify(published));
      alert("Artwork published!");
      window.location.href = "gallery.html";
    }

    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => savePublishedArtwork(e.target.result);
      reader.readAsDataURL(file);
    } else {
      savePublishedArtwork("");
    }

  });

});
