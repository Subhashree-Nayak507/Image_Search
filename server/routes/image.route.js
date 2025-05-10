import express from 'express';
import {   searchImagesController } from '../controller/image.controller.js';
import { protectRoute } from '../middleware/check.auth.js';

const ImageRouter = express.Router();

ImageRouter.get('/image',protectRoute,searchImagesController);

export default ImageRouter;