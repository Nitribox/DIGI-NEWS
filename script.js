window.addEventListener("load", () => fetchNews("India"));

let curSelectedNav = null;

// Fetch news from serverless function
async function fetchNews(query) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "<p>Loading news...</p>";

    try {
        const res = await fetch(`/api/news?q=${query}`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            cardsContainer.innerHTML = "<p>No news found for this topic.</p>";
            return;
        }

        bindData(data.articles);
    } catch (err) {
        console.error("Error fetching news:", err);
        cardsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
    }
}

// Render news cards
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Fill data into a single card
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Navigation item click
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Optional: reload page
function reload() {
    window.location.reload();
}
