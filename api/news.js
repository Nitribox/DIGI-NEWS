export default async function handler(req, res) {
    const { q } = req.query;
    const API_KEY = process.env.NEWS_API_KEY;

    if (!API_KEY) return res.status(500).json({ error: "API key missing" });

    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${q}&apiKey=${API_KEY}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error("NewsAPI fetch error:", err);
        res.status(500).json({ error: "Failed to fetch news" });
    }
}
