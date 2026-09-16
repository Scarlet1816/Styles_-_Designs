/* ============================================
   api.js — backend bridge for Styles & Design
   ============================================
   Loads posts from the Java servlet and caches them.
   Other scripts call:
     await API.getPosts()               → array of all posts
     await API.getPostById(id)          → single post or null
     await API.getPostsByArtist(handle) → array of that artist's posts
     await API.createPost({...})        → new post (server-assigned id)
   ============================================ */

(function () {
  "use strict";

  // Where the servlet lives. Both projects are on the same Tomcat,
  // so "localhost:8080/WebsitQjava" is the backend base.
  const BASE = "http://localhost:8080/WebsitQjava/api";

  // In-memory cache. Refreshed on every page load.
  let cachedPosts = null;
  let inflight = null;

  // ----------------------------------------------------------------
  // Internal: raw fetch to the servlet
  // ----------------------------------------------------------------
  async function fetchPosts() {
    if (cachedPosts) return cachedPosts;
    if (inflight) return inflight;

    inflight = (async () => {
      try {
        const res = await fetch(BASE + "/posts", { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        cachedPosts = Array.isArray(data.posts) ? data.posts : [];
        return cachedPosts;
      } catch (err) {
        console.error("[api.js] Failed to load posts:", err);
        cachedPosts = [];
        return cachedPosts;
      } finally {
        inflight = null;
      }
    })();

    return inflight;
  }

  // ----------------------------------------------------------------
  // Internal: POST a new post to the servlet
  // ----------------------------------------------------------------
  async function postPost(payload) {
    const params = new URLSearchParams();
    params.append("title", payload.title || "");
    params.append("description", payload.description || "");
    params.append("category", payload.category || "");
    params.append("artist", payload.artist || "@you");
    params.append("image", payload.image || "");

    const res = await fetch(BASE + "/posts", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error("Server returned " + res.status + ": " + text);
    }

    const newPost = await res.json();

    // Insert into cache so the gallery sees it immediately
    if (cachedPosts) cachedPosts.push(newPost);

    return newPost;
  }

  // ----------------------------------------------------------------
  // Public API
  // ----------------------------------------------------------------
  window.API = {
    async getPosts() {
      return await fetchPosts();
    },

    async getPostById(id) {
      const posts = await fetchPosts();
      return posts.find(p => p.id === id) || null;
    },

    async getPostsByArtist(handle) {
      const posts = await fetchPosts();
      const normalized = String(handle || "").toLowerCase();
      return posts.filter(p => String(p.artist || "").toLowerCase() === normalized);
    },

    async createPost(data) {
      return await postPost(data);
    },

    // For testing: force a refresh next time getPosts() is called
    clearCache() {
      cachedPosts = null;
    }
  };
})();