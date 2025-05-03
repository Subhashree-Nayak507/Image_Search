import axios from 'axios';
import Search from '../models/search.model.js';
import User from '../models/user.model.js';

export const searchImagesController = async (req, res) => {
    try {
        const { search: query } = req.query;
        const userId = req.user._id;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const cachedSearch = await Search.findOne({ 
            userId, 
            query 
        });
        if (cachedSearch) {
            const images = cachedSearch.imageIds.map(id => ({
                id,
                webformatURL: `https://pixabay.com/get/${id}-640.jpg`,
                previewURL: `https://pixabay.com/get/${id}-180.jpg`
            }));

            return res.json({
                source: 'cache',
                images,
                attribution: "Images from Pixabay"
            });
        }

        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: process.env.PIXABAY_KEY,
                q: encodeURIComponent(query),
                per_page: 20
            }
        });

        if (!response.data?.hits) {
            throw new Error("Invalid response from Pixabay API");
        }

        // Extract and transform data
        const images = response.data.hits.map(img => ({
            id: img.id,
            webformatURL: img.webformatURL,
            previewURL: img.previewURL,
            tags: img.tags.split(', ')
        }));

        const newSearch = await Search.create({
            userId,
            query,
            imageIds: images.map(img => img.id),
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) 
        });

        await User.findByIdAndUpdate(userId, {
            $push: { searchHistory: newSearch._id }
        });

        res.json({
            source: 'api',
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
            message: "Error in searching images"
        });
    }
};

export const getSearchHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId)
            .populate({
                path: 'searchHistory',
                select: 'query imageIds createdAt',
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const history = user.searchHistory.map(search => ({
            query: search.query,
            images: search.imageIds.map(id => ({
                id,
                thumbnail: `https://pixabay.com/get/${id}-180.jpg`
            })),
            date: search.createdAt
        }));

        res.json(history);

    } catch (error) {
        console.log("Error fetching search history:", error);
        res.status(500).json({
            message: "Error fetching search history"
        });
    }
};