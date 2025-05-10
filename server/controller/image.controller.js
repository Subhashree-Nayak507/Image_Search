import axios from 'axios';

export const searchImagesController = async (req, res) => {
    try {
        const { search: query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: process.env.PIXABAY_KEY,
                q: encodeURIComponent(query),
                per_page: 20,
                safesearch: true
            }
        });
        
        if (!response.data?.hits) {
            throw new Error("Invalid response from Pixabay API");
        }
        
        const images = response.data.hits.map(img => ({
            id: img.id,
            webformatURL: img.webformatURL,
            previewURL: img.previewURL,
            tags: img.tags ? img.tags.split(', ') : []
        }));
        
        return res.json({
            images,
            attribution: "Images from Pixabay"
        });
        
    } catch (error) {
        console.log("Error in searching images:", error);
        if (error.response?.status === 429) {
            return res.status(429).json({
                message: "Too many requests to Pixabay API"
            });
        }
        
        res.status(500).json({
            message: "Error in searching images",
            error: error.message
        });
    }
};