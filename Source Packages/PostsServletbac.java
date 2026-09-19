

import com.websitqjava.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "PostsServlet", urlPatterns = {"/api/posts"})
public class PostsServletbac extends HttpServlet {

    // ---------- In-memory post storage ----------
    // This list resets every time Tomcat restarts. That's intentional for the demo.
    private static final List<Post> POSTS = new ArrayList<>();
    private static int nextId = 1;

    static {
        // Seed posts so the gallery isn't empty on first load
        addSeed("Artwork One", "This is the description for Artwork One.", "Traditional", "@artistone", 24,
                "https://picsum.photos/seed/art1/400/400");
        addSeed("Dreamscape", "A dreamy digital artwork.", "Digital", "@artisttwo", 41,
                "https://picsum.photos/seed/art2/400/400");
        addSeed("Character Study", "A character design study.", "Digital", "@artistthree", 17,
                "https://picsum.photos/seed/art3/400/400");
        addSeed("Summer", "A bright summer illustration.", "Traditional", "@artistfour", 32,
                "https://picsum.photos/seed/art4/400/400");
        addSeed("Nature", "Inspired by nature.", "Traditional", "@artistfive", 56,
                "https://picsum.photos/seed/art5/400/400");
        addSeed("Portrait", "A portrait artwork.", "Traditional", "@artistsix", 29,
                "https://picsum.photos/seed/art6/400/400");
    }

    private static synchronized void addSeed(String title, String description, String category,
                                              String artist, int likes, String image) {
        Post p = new Post();
        p.id = "art" + nextId++;
        p.title = title;
        p.description = description;
        p.category = category;
        p.artist = artist;
        p.likes = likes;
        p.image = image;
        POSTS.add(p);
    }

    // ---------- GET /api/posts ----------
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        StringBuilder json = new StringBuilder();
        json.append("{\"posts\":[");
        for (int i = 0; i < POSTS.size(); i++) {
            if (i > 0) json.append(",");
            json.append(POSTS.get(i).toJson());
        }
        json.append("]}");

        try (PrintWriter out = response.getWriter()) {
            out.print(json.toString());
        }
    }

    // ---------- POST /api/posts ----------
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String category = request.getParameter("category");
        String artist = request.getParameter("artist");
        String image = request.getParameter("image");

        if (title == null || title.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            try (PrintWriter out = response.getWriter()) {
                out.print("{\"error\":\"title is required\"}");
            }
            return;
        }

        Post p = new Post();
        p.id = "art" + nextId++;
        p.title = title.trim();
        p.description = description == null ? "" : description.trim();
        p.category = category == null ? "Other" : category.trim();
        p.artist = (artist == null || artist.trim().isEmpty()) ? "@you" : artist.trim();
        p.likes = 0;
        p.image = (image == null || image.trim().isEmpty())
                ? "https://picsum.photos/seed/art" + nextId + "/400/400"
                : image.trim();

        synchronized (POSTS) {
            POSTS.add(p);
        }

        try (PrintWriter out = response.getWriter()) {
            out.print(p.toJson());
        }
    }

    // ---------- Simple Post holder ----------
    private static class Post {
        String id;
        String title;
        String description;
        String category;
        String artist;
        int likes;
        String image;

        String toJson() {
            StringBuilder sb = new StringBuilder();
            sb.append("{");
            sb.append("\"id\":\"").append(esc(id)).append("\",");
            sb.append("\"title\":\"").append(esc(title)).append("\",");
            sb.append("\"description\":\"").append(esc(description)).append("\",");
            sb.append("\"category\":\"").append(esc(category)).append("\",");
            sb.append("\"artist\":\"").append(esc(artist)).append("\",");
            sb.append("\"likes\":").append(likes).append(",");
            sb.append("\"image\":\"").append(esc(image)).append("\"");
            sb.append("}");
            return sb.toString();
        }

        private static String esc(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"")
                    .replace("\n", "\\n").replace("\r", "\\r");
        }
    }
}
