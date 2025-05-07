import express from 'express';
import { getSearchHistory,  searchImagesController } from '../controller/image.controller.js';
import { protectRoute } from '../middleware/check.auth.js';

const ImageRouter = express.Router();

ImageRouter.get('/image',protectRoute,searchImagesController);
ImageRouter.get('/history',protectRoute,getSearchHistory);

export default ImageRouter;