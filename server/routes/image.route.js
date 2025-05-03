import express from 'express';
import { getSearchHistory,  searchImagesController } from '../controller/image.controller.js';

const ImageRouter = express.Router();

ImageRouter.get('/image',searchImagesController);
ImageRouter.get('/searchHistory',getSearchHistory);

export default ImageRouter;