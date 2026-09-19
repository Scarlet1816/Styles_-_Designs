/* =========================
   SAVED ARTWORK PAGE
   ========================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =========================
       SAVED PAGE ELEMENTS
       ========================= */

    const savedGrid =
        document.getElementById("savedGrid");

    const savedLoginMessage =
        document.getElementById("savedLoginMessage");

    const noSavedMessage =
        document.getElementById("noSavedMessage");

    const savedLoginBtn =
        document.getElementById("savedLoginBtn");


    /* =========================
       MODAL ELEMENTS
       ========================= */

    const modal =
        document.getElementById("artModal");

    const modalImage =
        document.getElementById("modalImage");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalArtist =
        document.getElementById("modalArtist");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalLikes =
        document.getElementById("modalLikes");

    const modalLikeBtn =
        document.getElementById("modalLikeBtn");

    const modalSaveBtn =
        document.getElementById("modalSaveBtn");

    const modalShareBtn =
        document.getElementById("modalShareBtn");

    const modalCommentList =
        document.getElementById("modalCommentList");

    const modalCommentInput =
        document.getElementById("modalCommentInput");

    const modalPost =
        document.getElementById("modalPost");

    const closeModalBtn =
        document.getElementById("closeModal");


    let currentArtwork = null;


    /* =========================
       GET LOGGED-IN USER
       ========================= */

    function getCurrentUser() {

        try {

            const storedUser =
                localStorage.getItem("gd_user") ||
                sessionStorage.getItem("gd_user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.warn(
                "Could not read logged-in user.",
                error
            );

            return null;
        }
    }


    /* =========================
       DEFAULT ARTWORKS
       ========================= */

    const defaultArtworks = {

        art1: {
            image: "",
            title: "Artwork One",
            artist: "@artistone",
            description:
                "This is the description for Artwork One.",
            likes: 24,
            comments: [
                "@user1: Amazing artwork!",
                "@user2: I love this!"
            ]
        },

        art2: {
            image: "",
            title: "Dreamscape",
            artist: "@artisttwo",
            description:
                "A dreamy digital artwork.",
            likes: 41,
            comments: [
                "@user3: Beautiful colors!"
            ]
        },

        art3: {
            image: "",
            title: "Character Study",
            artist: "@artistthree",
            description:
                "A character design study.",
            likes: 17,
            comments: []
        },

        art4: {
            image: "",
            title: "Summer",
            artist: "@artistfour",
            description:
                "A bright summer illustration.",
            likes: 32,
            comments: []
        },

        art5: {
            image: "",
            title: "Nature",
            artist: "@artistfive",
            description:
                "Inspired by nature.",
            likes: 56,
            comments: []
        },

        art6: {
            image: "",
            title: "Portrait",
            artist: "@artistsix",
            description:
                "A portrait artwork.",
            likes: 29,
            comments: []
        },

        art7: {
            image: "",
            title: "Color Study",
            artist: "@artistseven",
            description:
                "An exploration of colors.",
            likes: 38,
            comments: []
        },

        art8: {
            image: "",
            title: "Untitled",
            artist: "@artisteight",
            description:
                "An experimental artwork.",
            likes: 21,
            comments: []
        }

    };


    /* =========================
       GET ALL ARTWORKS
       ========================= */

    function getAllArtworks() {

        const artworks = {
            ...defaultArtworks
        };


        try {

            const published =
                JSON.parse(
                    localStorage.getItem(
                        "published_arts"
                    ) || "[]"
                );


            published.forEach(function (art) {

                artworks[art.id] = {

                    image:
                        art.image || "",

                    title:
                        art.title || "Untitled",

                    artist:
                        art.artist || "@you",

                    description:
                        art.description || "",

                    likes:
                        art.likes || 0,

                    comments:
                        Array.isArray(art.comments)
                            ? art.comments
                            : []
                };

            });

        } catch (error) {

            console.warn(
                "Could not load published artwork.",
                error
            );

        }


        return artworks;
    }


    /* =========================
       GET SAVED IDS
       ========================= */

    function getSavedIds() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "saved_arts"
                ) || "[]"
            );

        } catch (error) {

            console.warn(
                "Could not load saved artwork.",
                error
            );

            return [];
        }
    }


    /* =========================
       DISPLAY COMMENTS
       ========================= */

    function displayComments(artwork) {

        if (!modalCommentList) {
            return;
        }

        modalCommentList.innerHTML = "";


        (artwork.comments || []).forEach(
            function (comment) {

                let userText = "Anonymous";
                let text = "";


                if (typeof comment === "string") {

                    const match =
                        comment.match(
                            /^(@\w+):\s*(.*)$/
                        );

                    if (match) {

                        userText = match[1];
                        text = match[2];

                    } else {

                        text = comment;

                    }

                } else if (
                    typeof comment === "object" &&
                    comment !== null
                ) {

                    userText =
                        comment.user ||
                        "Anonymous";

                    text =
                        comment.text ||
                        "";

                }


                const div =
                    document.createElement("div");

                div.className =
                    "modal-comment";

                div.textContent =
                    userText + ": " + text;

                modalCommentList.appendChild(div);

            }
        );
    }


    /* =========================
       OPEN ARTWORK MODAL
       ========================= */

    function openArtwork(id) {

        const artworks =
            getAllArtworks();

        const artwork =
            artworks[id];

        if (!artwork) {
            return;
        }


        currentArtwork = id;


        if (modalImage) {

            modalImage.src =
                artwork.image || "";

            modalImage.alt =
                artwork.title || "Artwork";
        }


        if (modalTitle) {

            modalTitle.textContent =
                artwork.title || "Untitled";
        }


        if (modalArtist) {

            modalArtist.textContent =
                artwork.artist || "@unknown";

            modalArtist.href =
                "profile.html";
        }


        if (modalDescription) {

            modalDescription.textContent =
                artwork.description || "";
        }


        if (modalLikes) {

            modalLikes.textContent =
                artwork.likes || 0;
        }


        if (modalLikeBtn) {

            modalLikeBtn.classList.toggle(
                "liked",
                !!artwork.liked
            );
        }


        if (modalSaveBtn) {

            modalSaveBtn.classList.add("saved");

            modalSaveBtn.textContent =
                "🔖 Saved";

            modalSaveBtn.dataset.artId =
                id;
        }


        if (modalLikeBtn) {

            modalLikeBtn.dataset.artId =
                id;
        }


        if (modalShareBtn) {

            modalShareBtn.dataset.artId =
                id;
        }


        displayComments(artwork);


        if (modal) {

            modal.classList.add("show");

            modal.setAttribute(
                "aria-hidden",
                "false"
            );
        }

    }


    /* =========================
       CLOSE ARTWORK MODAL
       ========================= */

    function closeArtworkModal() {

        if (!modal) {
            return;
        }

        modal.classList.remove("show");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        currentArtwork = null;
    }


    /* =========================
       CREATE SAVED ART CARD
       ========================= */

    function createSavedCard(id, art) {

        const card =
            document.createElement("div");

        card.className =
            "saved-card";

        card.dataset.artId =
            id;


        const image =
            document.createElement("img");

        image.src =
            art.image || "";

        image.alt =
            art.title || "Artwork";


        const info =
            document.createElement("div");

        info.className =
            "saved-info";


        const title =
            document.createElement("h3");

        title.textContent =
            art.title || "Untitled";


        const artist =
            document.createElement("p");

        artist.className =
            "saved-artist";

        artist.textContent =
            art.artist || "@unknown";


        const stats =
            document.createElement("div");

        stats.className =
            "saved-stats";


        const numbers =
            document.createElement("span");

        numbers.textContent =
            "♥ " +
            (art.likes || 0) +
            "   💬 " +
            (Array.isArray(art.comments)
                ? art.comments.length
                : (art.comments || 0));


        const unsaveBtn =
            document.createElement("button");

        unsaveBtn.className =
            "unsave-btn";

        unsaveBtn.type =
            "button";

        unsaveBtn.textContent =
            "🔖 Saved";


        /* UNSAVE */

        unsaveBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                unsaveArtwork(id);

            }
        );


        stats.appendChild(numbers);

        stats.appendChild(unsaveBtn);


        info.appendChild(title);

        info.appendChild(artist);

        info.appendChild(stats);


        card.appendChild(image);

        card.appendChild(info);


        /* OPEN MODAL */

        card.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.closest(
                        ".unsave-btn"
                    )
                ) {
                    return;
                }

                openArtwork(id);

            }
        );


        return card;
    }


    /* =========================
       RENDER SAVED ART
       ========================= */

    function renderSavedArt() {

        if (!savedGrid) {
            return;
        }


        savedGrid.innerHTML = "";


        const currentUser =
            getCurrentUser();


        /* NOT LOGGED IN */

        if (!currentUser) {

            savedGrid.classList.add(
                "hidden"
            );

            noSavedMessage.classList.add(
                "hidden"
            );

            savedLoginMessage.classList.remove(
                "hidden"
            );

            return;
        }


        savedLoginMessage.classList.add(
            "hidden"
        );


        const savedIds =
            getSavedIds();

        const artworks =
            getAllArtworks();


        /* NOTHING SAVED */

        if (savedIds.length === 0) {

            savedGrid.classList.add(
                "hidden"
            );

            noSavedMessage.classList.remove(
                "hidden"
            );

            return;
        }


        noSavedMessage.classList.add(
            "hidden"
        );

        savedGrid.classList.remove(
            "hidden"
        );


        let displayed = 0;


        savedIds.forEach(
            function (id) {

                const artwork =
                    artworks[id];

                if (!artwork) {
                    return;
                }


                const card =
                    createSavedCard(
                        id,
                        artwork
                    );


                savedGrid.appendChild(card);

                displayed++;

            }
        );


        if (displayed === 0) {

            savedGrid.classList.add(
                "hidden"
            );

            noSavedMessage.classList.remove(
                "hidden"
            );

        }

    }


    /* =========================
       UNSAVE ARTWORK
       ========================= */

    function unsaveArtwork(id) {

        let savedIds =
            getSavedIds();


        savedIds =
            savedIds.filter(
                function (savedId) {

                    return savedId !== id;

                }
            );


        localStorage.setItem(
            "saved_arts",
            JSON.stringify(savedIds)
        );


        closeArtworkModal();

        renderSavedArt();
    }


    /* =========================
       LIKE FROM MODAL
       ========================= */

    if (modalLikeBtn) {

        modalLikeBtn.addEventListener(
            "click",
            function () {

                const id =
                    modalLikeBtn.dataset.artId;

                if (!id) {
                    return;
                }


                const artworks =
                    getAllArtworks();

                const artwork =
                    artworks[id];

                if (!artwork) {
                    return;
                }


                artwork.liked =
                    !artwork.liked;


                artwork.likes =
                    Math.max(
                        0,
                        (artwork.likes || 0) +
                        (
                            artwork.liked
                                ? 1
                                : -1
                        )
                    );


                modalLikes.textContent =
                    artwork.likes;


                modalLikeBtn.classList.toggle(
                    "liked",
                    artwork.liked
                );

            }
        );
    }


    /* =========================
       SAVE / UNSAVE FROM MODAL
       ========================= */

    if (modalSaveBtn) {

        modalSaveBtn.addEventListener(
            "click",
            function () {

                const id =
                    modalSaveBtn.dataset.artId;

                if (!id) {
                    return;
                }


                let savedIds =
                    getSavedIds();


                const index =
                    savedIds.indexOf(id);


                if (index !== -1) {

                    savedIds.splice(
                        index,
                        1
                    );

                    localStorage.setItem(
                        "saved_arts",
                        JSON.stringify(savedIds)
                    );

                    closeArtworkModal();

                    renderSavedArt();

                }

            }
        );
    }


    /* =========================
       SHARE
       ========================= */

    if (modalShareBtn) {

        modalShareBtn.addEventListener(
            "click",
            async function () {

                const id =
                    modalShareBtn.dataset.artId;

                if (!id) {
                    return;
                }


                const artworks =
                    getAllArtworks();

                const artwork =
                    artworks[id];

                if (!artwork) {
                    return;
                }


                const shareText =
                    artwork.title +
                    " by " +
                    artwork.artist;


                const shareData = {

                    title:
                        artwork.title,

                    text:
                        shareText,

                    url:
                        window.location.href

                };


                if (navigator.share) {

                    try {

                        await navigator.share(
                            shareData
                        );

                        return;

                    } catch (error) {

                        // User cancelled.

                    }

                }


                const fullText =
                    shareText +
                    "\n" +
                    window.location.href;


                if (
                    navigator.clipboard &&
                    navigator.clipboard.writeText
                ) {

                    try {

                        await navigator.clipboard.writeText(
                            fullText
                        );

                        alert(
                            "Artwork link copied!"
                        );

                        return;

                    } catch (error) {

                        // Continue.
                    }
                }


                window.prompt(
                    "Copy this link to share:",
                    fullText
                );

            }
        );
    }


    /* =========================
       POST COMMENT
       ========================= */

    if (modalPost) {

        modalPost.addEventListener(
            "click",
            function () {

                const id =
                    currentArtwork;

                if (!id) {
                    return;
                }


                const text =
                    modalCommentInput.value.trim();


                if (!text) {

                    alert(
                        "Please write a comment first."
                    );

                    return;
                }


                const activeUser =
                    getCurrentUser();


                if (!activeUser) {

                    alert(
                        "Please log in to comment."
                    );

                    if (
                        typeof openLoginModal ===
                        "function"
                    ) {
                        openLoginModal();
                    }

                    return;
                }


                const artworks =
                    getAllArtworks();

                const artwork =
                    artworks[id];


                if (!artwork) {
                    return;
                }


                artwork.comments =
                    Array.isArray(
                        artwork.comments
                    )
                        ? artwork.comments
                        : [];


                artwork.comments.push({

                    user:
                        activeUser.name ||
                        activeUser.username ||
                        "@you",

                    text:
                        text

                });


                localStorage.setItem(
                    "comments_" + id,
                    JSON.stringify(
                        artwork.comments
                    )
                );


                modalCommentInput.value =
                    "";


                displayComments(
                    artwork
                );

            }
        );
    }


    /* =========================
       CLOSE MODAL
       ========================= */

    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeArtworkModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeArtworkModal();

                }

            }
        );

    }


    /* =========================
       LOGIN BUTTON
       ========================= */

    if (savedLoginBtn) {

        savedLoginBtn.addEventListener(
            "click",
            function () {

                if (
                    typeof openLoginModal ===
                    "function"
                ) {

                    openLoginModal();

                }

            }
        );

    }


    /* =========================
       INITIAL LOAD
       ========================= */

    renderSavedArt();


    /* =========================
       REFRESH WHEN STORAGE CHANGES
       ========================= */

    window.addEventListener(
        "storage",
        function () {

            renderSavedArt();

        }
    );

});